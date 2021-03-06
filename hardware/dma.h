#pragma once

#define MAX_DMA_CHANNELS   8

enum {
   DMA_TRIGGER_NONE         = 0x00000000,
   DMA_TRIGGER_DMA0         = 0x00010000,
   DMA_TRIGGER_DMA1         = 0x00020000,
   DMA_TRIGGER_DMA2         = 0x00030000,
   DMA_TRIGGER_DMA3         = 0x00040000,
   DMA_TRIGGER_DMA4         = 0x00050000,
   DMA_TRIGGER_DMA5         = 0x00060000,
   DMA_TRIGGER_DMA6         = 0x00070000,
   DMA_TRIGGER_DMA7         = 0x00080000,
   DMA_TRIGGER_GPU_TX_FIFO  = 0x00090000,
   DMA_TRIGGER_GPU_RX_FIFO  = 0x000A0000,
   DMA_TRIGGER_DSP_IDLE     = 0x000B0000,
   DMA_TRIGGER_DSP_FINISHED = 0x000C0000
};

enum {
   DMA_WIDTH_BIT8  = 0x00100000,
   DMA_WIDTH_BIT16 = 0x00200000,
   DMA_WIDTH_BIT32 = 0x00000000
};

#define DMACR_ACTIVE_MASK     0x80000000
#define DMACR_EXCEPTION_MASK  0x40000000
#define DMACR_CHAIN_S_MASK    0x20000000
#define DMACR_CHAIN_T_MASK    0x10000000
#define DMACR_INTERRUPT_MASK  0x08000000
#define DMACR_WIDTH_MASK      0x00300000
#define DMACR_TRIGGER_MASK    0x000F0000
#define DMACR_SSTRIDE_MASK    0x000000FF
#define DMACR_SSTRIDE_POS     0

#define DMACR_TSTRIDE_MASK    0x0000FF00
#define DMACR_TSTRIDE_POS     8


typedef struct {
   uint32_t length;
   uint32_t source;
   uint32_t target;
   uint32_t flags;
} DMAChannel;

static volatile DMAChannel* const DMA_Channels = (DMAChannel*) (DMA_BASE + KERNEL_UNMAPPED);
