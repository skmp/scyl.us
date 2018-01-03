import Exception from "./exception";
import { locate, Compiler } from "./instructions";
import { read, write } from "..";

import { MAX_COMPILE_SIZE, MIN_COMPILE_SIZE, Exceptions } from "./consts";

const _environment = {
	exception: (code, pc, delayed, cop) => {
		throw new Exception(code, pc, delayed, cop);
	},
	execute: (pc, delayed) => _execute(pc, delayed),
	read: (physical, code, pc, delayed) => {
		try {
			return read(code, physical >>> 0);
		} catch (e) {
			throw new Exception(e, pc, delayed, 0);
		}
	},
	write: (physical, value, mask, pc, delayed) => {
		try {
			write(physical, value, mask);
		} catch (e) {
			throw new Exception(e, pc, delayed, 0);
		}
	},
	invalidate: (physical, logical) => {
		// Invalidate cache line
		const cache_line = physical & ~(_blockSize(logical) - 1);
		const entry = cache[cache_line];

		// Clear this row out (de-reference the function so we don't leak)
		if (entry) {
			entry.code = null;
			cache[cache_line] = null;
		}
	}
};

const cache = [];
const regions = [];

var compiler, wasm_exports;
var registers;
var timer;

/*******
** Runtime section
*******/
export function initialize() {
	return fetch("core.wasm")
		.then((blob) => blob.arrayBuffer())
		.then((ab) => {
			compiler = new Compiler(ab);

			return WebAssembly.instantiate(ab, {
				env: _environment
			});
		})
		.then((module) => {
			wasm_exports =  module.instance.exports;

			const memory = wasm_exports.memory.buffer;

			let addr = wasm_exports.getMemoryRegions();
			let flags;

			do {
				let region = new Uint32Array(memory, addr, 4);
				flags = region[3];
				addr += 16;

				regions.push({
					start: region[0],
					length: region[1],
					end: region[0]+region[1],
					flags: region[3],
					buffer: new Uint8Array(memory, region[2], region[1])
				});
			} while(~flags & 4);

			registers = new Uint32Array(memory, wasm_exports.getRegisterAddress(), 64);

			reset();
		});
}

// Helper values for the magic registers
export class Registers {
	/**
	 Register mapping:
	 ** 32: lo
	 ** 33: hi
	 ** 34: pc
	 ** 35: start_pc
	 ** 36: clocks (int)
	 **/
	static get lo() {
		return registers[32];
	}

	static get hi() {
		return registers[33];
	}

	static get pc() {
		return registers[34];
	}

	static set pc(v) {
		registers[34] = v;
	}

	static get start_pc() {
		return registers[35];
	}

	static set start_pc(v) {
		registers[35] = v;
	}

	static get clocks() {
		return registers[36] >> 0;
	}

	static get (index) {
		return registers[index];
	}

	static set clocks(v) {
		registers[36] = v;
	}
}

// Execution core
export function reset() {
	timer = 0;

	wasm_exports.reset();
}

	// Execute a single frame
export function tick (ticks) {
	// Advance clock, with 0.1 sec a max 'lag' time
	const _prev = wasm_exports.add_clocks(ticks);

	while (Registers.clocks > 0) {
		const block_size = _blockSize(Registers.pc);
		const block_mask = ~(block_size - 1);
		const physical = (wasm_exports.translate(Registers.pc, false, Registers.pc, false) & block_mask) >>> 0;
		const logical = (Registers.pc & block_mask) >>> 0;

		var funct = cache[physical];

		if (funct === undefined || !funct.code || funct.logical !== logical) {
			const defs = compiler.compile(logical, block_size / 4, (address) => {
				// Do not assemble past block end (fallback to intepret)
				if (address >= logical + block_size) {
					return null;
				}

				try {
					var word = load(address);
					return locate(word);
				} catch(e) {
					// There was a loading error, fallback to interpret
					return null;
				}
			});

			WebAssembly.instantiate(defs, {
				env: _environment,
				core: wasm_exports
			}).then((result) => {
				const funct = {
					code: result.instance.exports.block,
					logical: logical
				};

				for (let start = physical; start < physical + block_size; start += MIN_COMPILE_SIZE) {
					cache[start] = funct;
				}

				// Resume execution after the JIT core completes
				tick();
			});

			// Execution has paused, waiting for compiler to finish
			return false;
		}

		try {
			funct.code();
		} catch (e) {
			if (e instanceof Exception) {
				wasm_exports.trap(e.exception, e.pc, e.delayed, e.coprocessor);
			} else {
				throw e;
			}
		}
	}

	timer += _prev - Registers.clocks;
	wasm_exports.handle_interrupt();
	return true;
}

export function step () {
	const _prev = Registers.clocks;

	try {
		Registers.start_pc = Registers.pc;
		Registers.pc += 4;

		_execute(Registers.start_pc, false);
		Registers.clocks--;	// Could be off by one, don't mind that much
	} catch (e) {
		if (e instanceof Exception) {
			wasm_exports.trap(e.exception, e.pc, e.delayed, e.coprocessor);
		} else {
			throw e;
		}
	}

	timer += _prev - Registers.clocks;
	wasm_exports.handle_interrupt();
}

export function load (word, pc) {
	return wasm_exports.load(word, pc);
}

// This forces delay slots at the end of a page to
// be software interpreted so TLB changes don't
// cause cache failures
function _execute(pc, delayed) {
	const data = load(pc, true, pc, delayed);
	const call = locate(data);

	wasm_exports[call.name](pc, data, delayed);
}

function _blockSize(address) {
	if ((address & 0xC0000000) !== (0x80000000 >> 0)) {
		return MIN_COMPILE_SIZE;
	} else if (address >= 0x1FC00000 && address < 0x1FC80000) {
		return MAX_COMPILE_SIZE;
	} else {
		return MIN_COMPILE_SIZE;
	}
}

