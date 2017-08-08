export default {
    field: "opcode",
    fallback: "ReservedInstruction",
    0x00: {
        field: "funct",
        0x00: "SLL",
        0x02: "SRL",
        0x03: "SRA",
        0x04: "SLLV",
        0x06: "SRLV",
        0x07: "SRAV",
        0x08: "JR",
        0x09: "JALR",
        0x0C: "SYSCALL",
        0x0D: "BREAK",
        0x10: "MFHI",
        0x11: "MTHI",
        0x12: "MFLO",
        0x13: "MTLO",
        0x18: "MULT",
        0x19: "MULTU",
        0x1A: "DIV",
        0x1B: "DIVU",
        0x20: "ADD",
        0x21: "ADDU",
        0x22: "SUB",
        0x23: "SUBU",
        0x24: "AND",
        0x25: "OR",
        0x26: "XOR",
        0x27: "NOR",
        0x2A: "SLT",
        0x2B: "SLTU"
    },
    0x01: {
        field: "rt",
        0x00: "BLTZ",
        0x01: "BGEZ",
        0x10: "BLTZAL",
        0x11: "BGEZAL"
    },
    0x02: "J",
    0x03: "JAL",
    0x04: "BEQ",
    0x05: "BNE",
    0x06: "BLEZ",
    0x07: "BGTZ",
    0x08: "ADDI",
    0x09: "ADDIU",
    0x0A: "SLTI",
    0x0B: "SLTIU",
    0x0C: "ANDI",
    0x0D: "ORI",
    0x0E: "XORI",
    0x0F: "LUI",
    0x10: {
        field: "rs",
        0x00: "MFC0",
        0x02: "CFC0",
        0x04: "MTC0",
        0x06: "CTC0",
        0x10: {
            // Note: this does not match all the extra zeros
            field: "funct",
            0x01: "TLBR",
            0x02: "TLBWI",
            0x06: "TLBWR",
            0x08: "TLBP",
            0x10: "RFE"
        },
    },
    0x11: "CopUnusable",
    0x13: "CopUnusable",
    0x13: "CopUnusable",
    0x20: "LB",
    0x21: "LH",
    0x22: "LWL",
    0x23: "LW",
    0x24: "LBU",
    0x25: "LHU",
    0x26: "LWR",
    0x28: "SB",
    0x29: "SH",
    0x2A: "SWL",
    0x2B: "SW",
    0x2E: "SWR",
    0x30: "LWC0",
    0x31: "CopUnusable",
    0x13: "CopUnusable",
    0x33: "CopUnusable",
    0x38: "SWC0",
    0x39: "CopUnusable",
    0x13: "CopUnusable",
    0x3B: "CopUnusable"
};
