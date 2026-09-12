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
  unit?: string;
}

const tierConfig: Record<number, { emoji: string; message: string }> = {
  3: {
    emoji: '✨',
    message: 'Estás ahorrando',
  },
  7: {
    emoji: '🔥',
    message: '¡Gran elección! Estás ahorrando',
  },
  12: {
    emoji: '🎯',
    message: '¡Máximo Ahorro Activado! Estás ahorrando',
  },
};

export default function SavingsMessage({ selectedPack, basePrice, allPacks, unit }: SavingsMessageProps) {
  if (!selectedPack || selectedPack.descuento <= 0) return null;

  const tier = tierConfig[selectedPack.descuento] || {
    emoji: '✨',
    message: 'Estás ahorrando',
  };

  const unitLabel = (unit || 'unidades').toLowerCase();
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
            con este pack de {selectedPack.cantidad} {unitLabel}.
          </span>
        </p>

        {/* Show upsell hint when there is a better pack */}
        {nextBetterPack && (
          <p className="text-[11px] sm:text-xs text-amber-800 mt-2 font-medium">
            ¿Necesitas más? Con el Pack de {nextBetterPack.cantidad} {unitLabel} ahorras un -{nextBetterPack.descuento}%
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}