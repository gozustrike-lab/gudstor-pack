'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface PackInfo {
  cantidad: number;
  descuento: number;
  precio: number;
}

interface SavingsMessageProps {
  selectedPack: PackInfo | null;
  basePrice: number;
  allPacks: PackInfo[];
}

const tierConfig: Record<number, { emoji: string; message: string; submessage: string; nextHint?: string }> = {
  3: {
    emoji: '\u2728',
    message: 'Est\u00e1s ahorrando',
    submessage: 'con este pack.',
  },
  7: {
    emoji: '\uD83D\uDD25',
    message: '\u00a1Gran elecci\u00f3n! Est\u00e1s ahorrando',
    submessage: '\u00a1Ll\u00e9vate el Pack de 50 unidades y duplica tu descuento al -7%!',
    nextHint: '\u00bfNecesitas m\u00e1s? Con el Pack de 100 unidades ahorras un -12%',
  },
  12: {
    emoji: '\uD83C\uDFAF',
    message: '\u00a1M\u00e1ximo Ahorro Activado! Est\u00e1s ahorrando',
    submessage: 'en esta compra.',
  },
};

export default function SavingsMessage({ selectedPack, basePrice, allPacks }: SavingsMessageProps) {
  if (!selectedPack || selectedPack.descuento <= 0) return null;

  const tier = tierConfig[selectedPack.descuento];
  if (!tier) return null;

  const originalTotal = basePrice * selectedPack.cantidad;
  const savings = originalTotal - selectedPack.precio;
  const savingsFormatted = savings.toFixed(2);

  // Find next better pack for upsell hint
  const nextBetterPack = allPacks.find(
    (p) => p.descuento > selectedPack.descuento
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedPack.cantidad}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.25 }}
        className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-3 sm:p-4 rounded-r-lg my-2 sm:my-4"
      >
        <p className="text-xs sm:text-sm text-gray-700 leading-snug">
          <span className="text-base sm:text-lg mr-1">{tier.emoji}</span>
          <span className="font-semibold text-amber-900">
            {tier.message}{' '}
            <span className="text-green-700 font-bold">S/ {savingsFormatted}</span>{' '}
            {tier.submessage}
          </span>
        </p>

        {/* Show upsell hint when there is a better pack and no static nextHint */}
        {!tier.nextHint && nextBetterPack && (
          <p className="text-[11px] sm:text-xs text-amber-800 mt-2 font-medium">
            {'\u00bfNecesitas m\u00e1s? Con el Pack de '}{nextBetterPack.cantidad}{' unidades ahorras un -'}{nextBetterPack.descuento}{'%'}
          </p>
        )}
        {tier.nextHint && (
          <p className="text-[11px] sm:text-xs text-amber-800 mt-2 font-medium">
            {tier.nextHint}
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}