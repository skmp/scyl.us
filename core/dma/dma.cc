#include <stdint.h>
#include <stddef.h>
#include <string.h>

#include "system.h"

#include "compiler.h"
#include "imports.h"
#include "consts.h"

#include "dma.h"
#include "cop0.h"
#include "memory.h"
//#include "registers.h"
#include "memory.h"
#include "gpu.h"

#define WORD_LENGTH (sizeof(channels) / sizeof(uint32_t))

static union {
   DMAChannel channels[MAX_DMA_CHANNELS];
   uint32_t raw[WORD_LENGTH];
};

static bool active = false;

static inline uint32_t adjust(const int shift, const uint32_t value) {
   switch (shift) {
      case 1:  case -3: return (value >> 24) | (value <<  8);
      case 2:  case -2: return (value >> 16) | (value << 16);
      case 3:  case -1: return (value >>  8) | (value << 24);
      default: return value;
   }
}

static bool check_trigger(int channel) {
   switch (channel) {
   case DMA_TRIGGER_NONE: return true;
   case DMA_TRIGGER_DMA0: return (channels[0].flags & DMACR_ACTIVE_MASK) == 0;
   case DMA_TRIGGER_DMA1: return (channels[1].flags & DMACR_ACTIVE_MASK) == 0;
   case DMA_TRIGGER_DMA2: return (channels[2].flags & DMACR_ACTIVE_MASK) == 0;
   case DMA_TRIGGER_DMA3: return (channels[3].flags & DMACR_ACTIVE_MASK) == 0;
   case DMA_TRIGGER_DMA4: return (channels[4].flags & DMACR_ACTIVE_MASK) == 0;
   case DMA_TRIGGER_DMA5: return (channels[5].flags & DMACR_ACTIVE_MASK) == 0;
   case DMA_TRIGGER_DMA6: return (channels[6].flags & DMACR_ACTIVE_MASK) == 0;
   case DMA_TRIGGER_DMA7: return (channels[7].flags & DMACR_ACTIVE_MASK) == 0;
   case DMA_TRIGGER_GPU_TX_FIFO :return !GPU::tx_empty();
   case DMA_TRIGGER_GPU_RX_FIFO: return !GPU::rx_full();

   // Unimplemented (currently locks the channel)
   case DMA_TRIGGER_DSP_IDLE:
   case DMA_TRIGGER_DSP_FINISHED:
   default:
      return false;
   }
}

static inline bool chain(DMAChannel& channel) {
   if (channel.flags & (DMACR_CHAIN_S_MASK | DMACR_CHAIN_T_MASK)) {
      SystemException problem = EXCEPTION_NONE;

      channel.length = Memory::read(channel.source, false, problem);
      channel.source += (channel.flags & DMACR_SSTRIDE_MASK) >> DMACR_SSTRIDE_POS;
      int clocks = 1;

      if (channel.flags & DMACR_CHAIN_T_MASK) {
         channel.target = Memory::read(channel.source, false, problem);
         channel.source += (channel.flags & DMACR_SSTRIDE_MASK) >> DMACR_SSTRIDE_POS;
         clocks ++;
      }

      if (channel.flags & DMACR_CHAIN_S_MASK) {
         channel.source = Memory::read(channel.source, false, problem);
         clocks ++;
      }

      adjust_clock(clocks);

      if (problem != EXCEPTION_NONE) {
         if (channel.flags & DMACR_INTERRUPT_MASK) COP0::interrupt(DMA_IRQn);

         channel.flags &= ~DMACR_ACTIVE_MASK;
         channel.flags |= DMACR_EXCEPTION_MASK;
      } else if (channel.length == 0) {
         if (channel.flags & DMACR_INTERRUPT_MASK) COP0::interrupt(DMA_IRQn);

         channel.flags &= ~DMACR_ACTIVE_MASK;
      } else {
         return true;
      }
   } else {
      channel.flags &= ~DMACR_ACTIVE_MASK;
      if (channel.flags & DMACR_INTERRUPT_MASK) COP0::interrupt(DMA_IRQn);
   }

   return false;
}

