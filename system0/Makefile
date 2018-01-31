BINARY = ../assets/system0.bin

OBJECTS = main.o startup.o
LD_SCRIPT = ./linker.x

ELFFILE = system0.elf
CODEROM = code.bin
DATAROM = data.bin

AS = mipsel-unknown-elf-as
CC = mipsel-unknown-elf-gcc
LD = mipsel-unknown-elf-ld
OBJCOPY = mipsel-unknown-elf-objcopy

TARGET = -march=r3000 -EL -mhard-float
ASFLAGS = $(TARGET)
CFLAGS = $(TARGET) -Wall -O3 -G0 -nostdlib -Wimplicit-function-declaration
LDFLAGS = -T $(LD_SCRIPT)

all: $(BINARY)

clean:
	rm -Rf  $(OBJECTS) $(CODEROM) $(DATAROM) $(BINARY) $(ELFFILE)

dump: $(ELFFILE)
	mipsel-unknown-elf-objdump -x -s -d $(ELFFILE)

$(BINARY): $(ELFFILE)
	$(OBJCOPY) -I elf32-littlemips -O binary -R ".data" $< $(CODEROM)
	$(OBJCOPY) -I elf32-littlemips -O binary -j ".data" $< $(DATAROM)
	cat $(CODEROM) $(DATAROM) >> $@

$(ELFFILE): $(OBJECTS) $(LD_SCRIPT)
	$(LD) $(LDFLAGS) -o $@ $(OBJECTS)

%.o: %.s
	$(AS) -o $@ $<

%.o: %.c
	$(CC) $(CFLAGS) -o $@ -c $<