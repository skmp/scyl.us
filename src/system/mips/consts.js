export const MAX_LOOPS = 5;

export const Registers = [
	"zero", "at", "v0", "v1", "a0", "a1", "a2", "a3",
	  "t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7",
	  "s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7",
	  "t8", "t9", "k0", "k1", "gp", "sp", "fp", "ra"
];

export const COP0Registers = [
	 "cop0dat0", "cop0dat1", "cop0dat2",      "BPC",
	 "cop0dat4",      "BDA", "JUMPDEST",     "DCIC",
	 "BadVaddr",     "BDAM","cop0dat10",     "BPCM",
	       "SR",    "CAUSE",      "EPC",     "PRID",
	"cop0dat16","cop0dat17","cop0dat18","cop0dat19",
	"cop0dat20","cop0dat21","cop0dat22","cop0dat23",
	"cop0dat24","cop0dat25","cop0dat26","cop0dat27",
	"cop0dat28","cop0dat29","cop0dat30","cop0dat31",
];

export const Exceptions = {
	Interrupt: 0x00,
	TLBMod: 0x01,
	TLBLoad: 0x02,
	TLBStore: 0x03,
	AddressLoad: 0x04,
	AddressStore: 0x05,
	BusErrorInstruction: 0x06,
	BusErrorData: 0x07,
	SysCall: 0x08,
	Breakpoint: 0x09,
	ReservedInstruction: 0x0A,
	CoprocessorUnusable: 0x0B,
	Overflow: 0x0C
};

export const ExceptionNames = {
	0x00: "Interrupt",
	0x01: "TLBMod",
	0x02: "TLBLoad",
	0x03: "TLBStore",
	0x04: "AddressLoad",
	0x05: "AddressStore",
	0x06: "BusErrorInstruction",
	0x07: "BusErrorData",
	0x08: "SysCall",
	0x09: "Breakpoint",
	0x0A: "ReservedInstruction",
	0x0B: "CoprocessorUnusable",
	0x0C: "Overflow",
};
