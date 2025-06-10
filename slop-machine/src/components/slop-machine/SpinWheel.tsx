'use client';

import { getRarityBgColor, getRarityColor } from '@/lib/data/wheel-content';
import { getRandomSpinDuration, getSpinRotation } from '@/lib/utils/random';
import { WheelItem } from '@/types/slop-machine';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface SpinWheelProps {
	wheelId: string;
	items: WheelItem[];
	isSpinning: boolean;
	finalIndex?: number;
	onSpinComplete: (result: WheelItem) => void;
	emoji: string;
	name: string;
}

export default function SpinWheel({
	wheelId,
	items,
	isSpinning,
	finalIndex,
	onSpinComplete,
	emoji,
	name
}: SpinWheelProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [rotation, setRotation] = useState(0);
	const wheelRef = useRef<HTMLDivElement>(null);
	const [spinDuration, setSpinDuration] = useState(3);

	useEffect(() => {
		if (isSpinning && finalIndex !== undefined) {
			const duration = getRandomSpinDuration(2.5, 4);
			const totalRotation = getSpinRotation(finalIndex, items.length);

			setSpinDuration(duration);
			setRotation(rotation + totalRotation);

			// Complete the spin after duration
			setTimeout(() => {
				setCurrentIndex(finalIndex);
				onSpinComplete(items[finalIndex]);
			}, duration * 1000);
		}
	}, [isSpinning, finalIndex, items, onSpinComplete, rotation]);

	const wheelStyle = {
		transform: `rotate(${rotation}deg)`,
		transition: isSpinning
			? `transform ${spinDuration}s cubic-bezier(0.17, 0.67, 0.12, 0.99)`
			: 'transform 0.5s ease-out'
	};

	// Use fewer items for better visibility (max 8)
	const displayItems = items.slice(0, 8);
	const segmentAngle = 360 / displayItems.length;

	return (
		<div className="flex flex-col items-center space-y-4">
			{/* Wheel Header */}
			<div className="text-center">
				<div className="text-3xl mb-2">{emoji}</div>
				<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
					{name}
				</h3>
			</div>

			{/* Wheel Container */}
			<div className="relative">
				{/* Pointer */}
				<div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
					<div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500 drop-shadow-lg"></div>
				</div>

				{/* Wheel */}
				<div
					ref={wheelRef}
					className="relative w-64 h-64 rounded-full border-4 border-gray-300 dark:border-gray-600 overflow-hidden shadow-lg bg-white dark:bg-gray-800"
					style={wheelStyle}
				>
					{displayItems.map((item, index) => {
						const startAngle = index * segmentAngle;
						const isSelected = !isSpinning && index === (currentIndex % displayItems.length);

						return (
							<div
								key={`${item.id}-${index}`}
								className={`absolute w-full h-full rounded-full transition-all duration-300 ${isSelected
									? `${getRarityBgColor(item.rarity)} opacity-100`
									: 'bg-white dark:bg-gray-800 opacity-90'
									}`}
								style={{
									transform: `rotate(${startAngle}deg)`,
									clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((segmentAngle * Math.PI) / 180)}% ${50 - 50 * Math.sin((segmentAngle * Math.PI) / 180)}%)`
								}}
							>
								<div
									className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24"
									style={{ transform: `translateX(-50%) rotate(-${startAngle}deg)` }}
								>
									<div className={`text-center text-xs font-medium px-2 py-1 rounded ${isSelected ? getRarityColor(item.rarity) : 'text-gray-800 dark:text-gray-200'
										}`}>
										<div className="leading-tight">
											{item.text.length > 20 ? item.text.substring(0, 20) + '...' : item.text}
										</div>
										{item.rarity !== 'common' && (
											<div className="text-xs mt-1 opacity-70 capitalize">
												{item.rarity}
											</div>
										)}
									</div>
								</div>
							</div>
						);
					})}

					{/* Center circle */}
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center">
						<div className="text-white text-lg">🎲</div>
					</div>
				</div>

				{/* Spinning Effect Overlay */}
				{isSpinning && (
					<motion.div
						className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-4 border-transparent"
						animate={{
							scale: [1, 1.05, 1],
							boxShadow: [
								'0 0 0px rgba(168, 85, 247, 0.4)',
								'0 0 20px rgba(168, 85, 247, 0.8)',
								'0 0 0px rgba(168, 85, 247, 0.4)'
							]
						}}
						transition={{
							duration: 0.8,
							repeat: Infinity,
							ease: 'easeInOut'
						}}
					/>
				)}
			</div>

			{/* Current Selection Display */}
			<motion.div
				className="min-h-[80px] flex items-center justify-center max-w-xs"
				animate={{
					scale: isSpinning ? [1, 1.1, 1] : 1,
					opacity: isSpinning ? [1, 0.7, 1] : 1
				}}
				transition={{
					duration: 0.5,
					repeat: isSpinning ? Infinity : 0
				}}
			>
				{!isSpinning && displayItems[currentIndex % displayItems.length] && (
					<div className={`text-center p-4 rounded-lg ${getRarityBgColor(displayItems[currentIndex % displayItems.length].rarity)} border-2 border-gray-200 dark:border-gray-600 shadow-md`}>
						<div className={`font-medium text-sm ${getRarityColor(displayItems[currentIndex % displayItems.length].rarity)}`}>
							{displayItems[currentIndex % displayItems.length].text}
						</div>
						{displayItems[currentIndex % displayItems.length].rarity !== 'common' && (
							<div className="text-xs mt-2 opacity-70 capitalize font-semibold">
								✨ {displayItems[currentIndex % displayItems.length].rarity}
							</div>
						)}
					</div>
				)}
				{isSpinning && (
					<div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600">
						<div className="animate-pulse text-gray-500 dark:text-gray-400 font-medium">
							🌀 Spinning...
						</div>
					</div>
				)}
				{!isSpinning && !displayItems[currentIndex % displayItems.length] && (
					<div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
						<div className="text-gray-400 dark:text-gray-500 font-medium">
							🎯 Ready to spin!
						</div>
					</div>
				)}
			</motion.div>
		</div>
	);
} 