static inline bool fast_dma(DMAChannel& channel) {
   int word_width;

   // Cannot use triggers during a fast dma copy
   if (channel.flags & DMACR_TRIGGER_MASK) return false;

   // Verify alignment and stride
   switch (channel.flags & DMACR_WIDTH_MASK) {
      case DMA_WIDTH_BIT8:
         if ((channel.flags & DMACR_SSTRIDE_MASK) >> DMACR_SSTRIDE_POS != 1 || (channel.flags & DMACR_TSTRIDE_MASK) >> DMACR_TSTRIDE_POS != 1) return false;
         word_width = 1;
         break ;
      case DMA_WIDTH_BIT16:
         if ((channel.flags & DMACR_SSTRIDE_MASK) >> DMACR_SSTRIDE_POS != 2 || (channel.flags & DMACR_TSTRIDE_MASK) >> DMACR_TSTRIDE_POS != 2) return false;
         if ((channel.source | channel.target) & 1) return false;

         word_width = 2;
         break ;
      case DMA_WIDTH_BIT32:
         if ((channel.flags & DMACR_SSTRIDE_MASK) >> DMACR_SSTRIDE_POS != 4 || (channel.flags & DMACR_TSTRIDE_MASK) >> DMACR_TSTRIDE_POS != 4) return false;
         if ((channel.source | channel.target) & 3) return false;

         word_width = 4;
         break ;
      default:
         return false;
   }

   int length = channel.length * word_width;

   const uint8_t* src;
   uint8_t* trg;

   SystemException problem = EXCEPTION_NONE;
   uint32_t source = COP0::translate(channel.source, false, problem);
   uint32_t target = COP0::translate(channel.target,  true, problem);

   if (channel.source < 0xC0000000) {
      int max_length = 0x1000 - (channel.source & 0xFFF);
      if (length > max_length) length = max_length;
   }

   if (channel.target < 0xC0000000) {
      int max_length = 0x1000 - (channel.source & 0xFFF);
      if (length > max_length) length = max_length;
   }

   // Cannot translate through page table
   if (problem != EXCEPTION_NONE) {
      channel.flags |= DMACR_EXCEPTION_MASK;
      channel.flags &= ~DMACR_ACTIVE_MASK;
      if (channel.flags & DMACR_INTERRUPT_MASK) COP0::interrupt(DMA_IRQn);
      return true;
   }

   // Determine if source is in linear memory
   if (source >= RAM_BASE && source < RAM_BASE + RAM_SIZE) {
      const int offset = source - RAM_BASE;
      const int max_length = RAM_SIZE - offset;

      src = (const uint8_t*)system_ram + offset;

      if (length > max_length) length = max_length;
   } else if (source >= ROM_BASE && source < ROM_BASE + ROM_SIZE) {
      const int offset = (source - ROM_BASE);
      const int max_length = ROM_SIZE - offset;

      src = (const uint8_t*)system_rom + offset;

      if (length > max_length) length = max_length;
   } else {
      return false;
   }

   bool active = true;

   // Determine if target is in ram
   if (target >= RAM_BASE && target < RAM_BASE + RAM_SIZE) {
      const int offset = target - RAM_BASE;
      const int max_length = RAM_SIZE - offset;

      trg = (uint8_t*)system_ram + offset;

      if (length > max_length) length = max_length;
   } else if (target >= ROM_BASE && target < ROM_BASE + ROM_SIZE) {
      const int offset = target - ROM_BASE;
      const int max_length = ROM_SIZE - offset;

      active = false;

      if (length > max_length) length = max_length;
   } else {
      return false;
   }

   if (length > 0 && active) {
      memcpy(trg, src, length);
   }

   adjust_clock((length / word_width) * 2);
   channel.source += length;
   channel.target += length;
   channel.length -= length / word_width;

   if (channel.length == 0) {
      // Reset source address
      return chain(channel);
   }

   return false;
}

void DMA::advance() {
   if (!active) return ;

   active = false;

   for (int i = 0; i < MAX_DMA_CHANNELS; i++) {
      DMAChannel& channel = channels[i];

      SystemException problem = EXCEPTION_NONE;

      while (check_trigger(channel.flags & DMACR_TRIGGER_MASK)) {
         if (~channel.flags & DMACR_ACTIVE_MASK) break ;

         if (channel.length == 0) {
            chain(channel);
            continue ;
         }

         if (fast_dma(channel)) continue ;

         active = true;

         uint32_t value = Memory::read(channel.source, false, problem);

         value = adjust((channel.target & 3) - (channel.source & 3), value);
         adjust_clock(2); // No cross bar

         switch (channel.flags & DMACR_WIDTH_MASK) {
            case DMA_WIDTH_BIT8:
               Memory::write(channel.target, value, 0xFF << ((channel.target & 3) * 8), problem);

               break ;
            case DMA_WIDTH_BIT16:
               Memory::write(channel.target, value, (channel.target & 2) ? 0xFFFF0000 : 0x0000FFFF, problem);
               break ;
            case DMA_WIDTH_BIT32:
               Memory::write(channel.target, value, 0xFFFFFFFF, problem);
               break ;
            default:
               problem = EXCEPTION_GENERAL;
               break ;
         }

         if (problem != EXCEPTION_NONE) {
            channel.flags |= DMACR_EXCEPTION_MASK;
            channel.flags &= ~DMACR_ACTIVE_MASK;
            if (channel.flags & DMACR_INTERRUPT_MASK) COP0::interrupt(DMA_IRQn);
            break ;
         }

         channel.source += (channel.flags & DMACR_SSTRIDE_MASK) >> DMACR_SSTRIDE_POS;
         channel.target += (channel.flags & DMACR_TSTRIDE_MASK) >> DMACR_TSTRIDE_POS;
         channel.length--;
      }
   }
}

uint32_t DMA::read(uint32_t address) {
   const int page = (address - DMA_BASE) >> 2;

   // Out of bounds
   if (page >= WORD_LENGTH) {
      return ~0;
   }

   uint32_t* const raw = (uint32_t*)&channels;

   return raw[page];
}

void DMA::write(uint32_t address, uint32_t value, uint32_t mask) {
   const uint32_t page = address - DMA_BASE;
   const uint32_t word_address = page / sizeof(uint32_t);

   // Out of bounds
   if (page >= sizeof(channels)) {
      return ;
   }

   raw[word_address] = value;

   // Test if we are writting to a control register
   DMAChannel& channel = channels[page / sizeof(DMAChannel)];

   const uint32_t* a = &raw[word_address];
   const uint32_t* b = &channel.flags;

   if (a != b) { return ; }

   active = true;
   advance();
}
