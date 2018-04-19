import { Registers, Conditions, ShiftType, MSRFields } from './disassemble';

export function get_fields(name, word) {
    switch(name) {        case 'bx_reg': return { Rm: Registers[(word & 0xf) >>> 0], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ] };
        case 'blx_reg': return { Rm: Registers[(word & 0xf) >>> 0], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ] };
        case 'b_imm': return { 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], 'imm': (word & 0xffffff) << 8 >> 8 };
        case 'bl_imm': return { 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], 'imm': (word & 0xffffff) << 8 >> 8 };
        case 'stc': return { cp_num: (word & 0xf00) >>> 8, CRd: (word & 0xf000) >>> 12, imm: (word & 0xff) >>> 0, N: (word & 0x400000) >>> 22, P: (word & 0x1000000) >>> 24, U: (word & 0x800000) >>> 23, W: (word & 0x200000) >>> 21, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'ldc': return { cp_num: (word & 0xf00) >>> 8, CRd: (word & 0xf000) >>> 12, imm: (word & 0xff) >>> 0, N: (word & 0x400000) >>> 22, P: (word & 0x1000000) >>> 24, U: (word & 0x800000) >>> 23, W: (word & 0x200000) >>> 21, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'cdp': return { cp_num: (word & 0xf00) >>> 8, op1: (word & 0xf00000) >>> 20, op2: (word & 0xe0) >>> 5, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], CRd: (word & 0xf000) >>> 12, CRn: (word & 0xf0000) >>> 16, CRm: (word & 0xf) >>> 0 };
        case 'mcr': return { cp_num: (word & 0xf00) >>> 8, op1: (word & 0xe00000) >>> 21, op2: (word & 0xe0) >>> 5, Rd: Registers[(word & 0xf000) >>> 12], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], CRn: (word & 0xf0000) >>> 16, CRm: (word & 0xf) >>> 0 };
        case 'mrc': return { cp_num: (word & 0xf00) >>> 8, op1: (word & 0xe00000) >>> 21, op2: (word & 0xe0) >>> 5, Rd: Registers[(word & 0xf000) >>> 12], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], CRn: (word & 0xf0000) >>> 16, CRm: (word & 0xf) >>> 0 };
        case 'swi_imm': return { 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], 'imm': (word & 0xffffff) << 8 >> 8 };
        case 'and_shift_imm': return { shift: (word & 0xf80) >>> 7, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'eor_shift_imm': return { shift: (word & 0xf80) >>> 7, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'sub_shift_imm': return { shift: (word & 0xf80) >>> 7, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'rsb_shift_imm': return { shift: (word & 0xf80) >>> 7, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'add_shift_imm': return { shift: (word & 0xf80) >>> 7, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'adc_shift_imm': return { shift: (word & 0xf80) >>> 7, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'sbc_shift_imm': return { shift: (word & 0xf80) >>> 7, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'rsc_shift_imm': return { shift: (word & 0xf80) >>> 7, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'tst_shift_imm': return { 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5, shift: (word & 0xf80) >>> 7 };
        case 'teq_shift_imm': return { 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5, shift: (word & 0xf80) >>> 7 };
        case 'cmp_shift_imm': return { 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5, shift: (word & 0xf80) >>> 7 };
        case 'cmn_shift_imm': return { 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5, shift: (word & 0xf80) >>> 7 };
        case 'orr_shift_imm': return { shift: (word & 0xf80) >>> 7, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'mov_shift_imm': return { shift: (word & 0xf80) >>> 7, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], typ: (word & 0x60) >>> 5 };
        case 'bic_shift_imm': return { shift: (word & 0xf80) >>> 7, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'mvn_shift_imm': return { shift: (word & 0xf80) >>> 7, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], typ: (word & 0x60) >>> 5 };
        case 'and_shift_reg': return { Rs: Registers[(word & 0xf00) >>> 8], Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'eor_shift_reg': return { Rs: Registers[(word & 0xf00) >>> 8], Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'sub_shift_reg': return { Rs: Registers[(word & 0xf00) >>> 8], Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'rsb_shift_reg': return { Rs: Registers[(word & 0xf00) >>> 8], Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'add_shift_reg': return { Rs: Registers[(word & 0xf00) >>> 8], Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'adc_shift_reg': return { Rs: Registers[(word & 0xf00) >>> 8], Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'sbc_shift_reg': return { Rs: Registers[(word & 0xf00) >>> 8], Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'rsc_shift_reg': return { Rs: Registers[(word & 0xf00) >>> 8], Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'tst_shift_reg': return { 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5, Rs: Registers[(word & 0xf00) >>> 8] };
        case 'teq_shift_reg': return { 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5, Rs: Registers[(word & 0xf00) >>> 8] };
        case 'cmp_shift_reg': return { 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5, Rs: Registers[(word & 0xf00) >>> 8] };
        case 'cmn_shift_reg': return { 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5, Rs: Registers[(word & 0xf00) >>> 8] };
        case 'orr_shift_reg': return { Rs: Registers[(word & 0xf00) >>> 8], Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'mov_shift_reg': return { Rs: Registers[(word & 0xf00) >>> 8], Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], typ: (word & 0x60) >>> 5 };
        case 'bic_shift_reg': return { Rs: Registers[(word & 0xf00) >>> 8], Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'mvn_shift_reg': return { Rs: Registers[(word & 0xf00) >>> 8], Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], typ: (word & 0x60) >>> 5 };
        case 'and_rot_imm': return { 'rotate': ((word & 0xf00) >>> 8) * 2, imm: (word & 0xff) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'eor_rot_imm': return { 'rotate': ((word & 0xf00) >>> 8) * 2, imm: (word & 0xff) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'sub_rot_imm': return { 'rotate': ((word & 0xf00) >>> 8) * 2, imm: (word & 0xff) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'rsb_rot_imm': return { 'rotate': ((word & 0xf00) >>> 8) * 2, imm: (word & 0xff) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'add_rot_imm': return { 'rotate': ((word & 0xf00) >>> 8) * 2, imm: (word & 0xff) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'adc_rot_imm': return { 'rotate': ((word & 0xf00) >>> 8) * 2, imm: (word & 0xff) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'sbc_rot_imm': return { 'rotate': ((word & 0xf00) >>> 8) * 2, imm: (word & 0xff) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'rsc_rot_imm': return { 'rotate': ((word & 0xf00) >>> 8) * 2, imm: (word & 0xff) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'tst_rot_imm': return { 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16], 'rotate': ((word & 0xf00) >>> 8) * 2, imm: (word & 0xff) >>> 0 };
        case 'teq_rot_imm': return { 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16], 'rotate': ((word & 0xf00) >>> 8) * 2, imm: (word & 0xff) >>> 0 };
        case 'cmp_rot_imm': return { 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16], 'rotate': ((word & 0xf00) >>> 8) * 2, imm: (word & 0xff) >>> 0 };
        case 'cmn_rot_imm': return { 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16], 'rotate': ((word & 0xf00) >>> 8) * 2, imm: (word & 0xff) >>> 0 };
        case 'orr_rot_imm': return { 'rotate': ((word & 0xf00) >>> 8) * 2, imm: (word & 0xff) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'mov_rot_imm': return { Rd: Registers[(word & 0xf000) >>> 12], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'rotate': ((word & 0xf00) >>> 8) * 2, imm: (word & 0xff) >>> 0 };
        case 'bic_rot_imm': return { 'rotate': ((word & 0xf00) >>> 8) * 2, imm: (word & 0xff) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'mvn_rot_imm': return { Rd: Registers[(word & 0xf000) >>> 12], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'rotate': ((word & 0xf00) >>> 8) * 2, imm: (word & 0xff) >>> 0 };
        case 'swp': return { Rd: Registers[(word & 0xf000) >>> 12], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ] };
        case 'cswp': return { Rd: Registers[(word & 0xf000) >>> 12], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ] };
        case 'mul': return { Rd: Registers[(word & 0xf0000) >>> 16], Rm: Registers[(word & 0xf) >>> 0], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rs: Registers[(word & 0xf00) >>> 8] };
        case 'mla': return { Rs: Registers[(word & 0xf00) >>> 8], Rd: Registers[(word & 0xf0000) >>> 16], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf000) >>> 12] };
        case 'umull': return { RdLo: (word & 0xf000) >>> 12, Rs: Registers[(word & 0xf00) >>> 8], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], RdHi: (word & 0xf0000) >>> 16, Rm: Registers[(word & 0xf) >>> 0] };
        case 'umlal': return { RdLo: (word & 0xf000) >>> 12, Rs: Registers[(word & 0xf00) >>> 8], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], RdHi: (word & 0xf0000) >>> 16, Rm: Registers[(word & 0xf) >>> 0] };
        case 'smull': return { RdLo: (word & 0xf000) >>> 12, Rs: Registers[(word & 0xf00) >>> 8], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], RdHi: (word & 0xf0000) >>> 16, Rm: Registers[(word & 0xf) >>> 0] };
        case 'smlal': return { RdLo: (word & 0xf000) >>> 12, Rs: Registers[(word & 0xf00) >>> 8], 'S': ((word & 0x100000) >>> 20) ? "s" : "", 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], RdHi: (word & 0xf0000) >>> 16, Rm: Registers[(word & 0xf) >>> 0] };
        case 'mrs': return { Rd: Registers[(word & 0xf000) >>> 12], S: (word & 0x400000) >>> 22, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ] };
        case 'msr_reg': return { Rm: Registers[(word & 0xf) >>> 0], S: (word & 0x400000) >>> 22, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], field_mask: MSRFields[(word & 0xf0000) >>> 16] };
        case 'msr_rot_imm': return { 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], S: (word & 0x400000) >>> 22, 'rotate': ((word & 0xf00) >>> 8) * 2, imm: (word & 0xff) >>> 0, field_mask: MSRFields[(word & 0xf0000) >>> 16] };
        case 'str_post_shift_imm': return { B: (word & 0x400000) >>> 22 ? "b" : "", shift: (word & 0xf80) >>> 7, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rd: Registers[(word & 0xf000) >>> 12], U: (word & 0x800000) >>> 23, Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'ldr_post_shift_imm': return { B: (word & 0x400000) >>> 22 ? "b" : "", shift: (word & 0xf80) >>> 7, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rd: Registers[(word & 0xf000) >>> 12], U: (word & 0x800000) >>> 23, Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'strt_shift_imm': return { B: (word & 0x400000) >>> 22 ? "b" : "", shift: (word & 0xf80) >>> 7, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rd: Registers[(word & 0xf000) >>> 12], U: (word & 0x800000) >>> 23, Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'ldrt_shift_imm': return { B: (word & 0x400000) >>> 22 ? "b" : "", shift: (word & 0xf80) >>> 7, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rd: Registers[(word & 0xf000) >>> 12], U: (word & 0x800000) >>> 23, Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'str_pre_shift_imm': return { B: (word & 0x400000) >>> 22 ? "b" : "", shift: (word & 0xf80) >>> 7, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rd: Registers[(word & 0xf000) >>> 12], U: (word & 0x800000) >>> 23, Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'ldr_pre_shift_imm': return { B: (word & 0x400000) >>> 22 ? "b" : "", shift: (word & 0xf80) >>> 7, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rd: Registers[(word & 0xf000) >>> 12], U: (word & 0x800000) >>> 23, Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'str_pre_wb_shift_imm': return { B: (word & 0x400000) >>> 22 ? "b" : "", shift: (word & 0xf80) >>> 7, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rd: Registers[(word & 0xf000) >>> 12], U: (word & 0x800000) >>> 23, Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'ldr_pre_wb_shift_imm': return { B: (word & 0x400000) >>> 22 ? "b" : "", shift: (word & 0xf80) >>> 7, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rd: Registers[(word & 0xf000) >>> 12], U: (word & 0x800000) >>> 23, Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], typ: (word & 0x60) >>> 5 };
        case 'str_post_imm': return { B: (word & 0x400000) >>> 22 ? "b" : "", imm: (word & 0xfff) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], U: (word & 0x800000) >>> 23, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'ldr_post_imm': return { B: (word & 0x400000) >>> 22 ? "b" : "", imm: (word & 0xfff) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], U: (word & 0x800000) >>> 23, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'strt_imm': return { B: (word & 0x400000) >>> 22 ? "b" : "", imm: (word & 0xfff) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], U: (word & 0x800000) >>> 23, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'ldrt_imm': return { B: (word & 0x400000) >>> 22 ? "b" : "", imm: (word & 0xfff) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], U: (word & 0x800000) >>> 23, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'str_pre_imm': return { B: (word & 0x400000) >>> 22 ? "b" : "", imm: (word & 0xfff) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], U: (word & 0x800000) >>> 23, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'ldr_pre_imm': return { B: (word & 0x400000) >>> 22 ? "b" : "", imm: (word & 0xfff) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], U: (word & 0x800000) >>> 23, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'str_pre_wb_imm': return { B: (word & 0x400000) >>> 22 ? "b" : "", imm: (word & 0xfff) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], U: (word & 0x800000) >>> 23, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'ldr_pre_wb_imm': return { B: (word & 0x400000) >>> 22 ? "b" : "", imm: (word & 0xfff) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], U: (word & 0x800000) >>> 23, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'strh_post_reg': return { Rd: Registers[(word & 0xf000) >>> 12], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23 };
        case 'ldrh_post_reg': return { Rd: Registers[(word & 0xf000) >>> 12], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23 };
        case 'ldrsb_post_reg': return { Rd: Registers[(word & 0xf000) >>> 12], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23 };
        case 'ldrsh_post_reg': return { Rd: Registers[(word & 0xf000) >>> 12], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23 };
        case 'strh_pre_reg': return { Rd: Registers[(word & 0xf000) >>> 12], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23 };
        case 'ldrh_pre_reg': return { Rd: Registers[(word & 0xf000) >>> 12], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23 };
        case 'ldrsb_pre_reg': return { Rd: Registers[(word & 0xf000) >>> 12], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23 };
        case 'ldrsh_pre_reg': return { Rd: Registers[(word & 0xf000) >>> 12], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23 };
        case 'strh_pre_wb_reg': return { Rd: Registers[(word & 0xf000) >>> 12], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23 };
        case 'ldrh_pre_wb_reg': return { Rd: Registers[(word & 0xf000) >>> 12], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23 };
        case 'ldrsb_pre_wb_reg': return { Rd: Registers[(word & 0xf000) >>> 12], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23 };
        case 'ldrsh_pre_wb_reg': return { Rd: Registers[(word & 0xf000) >>> 12], Rm: Registers[(word & 0xf) >>> 0], Rn: Registers[(word & 0xf0000) >>> 16], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23 };
        case 'strh_post_imm': return { immH: (word & 0xf00) >>> 8, immL: (word & 0xf) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23, Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'ldrh_post_imm': return { immH: (word & 0xf00) >>> 8, immL: (word & 0xf) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23, Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'ldrsb_post_imm': return { immH: (word & 0xf00) >>> 8, immL: (word & 0xf) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23, Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'ldrsh_post_imm': return { immH: (word & 0xf00) >>> 8, immL: (word & 0xf) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23, Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'strh_pre_imm': return { immH: (word & 0xf00) >>> 8, immL: (word & 0xf) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23, Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'ldrh_pre_imm': return { immH: (word & 0xf00) >>> 8, immL: (word & 0xf) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23, Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'ldrsb_pre_imm': return { immH: (word & 0xf00) >>> 8, immL: (word & 0xf) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23, Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'ldrsh_pre_imm': return { immH: (word & 0xf00) >>> 8, immL: (word & 0xf) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23, Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'strh_pre_wb_imm': return { immH: (word & 0xf00) >>> 8, immL: (word & 0xf) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23, Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'ldrh_pre_wb_imm': return { immH: (word & 0xf00) >>> 8, immL: (word & 0xf) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23, Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'ldrsb_pre_wb_imm': return { immH: (word & 0xf00) >>> 8, immL: (word & 0xf) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23, Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'ldrsh_pre_wb_imm': return { immH: (word & 0xf00) >>> 8, immL: (word & 0xf) >>> 0, Rd: Registers[(word & 0xf000) >>> 12], 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], U: (word & 0x800000) >>> 23, Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'stm_reglist': return { reg_list: (word & 0xffff) >>> 0, P: (word & 0x1000000) >>> 24, S: (word & 0x400000) >>> 22, U: (word & 0x800000) >>> 23, W: (word & 0x200000) >>> 21, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
        case 'ldm_reglist': return { reg_list: (word & 0xffff) >>> 0, P: (word & 0x1000000) >>> 24, S: (word & 0x400000) >>> 22, U: (word & 0x800000) >>> 23, W: (word & 0x200000) >>> 21, 'cond': Conditions[ (word & 0xf0000000) >>> 28 ], Rn: Registers[(word & 0xf0000) >>> 16] };
    }
}
