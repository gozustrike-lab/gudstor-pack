#!/usr/bin/env python3
"""Remove duplicate CTA sections and update sticky bar in producto-detalle-client.tsx"""

import re

filepath = '/home/z/my-project/src/app/productos/[id]/producto-detalle-client.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove desktop WhatsApp CTA + Desktop Add to Cart (between end of color/medida section and TABS)
# Pattern: from "{/* WhatsApp CTA */}" to just before "{/* TABS */}"
desktop_pattern = r'(\s*\{/\* WhatsApp CTA \*/\}.*?\{/\* TABS \*/\})'
# Actually, let me find the exact blocks by line content markers

lines = content.split('\n')
new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    
    # Skip desktop WhatsApp CTA card + Desktop Add to Cart block
    if '{/* WhatsApp CTA */}' in line and i > 400 and i < 700:
        # Skip everything until we hit {/* TABS */}
        i += 1
        while i < len(lines) and '{/* TABS */}' not in lines[i]:
            i += 1
        # Keep the TABS comment line
        continue
    
    # Skip mobile WhatsApp CTA card
    if '{/* WhatsApp CTA \u2014 Mobile compact' in line and i > 800:
        i += 1
        while i < len(lines) and '{/* Mobile Tabs */}' not in lines[i]:
            i += 1
        continue
    
    new_lines.append(line)
    i += 1

content = '\n'.join(new_lines)

# 2. Update sticky bar: make price visible on all devices
content = content.replace(
    '          {/* Precio total del pack (desktop only) */}\n          <div className="hidden sm:flex flex-col items-end shrink-0">\n            <span className="text-[10px] text-muted-foreground uppercase font-medium">Total pack</span>\n            <span className="text-lg font-extrabold text-primary leading-tight">',
    '          {/* Total Pack \u2014 visible on ALL devices */}\n          <div className="flex flex-col items-end shrink-0 mr-1">\n            <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-medium leading-none">Total pack</span>\n            <span className="text-base sm:text-lg font-extrabold text-primary leading-tight">'
)

# 3. Simplify WhatsApp mobile button (remove wrapper div)
content = content.replace(
    '          {/* WhatsApp \u2014 mobile only: icon circle + text button side by side */}\n          <div className="sm:hidden flex items-center gap-2 shrink-0">\n            <motion.button\n              whileTap={{ scale: 0.95 }}\n              onClick={handleWhatsApp}\n              className="flex-shrink-0 w-11 h-11 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/25"\n              aria-label="Cotizar por WhatsApp"\n            >\n              <MessageCircle className="w-5 h-5 text-white" />\n            </motion.button>\n          </div>',
    '          {/* WhatsApp \u2014 mobile: icon circle */}\n          <motion.button\n            whileTap={{ scale: 0.95 }}\n            onClick={handleWhatsApp}\n            className="sm:hidden flex-shrink-0 w-11 h-11 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/25"\n            aria-label="Cotizar por WhatsApp"\n          >\n            <MessageCircle className="w-5 h-5 text-white" />\n          </motion.button>'
)

# 4. Update sticky bar comment
content = content.replace(
    '{/* STICKY CTA: Agregar al Carrito + WhatsApp (single row mobile) */}',
    '{/* UNIFIED BOTTOM BAR: Total Pack + WhatsApp + Agregar */}'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done! Changes applied.")