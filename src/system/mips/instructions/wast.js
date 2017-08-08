import Export from "../../../dynast/export";
import Import from "../../../dynast/import";

import Instructions from "./base";

class Registers {
	constructor() {
		this._set = {};
	}

	push() {

	}

	pop() {

	}

	get(type) {
		if (this._set[type] === undefined) {
			this._set[type] = [];
		}

		const obj = {
			tee: { op: 'tee_local' },
			get: { op: 'get_local' },
			set: { op: 'set_local' }
		};

		this._set[type].push(obj);
		return obj;
	}

	bake() {
		var index = 0;

		return Object.keys(this._set).map((type) => {
			var group = this._set[type];

			group.forEach((k) => {
				k.tee.index =
				k.set.index =
				k.get.index = index++
			});
			return { count: group.length, type: type }
		})
	}
}

function template(func) {
	const locals = func.type.parameters.concat();
	const parameters = func.type.parameters.length;
	const modified = [];

	// Unroll locals
	func.locals.forEach((group) => {
		for (var i = 0; i < group.count; i++) locals.push(group.type);
	});

	// Process backwards
	const code = func.code;
	var i = code.length - 1;
	var depth = -1;

	while (i >= 0) {
		const term = code[i];
		const op = (typeof term === 'string') ? term : term.op;

		switch (op) {
		case "end":
			depth++;
			break ;
		case "if":
		case "loop":
		case "block":
			depth--;
			break ;
		case "set_local":
			if (term.index < parameters) console.error("Cannot assign to parameter");
		}

		modified.unshift(term);
		i--;
	}

	//console.log(modified);

	return { parameters, locals, modified };
}

export class Compiler {
	constructor(ab) {
		const defs = Import(ab);

		// Validate
		const exported_functions =
			defs.export_section.filter((v) => v.kind === 'func_type').length;
		const imported_functions =
			defs.import_section.filter((v) => v.type.type === 'func_type').length;

		if (exported_functions !== defs.function_section.length) {
			throw new Error("Core module cannot contain private functions");
		}

		this._base = {
			magicNumber: 0x6d736100,
			version: 1,

			export_section: [
				{
            		"field": "block",
            		"kind": "func_type",
            		"index": exported_functions + imported_functions + 1
				}
			],
			import_section: defs.import_section.concat(
				defs.export_section.map((i) => {
					switch (i.kind) {
					case 'memory_type':
						return {
		            			"module": "core",
		            			"field": i.field,
		            			"type": defs.memory_section[i.index]
		            		};
		            case 'func_type':
						return {
		            			"module": "core",
		            			"field": i.field,
		            			"type": defs.function_section[i.index - imported_functions].type
		            		};
		            default:
		            	throw new Error(`Cannot import ${i.kind}`)
		            }
				})
			)
		}


		this._base.import_section.push({
			"module": "env",
			"field": "debug",
			"type": {
				"type": "func_type",
				"parameters": ["i32"],
				"returns": []
			}
		});

		this._imports = {};
		var index = 0;
		this._base.import_section.forEach((imp, i) => {
			if (imp.type.type !== 'func_type') return ;
			this._imports[imp.field] = index++;
		})

		this._templates = {};
		defs.export_section.forEach((exp) => {
			if (exp.index < imported_functions || exp.kind !== 'func_type') return ;
			const func = defs.function_section[exp.index - imported_functions];

			console.log(exp.field);
			this._templates[exp.field] = template(func);
		});
	}

	compile(start, length, locate) {
		length = 8; // TEMPORARY

		const allocator = new Registers;
		const end = start + length * 4;
		const escapeTable = [];

		const START_PC = allocator.get('i32');

		var code = [
			// Calculate current PC table offset
			{ op: 'call', function_index: this._imports.getPC },
			{ op: 'i32.const', value: (start) >> 0 },
			"i32.sub",
			{ op: 'i32.const', value: 2 },
			"i32.shr_u",

			{ op: 'br_table', target_table: escapeTable, default_target: length }
		];

		const process = (pc, word, delayed, execute) => {

		}

		const func = (pc, delayed, escape_depth) => {
			var op = locate(pc);

			if (op === null) {
				return [
					{ op: 'i32.const', value: pc >> 0 },
					{ op: 'i32.const', value: delayed ? 1 : 0 },
			        { op: "call", function_index: this._imports.execute }
				];
			}

			allocator.push();
			const result = [];
			/*
			op.instruction(op, value(pc >> 0), value(delayed), () => delayed ? ["unreachable"] : [
				... func(pc + 4, 1, escape_depth),

				{ op: 'call', function_index: this._imports.getClocks },
				{ op: 'i32.const', value: (pc + 8) >> 0 },
				START_PC.get,
				"i32.sub",
				{ op: 'i32.const', value: 4 },
				"i32.div_u",
				"i32.sub"
				{ op: 'call', function_index: this._imports.setClocks },

				{ op: 'br', relative_depth: escape_depth }
			]);
			*/
			allocator.pop();

			return result;
		}

		for (var i = 0; i < length; i++) {
			escapeTable.push(i);

			code = [
				{ op: 'block', kind: 'void' },
				... code,
				"end",

				... func(start + i * 4, 0, length - i)
			];
		}

		// Fall through trap (continue to next execution cell)
		code.push(
			// Update PC
			{ op: 'i32.const', value: end >> 0 },
			{ op: 'call', function_index: this._imports.setPC },

			// Eat some cycles (based on PC)
			{ op: 'call', function_index: this._imports.getClocks },
			{ op: 'i32.const', value: end >> 0 },
			START_PC.get,
			"i32.sub",
			{ op: 'i32.const', value: 2 },
			"i32.shr_u",
			"i32.sub",
			{ op: 'call', function_index: this._imports.setClocks }
		);

		const function_body = [
			{ op: 'block', kind: 'void' },
				{ op: 'loop', kind: 'void' },
					// Log our beginning PC
					{ op: 'call', function_index: this._imports.getPC },
					START_PC.set,

					// Break when our clock runs out
					{ op: 'call', function_index: this._imports.getClocks },
					{ op: 'i32.const', value: 0 },
					"i32.le_s",
					{ op: 'br_if', relative_depth: 1 },

					// Default section
					{ op: 'block', kind: 'void' },
						{ op: 'block', kind: 'void' },
							... code,
						"end",

						// Escape from execution block
						"return",
					"end",
					{ op: 'br', relative_depth: 0 },
				"end",
			"end",
		    "end"	// End of function
		];

		const result = {
			function_section: [{
				type: { type: "func_type", parameters: [], returns: [] },
				locals: allocator.bake(),
				code: function_body
			}]
		};
		Object.assign(result, this._base);

		return Export(result);
	}
}
