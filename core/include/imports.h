#pragma once

#include <stdint.h>

#define DEBUG(...) { \
   const uint32_t values[] = { __VA_ARGS__ }; \
   debug(&values[0], sizeof(values)); \
}

extern "C" {
	void debug(const uint32_t*, int);
	uint32_t exception(uint32_t code, uint32_t pc);
	void invalidate(uint32_t physical);
}

EXPORT void adjust_clock(int cycles);
EXPORT void execute(uint32_t);
