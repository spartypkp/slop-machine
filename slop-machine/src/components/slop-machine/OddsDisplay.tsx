'use client';

import { getCombinationOdds } from '@/lib/data/wheel-content';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function OddsDisplay() {
	const odds = getCombinationOdds();
	const [currentIndex, setCurrentIndex] = useState(0);

	const oddsItems = [
		{
			label: '🏆🏆🏆 Triple Legendary',
			odds: odds.tripleLegendary,
			color: 'text-yellow-800'
		},
		{
			label: '👑👑👑 Triple Epic',
			odds: odds.tripleEpic,
			color: 'text-purple-800'
		},
		{
			label: '💎💎💎 Triple Rare',
			odds: odds.tripleRare,
			color: 'text-green-800'
		},
		{
			label: '⭐⭐⭐ Triple Uncommon',
			odds: odds.tripleUncommon,
			color: 'text-blue-800'
		},
		{
			label: '●●● Triple Common',
			odds: odds.tripleCommon,
			color: 'text-gray-700'
		},
		{
			label: '🌟 Any Legendary',
			odds: odds.anyLegendary,
			color: 'text-orange-800'
		}
	];

	const formatOdds = (probability: number) => {
		if (probability === 0) return '0%';
		if (probability < 0.000001) return `${(probability * 100).toExponential(2)}%`;
		if (probability < 0.001) return `${(probability * 100).toFixed(6)}%`;
		if (probability < 0.01) return `${(probability * 100).toFixed(4)}%`;
		if (probability < 0.1) return `${(probability * 100).toFixed(2)}%`;
		return `${(probability * 100).toFixed(1)}%`;
	};

	const getOneInChance = (probability: number) => {
		if (probability === 0) return 'Never';
		const oneIn = Math.round(1 / probability);
		if (oneIn > 1000000) return `1 in ${(oneIn / 1000000).toFixed(1)}M`;
		if (oneIn > 1000) return `1 in ${(oneIn / 1000).toFixed(1)}K`;
		return `1 in ${oneIn.toLocaleString()}`;
	};

	// Cycle through odds every 3 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % oddsItems.length);
		}, 3000);

		return () => clearInterval(interval);
	}, [oddsItems.length]);

	const currentItem = oddsItems[currentIndex];

	return (
		<div className="text-center">
			<motion.div
				key={currentIndex}
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-xs space-y-1"
			>
				<div className={`font-bold ${currentItem.color}`}>
					{currentItem.label}
				</div>
				<div className="text-gray-600">
					<span className="font-mono">{formatOdds(currentItem.odds)}</span>
					<span className="mx-2">•</span>
					<span>{getOneInChance(currentItem.odds)}</span>
				</div>
			</motion.div>
		</div>
	);
} 