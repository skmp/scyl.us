#include "types.h"
#include "imports.h"

#include "cop0.h"

static const uint32_t ROM_BASE = 0x1FC00000;
static const uint32_t ROM_SIZE = 512*1024;		// 512kB of rom
static const uint32_t RAM_BASE = 0;				// 4MB of RAM
static const uint32_t RAM_SIZE = 4*1024*1024;	// 4MB of RAM

static uint32_t ram[RAM_SIZE / sizeof(uint32_t)];
static const uint32_t rom[ROM_SIZE / sizeof(uint32_t)] = {'ESNI','!!TR'};

enum MemoryRegionFlags {
	FLAG_R = 1,
	FLAG_W = 2,
	FLAG_LAST = 4
};

typedef struct {
	uint32_t 			start;
	uint32_t 			end;
	const uint32_t* 	data;
	int 				flags;
} MemoryRegion;

const MemoryRegion memory_regions[] = {
	{ RAM_BASE, RAM_SIZE, ram, FLAG_R | FLAG_W    },
	{ ROM_BASE, ROM_SIZE, rom, FLAG_R | FLAG_LAST },
};

const MemoryRegion* getMemoryRegions() {
	return memory_regions;
}

uint32_t load(uint32_t logical, uint32_t code, uint32_t pc, uint32_t delayed) {
	uint32_t physical = translate(logical, code, pc, delayed);

	if (physical < sizeof(ram)) {
		return ram[physical >> 2];
	} else if (physical >= ROM_BASE && physical < (ROM_BASE + ROM_SIZE)) {
		physical = physical - ROM_BASE;

		if (physical >= sizeof(rom)) return 0;

		return rom[physical >> 2];
	} else {
		return read(physical, code, pc, delayed);
	}
}

void store(uint32_t logical, uint32_t value, uint32_t mask, uint32_t pc, uint32_t delayed) {
	uint32_t physical = translate(logical, 1, pc, delayed);

	if (physical < sizeof(ram)) {
		physical >>= 2;
		invalidate(physical, logical);
		ram[physical] = (ram[physical] & ~mask) | (value & mask);
	} else if (physical < ROM_BASE || physical >= (ROM_BASE + ROM_SIZE)) {
		write(physical, value, mask, pc, delayed);
	}
}
