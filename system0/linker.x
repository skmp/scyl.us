SECTIONS
{
	.text 0x00000000 : {
		*(.reset)
		*(.text)
		*(.rodata)
		*(.init)
		*(.fini)
	}
	. = ALIGN(8);
	_DATA_ROM = .;

	. = 0xE0020000;
	_STACK_TOP = .;
	_DATA_START = .;
	.data : {
		*(.init_array)
		*(.fini_array)
		*(.data)
	}
	. = ALIGN(4);
   	_DATA_SIZE = . - _DATA_START;

   	.bss : { *(.bss) }
}
