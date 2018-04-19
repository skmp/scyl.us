import { locate } from "./instructions";
import { get_fields } from "./fields";

export const Conditions = [ "eq", "ne", "cs", "cc", "mi", "pl", "vs", "vc", "hi", "ls", "ge", "lt", "gt", "le", "", "nv" ];
export const Registers = [ "r0", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r10", "r11", "r12", "sp", "lr", "pc" ];
export const ShiftType = ["lsl", "lsr", "asr", "ror"];
export const MSRFields = ["", "c", "x", "xc", "s", "sc", "sx", "sxc", "f", "fc", "fx", "fxc", "fs", "fsc", "fsx", "fsxc"];

export const instructions = {
	'undefined_op': _ => 'unk',
	'bx_reg': (fields, address) => `bx${fields.cond}\t${fields.Rn}`,
	'blx_reg': (fields, address) => `blx${fields.cond}\t${fields.Rm}`,
	'b_imm': (fields, address) => `b${fields.cond}\t#0x${((fields.imm << 2) + address + 8).toString(16)}`,
	'bl_imm': (fields, address) => `bl${fields.cond}\t#0x${((fields.imm << 2) + address + 8).toString(16)}`,
	'stc': _ => 'failed\tstc',
	'ldc': _ => 'failed\tldc',
	'cdp': _ => 'failed\tcdp',
	'mcr': _ => 'failed\tmcr',
	'mrc': _ => 'failed\tmrc',
	'swi_imm': fields => `swi${fields.cond}\t#0x#${fields.imm}`,
	'and_shift_imm': fields => `and${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'eor_shift_imm': fields => `eor${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'sub_shift_imm': fields => `sub${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'rsb_shift_imm': fields => `rsb${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'add_shift_imm': fields => `add${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'adc_shift_imm': fields => `adc${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'sbc_shift_imm': fields => `sbc${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'rsc_shift_imm': fields => `rsc${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'tst_shift_imm': fields => `tst${fields.cond}${fields.S}\t${fields.Rn}, ${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'teq_shift_imm': fields => `teq${fields.cond}${fields.S}\t${fields.Rn}, ${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'cmp_shift_imm': fields => `cmp${fields.cond}${fields.S}\t${fields.Rn}, ${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'cmn_shift_imm': fields => `cmn${fields.cond}${fields.S}\t${fields.Rn}, ${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'orr_shift_imm': fields => `orr${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'mov_shift_imm': fields => `mov${fields.cond}${fields.S}\t${fields.Rd}, ${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'bic_shift_imm': fields => `bic${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'mvn_shift_imm': fields => `mvn${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'and_shift_reg': fields => `and${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${fields.Rm}, ${ShiftType[fields.typ]} ${fields.Rs}`,
	'eor_shift_reg': fields => `eor${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${fields.Rm}, ${ShiftType[fields.typ]} ${fields.Rs}`,
	'sub_shift_reg': fields => `sub${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${fields.Rm}, ${ShiftType[fields.typ]} ${fields.Rs}`,
	'rsb_shift_reg': fields => `rsb${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${fields.Rm}, ${ShiftType[fields.typ]} ${fields.Rs}`,
	'add_shift_reg': fields => `add${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${fields.Rm}, ${ShiftType[fields.typ]} ${fields.Rs}`,
	'adc_shift_reg': fields => `adc${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${fields.Rm}, ${ShiftType[fields.typ]} ${fields.Rs}`,
	'sbc_shift_reg': fields => `sbc${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${fields.Rm}, ${ShiftType[fields.typ]} ${fields.Rs}`,
	'rsc_shift_reg': fields => `rsc${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${fields.Rm}, ${ShiftType[fields.typ]} ${fields.Rs}`,
	'tst_shift_reg': fields => `tst${fields.cond}${fields.S}\t${fields.Rn}, ${fields.Rm}, ${ShiftType[fields.typ]} ${fields.Rs}`,
	'teq_shift_reg': fields => `teq${fields.cond}${fields.S}\t${fields.Rn}, ${fields.Rm}, ${ShiftType[fields.typ]} ${fields.Rs}`,
	'cmp_shift_reg': fields => `cmp${fields.cond}${fields.S}\t${fields.Rn}, ${fields.Rm}, ${ShiftType[fields.typ]} ${fields.Rs}`,
	'cmn_shift_reg': fields => `cmn${fields.cond}${fields.S}\t${fields.Rn}, ${fields.Rm}, ${ShiftType[fields.typ]} ${fields.Rs}`,
	'orr_shift_reg': fields => `orr${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${fields.Rm}, ${ShiftType[fields.typ]} ${fields.Rs}`,
	'mov_shift_reg': fields => `mov${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rm}, ${ShiftType[fields.typ]} ${fields.Rs}`,
	'bic_shift_reg': fields => `bic${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${fields.Rm}, ${ShiftType[fields.typ]} ${fields.Rs}`,
	'mvn_shift_reg': fields => `mvn${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn},${fields.Rm}, ${ShiftType[fields.typ]} ${fields.Rs}`,
	'and_rot_imm': fields => `and${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.imm << fields.rotate) | (fields.imm >>> (32 - fields.rotate))}`,
	'eor_rot_imm': fields => `eor${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.imm << fields.rotate) | (fields.imm >>> (32 - fields.rotate))}`,
	'sub_rot_imm': fields => `sub${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.imm << fields.rotate) | (fields.imm >>> (32 - fields.rotate))}`,
	'rsb_rot_imm': fields => `rsb${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.imm << fields.rotate) | (fields.imm >>> (32 - fields.rotate))}`,
	'add_rot_imm': fields => `add${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.imm << fields.rotate) | (fields.imm >>> (32 - fields.rotate))}`,
	'adc_rot_imm': fields => `adc${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.imm << fields.rotate) | (fields.imm >>> (32 - fields.rotate))}`,
	'sbc_rot_imm': fields => `sbc${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.imm << fields.rotate) | (fields.imm >>> (32 - fields.rotate))}`,
	'rsc_rot_imm': fields => `rsc${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.imm << fields.rotate) | (fields.imm >>> (32 - fields.rotate))}`,
	'tst_rot_imm': fields => `tst${fields.cond}${fields.S}\t${fields.Rn}, ${(fields.imm << fields.rotate) | (fields.imm >>> (32 - fields.rotate))}`,
	'teq_rot_imm': fields => `teq${fields.cond}${fields.S}\t${fields.Rn}, ${(fields.imm << fields.rotate) | (fields.imm >>> (32 - fields.rotate))}`,
	'cmp_rot_imm': fields => `cmp${fields.cond}${fields.S}\t${fields.Rn}, ${(fields.imm << fields.rotate) | (fields.imm >>> (32 - fields.rotate))}`,
	'cmn_rot_imm': fields => `cmn${fields.cond}${fields.S}\t${fields.Rn}, ${(fields.imm << fields.rotate) | (fields.imm >>> (32 - fields.rotate))}`,
	'orr_rot_imm': fields => `orr${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.imm << fields.rotate) | (fields.imm >>> (32 - fields.rotate))}`,
	'mov_rot_imm': fields => `mov${fields.cond}${fields.S}\t${fields.Rd}, ${(fields.imm << fields.rotate) | (fields.imm >>> (32 - fields.rotate))}`,
	'bic_rot_imm': fields => `bic${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.imm << fields.rotate) | (fields.imm >>> (32 - fields.rotate))}`,
	'mvn_rot_imm': fields => `mvn${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rn}, ${(fields.imm << fields.rotate) | (fields.imm >>> (32 - fields.rotate))}`,
	'swp': fields => `swp${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rm}, ${Rs}, ${fields.Rn}`,
	'cswp': fields => `cswp${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rm}, ${Rs}, ${fields.Rn}`,
	'mul': fields => `mul${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rm}, ${Rs}`,
	'mla': fields => `mla${fields.cond}${fields.S}\t${fields.Rd}, ${fields.Rm}, ${Rs}, ${fields.Rn}`,
	'umull': fields => `umull${fields.cond}${fields.S}\t${RdLo}, ${RdHi}, ${fields.Rm}, ${Rs}`,
	'umlal': fields => `umlal${fields.cond}${fields.S}\t${RdLo}, ${RdHi}, ${fields.Rm}, ${Rs}`,
	'smull': fields => `smull${fields.cond}${fields.S}\t${RdLo}, ${RdHi}, ${fields.Rm}, ${Rs}`,
	'smlal': fields => `smlal${fields.cond}${fields.S}\t${RdLo}, ${RdHi}, ${fields.Rm}, ${Rs}`,
	'mrs': fields => `mrs${fields.cond}\t${fields.Rd}, ${fields.S ? 'spsr' : 'cspr'}`,
	'msr_reg': fields => `msr${fields.cond}\t${fields.S ? 'spsr' : 'cspr'}_${field_mask}, ${fields.Rm}`,
	'msr_rot_imm': fields => `msr${fields.cond}\t${fields.S ? 'spsr' : 'cspr'}_${field_mask}, ${(fields.imm << fields.rotate) | (fields.imm >>> (32 - fields.rotate))}`,
	'str_post_shift_imm': fields => `str${fields.cond}${fields.B}\t${fields.Rd}, [${fields.Rn}], #${fields.U ? '' : '-'}${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'ldr_post_shift_imm': fields => `ldr${fields.cond}${fields.B}\t${fields.Rd}, [${fields.Rn}], #${fields.U ? '' : '-'}${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'strt_shift_imm': fields => `str${fields.cond}${fields.B}t\t${fields.Rd}, [${fields.Rn}], #${fields.U ? '' : '-'}${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'ldrt_shift_imm': fields => `ldr${fields.cond}${fields.B}t\t${fields.Rd}, [${fields.Rn}], #${fields.U ? '' : '-'}${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}`,
	'str_pre_shift_imm': fields => `str${fields.cond}${fields.B}\t${fields.Rd}, [${fields.Rn}, #${fields.U ? '' : '-'}${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}]`,
	'ldr_pre_shift_imm': fields => `ldr${fields.cond}${fields.B}\t${fields.Rd}, [${fields.Rn}, #${fields.U ? '' : '-'}${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}]`,
	'str_pre_wb_shift_imm': fields => `str${fields.cond}${fields.B}\t${fields.Rd}, [${fields.Rn}, #${fields.U ? '' : '-'}${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}]!`,
	'ldr_pre_wb_shift_imm': fields => `ldr${fields.cond}${fields.B}\t${fields.Rd}, [${fields.Rn}, #${fields.U ? '' : '-'}${(fields.typ || fields.shift) ? `${fields.Rm}, ${ShiftType[fields.typ]} #${fields.shift}` : fields.Rm}]!`,
	'str_post_imm': fields => `str${fields.cond}${fields.B}\t${fields.Rd}, [${fields.Rn}], #${fields.U ? '' : '-'}${fields.imm}`,
	'ldr_post_imm': fields => `ldr${fields.cond}${fields.B}\t${fields.Rd}, [${fields.Rn}], #${fields.U ? '' : '-'}${fields.imm}`,
	'strt_imm': fields => `str${fields.cond}${fields.B}t\t${fields.Rd}, [${fields.Rn}], #${fields.U ? '' : '-'}${fields.imm}`,
	'ldrt_imm': fields => `ldr${fields.cond}${fields.B}t\t${fields.Rd}, [${fields.Rn}], #${fields.U ? '' : '-'}${fields.imm}`,
	'str_pre_imm': fields => `str${fields.cond}${fields.B}\t${fields.Rd}, [${fields.Rn}, #${fields.U ? '' : '-'}${fields.imm}]`,
	'ldr_pre_imm': fields => `ldr${fields.cond}${fields.B}\t${fields.Rd}, [${fields.Rn}, #${fields.U ? '' : '-'}${fields.imm}]`,
	'str_pre_wb_imm': fields => `str${fields.cond}${fields.B}\t${fields.Rd}, [${fields.Rn}, #${fields.U ? '' : '-'}${fields.imm}]!`,
	'ldr_pre_wb_imm': fields => `ldr${fields.cond}${fields.B}\t${fields.Rd}, [${fields.Rn}, #${fields.U ? '' : '-'}${fields.imm}]!`,
	'strh_post_reg': fields => `strh${fields.cond}\t${fields.Rd}, [${fields.Rn}], ${fields.U ? '' : '-'}${fields.Rn}`,
	'ldrh_post_reg': fields => `ldrh${fields.cond}\t${fields.Rd}, [${fields.Rn}], ${fields.U ? '' : '-'}${fields.Rn}`,
	'ldrsb_post_reg': fields => `ldrsb${fields.cond}\t${fields.Rd}, [${fields.Rn}], ${fields.U ? '' : '-'}${fields.Rn}`,
	'ldrsh_post_reg': fields => `ldrsh${fields.cond}\t${fields.Rd}, [${fields.Rn}], ${fields.U ? '' : '-'}${fields.Rn}`,
	'strh_pre_reg': fields => `strh${fields.cond}\t${fields.Rd}, [${fields.Rn}, ${fields.U ? '' : '-'}${fields.Rn}]`,
	'ldrh_pre_reg': fields => `ldrh${fields.cond}\t${fields.Rd}, [${fields.Rn}, ${fields.U ? '' : '-'}${fields.Rn}]`,
	'ldrsb_pre_reg': fields => `ldrsb${fields.cond}\t${fields.Rd}, [${fields.Rn}, ${fields.U ? '' : '-'}${fields.Rn}]`,
	'ldrsh_pre_reg': fields => `ldrsh${fields.cond}\t${fields.Rd}, [${fields.Rn}, ${fields.U ? '' : '-'}${fields.Rn}]`,
	'strh_pre_wb_reg': fields => `strh${fields.cond}\t${fields.Rd}, [${fields.Rn}, ${fields.U ? '' : '-'}${fields.Rn}]!`,
	'ldrh_pre_wb_reg': fields => `ldrh${fields.cond}\t${fields.Rd}, [${fields.Rn}, ${fields.U ? '' : '-'}${fields.Rn}]!`,
	'ldrsb_pre_wb_reg': fields => `ldrsb${fields.cond}\t${fields.Rd}, [${fields.Rn}, ${fields.U ? '' : '-'}${fields.Rn}]!`,
	'ldrsh_pre_wb_reg': fields => `ldrsh${fields.cond}\t${fields.Rd}, [${fields.Rn}, ${fields.U ? '' : '-'}${fields.Rn}]!`,
	'strh_post_imm': fields => `strh${fields.cond}\t${fields.Rd}, [${fields.Rn}], ${fields.U ? '' : '-'}#${(fields.immH << 4) | fields.immL}`,
	'ldrh_post_imm': fields => `ldrh${fields.cond}\t${fields.Rd}, [${fields.Rn}], ${fields.U ? '' : '-'}#${(fields.immH << 4) | fields.immL}`,
	'ldrsb_post_imm': fields => `ldrsb${fields.cond}\t${fields.Rd}, [${fields.Rn}], ${fields.U ? '' : '-'}#${(fields.immH << 4) | fields.immL}`,
	'ldrsh_post_imm': fields => `ldrsh${fields.cond}\t${fields.Rd}, [${fields.Rn}], ${fields.U ? '' : '-'}#${(fields.immH << 4) | fields.immL}`,
	'strh_pre_imm': fields => `strh${fields.cond}\t${fields.Rd}, [${fields.Rn}, ${fields.U ? '' : '-'}#${(fields.immH << 4) | fields.immL}]`,
	'ldrh_pre_imm': fields => `ldrh${fields.cond}\t${fields.Rd}, [${fields.Rn}, ${fields.U ? '' : '-'}#${(fields.immH << 4) | fields.immL}]`,
	'ldrsb_pre_imm': fields => `ldrsb${fields.cond}\t${fields.Rd}, [${fields.Rn}, ${fields.U ? '' : '-'}#${(fields.immH << 4) | fields.immL}]`,
	'ldrsh_pre_imm': fields => `ldrsh${fields.cond}\t${fields.Rd}, [${fields.Rn}, ${fields.U ? '' : '-'}#${(fields.immH << 4) | fields.immL}]`,
	'strh_pre_wb_imm': fields => `strh${fields.cond}\t${fields.Rd}, [${fields.Rn}, ${fields.U ? '' : '-'}#${(fields.immH << 4) | fields.immL}]!`,
	'ldrh_pre_wb_imm': fields => `ldrh${fields.cond}\t${fields.Rd}, [${fields.Rn}, ${fields.U ? '' : '-'}#${(fields.immH << 4) | fields.immL}]!`,
	'ldrsb_pre_wb_imm': fields => `ldrsb${fields.cond}\t${fields.Rd}, [${fields.Rn}, ${fields.U ? '' : '-'}#${(fields.immH << 4) | fields.immL}]!`,
	'ldrsh_pre_wb_imm': fields => `ldrsh${fields.cond}\t${fields.Rd}, [${fields.Rn}, ${fields.U ? '' : '-'}#${(fields.immH << 4) | fields.immL}]!`,
	'stm_reglist': _ => 'failed\tstm_reglist',
	'ldm_reglist': _ => 'failed\tldm_reglist'
};

export function disassemble(word, address) {
	const op_name = locate(word);
	const fields = get_fields(op_name, word);

	return instructions[op_name](fields, address);
}