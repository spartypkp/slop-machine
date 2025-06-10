'use client';

import { getRandomInitialPosition, getRandomSpinDuration } from '@/lib/utils/random';
import { WheelItem } from '@/types/slop-machine';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SpinWheelProps {
	wheelId: string;
	items: WheelItem[];
	isSpinning: boolean;
	finalIndex?: number;
	onSpinComplete: (result: WheelItem) => void;
	emoji: string;
	name: string;
	celebrationEffect?: string | null;
}

export default function SpinWheel({
	wheelId,
	items,
	isSpinning,
	finalIndex,
	onSpinComplete,
	emoji,
	name,
	celebrationEffect
}: SpinWheelProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [translateY, setTranslateY] = useState(0);
	const [spinDuration, setSpinDuration] = useState(3);
	const [initialOffset, setInitialOffset] = useState(0);
	const [isInitialized, setIsInitialized] = useState(false);

	// Create extended array for seamless scrolling (5 copies for smooth animation)
	const extendedItems = [...items, ...items, ...items, ...items, ...items];
	const itemHeight = 94; // Increased from 80px - now exactly 3 items fit in 280px window (280/3 = 93.33, rounded to 94)
	const centerIndex = Math.floor(extendedItems.length / 2); // Center of extended array

	// Initialize wheel with randomized positions
	useEffect(() => {
		if (!isInitialized && items.length > 0) {
			// Set random initial position with perfect center offset for 3-item display
			const randomStartIndex = getRandomInitialPosition(items.length);
			// With 94px items in 280px window: center item starts at 93px from top (280-94)/2 = 93px
			const windowCenterOffset = 93; // Perfect center offset for 3-item display
			const randomOffset = randomStartIndex * itemHeight + windowCenterOffset;
			setInitialOffset(randomOffset);
			setTranslateY(-randomOffset);
			setCurrentIndex(randomStartIndex);
			setIsInitialized(true);
		}
	}, [items, isInitialized, itemHeight]);

	// Handle spinning animation
	useEffect(() => {
		if (isSpinning && finalIndex !== undefined && items.length > 0) {
			const duration = getRandomSpinDuration(2.5, 4.0);
			setSpinDuration(duration);

			// Use finalIndex directly since we're no longer shuffling
			const targetItemIndex = finalIndex;

			// Calculate spin animation with perfect center offset for 3-item display:
			const fullRotations = 4 + Math.random() * 3; // 4-7 full rotations
			const rotationDistance = fullRotations * items.length * itemHeight;
			const windowCenterOffset = 93; // Perfect center offset for 3-item display
			const targetPosition = (centerIndex + targetItemIndex) * itemHeight + windowCenterOffset;
			const totalDistance = rotationDistance + targetPosition - initialOffset;

			// Animate to final position
			setTranslateY(-totalDistance);

			// Complete the spin after duration
			setTimeout(() => {
				// Set final position with perfect center offset
				const finalPosition = (centerIndex + targetItemIndex) * itemHeight + windowCenterOffset;
				setTranslateY(-finalPosition);
				setCurrentIndex(targetItemIndex);
				onSpinComplete(items[finalIndex]);
			}, duration * 1000);
		}
	}, [isSpinning, finalIndex, items, onSpinComplete, centerIndex, initialOffset, itemHeight]);

	// Don't render until initialized
	if (!isInitialized || items.length === 0) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	// Item rendering function with improved visual effects
	const renderItem = (item: WheelItem, index: number, isInViewport: boolean) => {
		// Calculate if this is the selected item (accounting for extended array)
		const adjustedIndex = index % items.length; // Use original items length
		const isSelected = adjustedIndex === currentIndex && !isSpinning;

		// Define rarity-based backgrounds
		const getRarityBackground = (rarity: string) => {
			switch (rarity) {
				case 'legendary':
					return 'linear-gradient(145deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)';
				case 'epic':
					return 'linear-gradient(145deg, #E6E6FA 0%, #DDA0DD 50%, #E6E6FA 100%)';
				case 'rare':
					return 'linear-gradient(145deg, #E0F2E0 0%, #90EE90 50%, #E0F2E0 100%)';
				case 'uncommon':
					return 'linear-gradient(145deg, #E0F6FF 0%, #87CEEB 50%, #E0F6FF 100%)';
				default: // common
					return 'linear-gradient(145deg, #FFFFFF 0%, #F5F5F5 100%)';
			}
		};

		// Define rarity-based borders and text colors
		const getRarityBorder = (rarity: string) => {
			switch (rarity) {
				case 'legendary': return '#DAA520';
				case 'epic': return '#9370DB';
				case 'rare': return '#228B22';
				case 'uncommon': return '#4169E1';
				default: return '#D1D5DB';
			}
		};

		const getRarityTextColor = (rarity: string) => {
			switch (rarity) {
				case 'legendary': return '#8B4513';
				case 'epic': return '#4B0082';
				case 'rare': return '#006400';
				case 'uncommon': return '#191970';
				default: return '#374151';
			}
		};

		return (
			<motion.div
				key={`${item.id}-${index}`}
				className="flex items-center justify-center text-center font-bold relative overflow-hidden border-2"
				style={{
					height: `${itemHeight}px`,
					fontSize: '14px',
					fontFamily: '"Inter", "Arial", sans-serif',
					background: isSelected && celebrationEffect
						? celebrationEffect === 'legendary'
							? 'linear-gradient(145deg, #FFD700 0%, #FFA500 100%)'
							: celebrationEffect === 'epic'
								? 'linear-gradient(145deg, #E6E6FA 0%, #DDA0DD 100%)'
								: celebrationEffect === 'rare'
									? 'linear-gradient(145deg, #E0F2E0 0%, #90EE90 100%)'
									: 'linear-gradient(145deg, #32CD32 0%, #228B22 100%)'
						: getRarityBackground(item.rarity),
					color: isSelected && celebrationEffect ? '#000000' : getRarityTextColor(item.rarity),
					borderColor: getRarityBorder(item.rarity),
					boxShadow: isSelected && celebrationEffect
						? '0 0 20px rgba(255,215,0,0.8), inset 0 0 15px rgba(255,255,255,0.3)'
						: item.rarity === 'legendary'
							? '0 0 8px rgba(255,215,0,0.4), inset 0 0 15px rgba(255,255,255,0.3)'
							: 'inset 0 0 5px rgba(0,0,0,0.05)',
					// Add motion blur during spinning for items in viewport
					filter: isSpinning && isInViewport ? 'blur(1px)' : 'none',
					opacity: isSpinning && !isInViewport ? 0.3 : 1
				}}
			>
				{/* Rarity indicator */}
				<div className="absolute top-1 right-1 text-xs" style={{
					color: item.rarity === 'legendary' ? '#FFD700' :
						item.rarity === 'epic' ? '#9370DB' :
							item.rarity === 'rare' ? '#228B22' :
								item.rarity === 'uncommon' ? '#4169E1' : '#9CA3AF',
					textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
					fontSize: '10px'
				}}>
					{item.rarity === 'legendary' ? '🏆' :
						item.rarity === 'epic' ? '👑' :
							item.rarity === 'rare' ? '💎' :
								item.rarity === 'uncommon' ? '⭐' : '●'}
				</div>

				{/* Speed lines during spinning */}
				{isSpinning && isInViewport && (
					<>
						<motion.div
							className="absolute left-0 top-1/2 w-full h-0.5 transform -translate-y-1/2"
							animate={{ opacity: [0.3, 0.6, 0.3] }}
							transition={{ duration: 0.2, repeat: Infinity, ease: 'easeInOut' }}
							style={{
								background: 'linear-gradient(90deg, transparent, #003366, transparent)'
							}}
						/>
						<motion.div
							className="absolute left-0 top-1/3 w-full h-0.5 transform -translate-y-1/2"
							animate={{ opacity: [0.2, 0.4, 0.2] }}
							transition={{ duration: 0.3, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
							style={{
								background: 'linear-gradient(90deg, transparent, #1E3A8A, transparent)'
							}}
						/>
					</>
				)}

				<motion.div
					className="px-2 leading-tight"
					animate={isSelected && celebrationEffect ? {
						scale: [1, 1.1, 1]
					} : isSpinning ? {
						scale: [1, 0.95, 1]
					} : {}}
					transition={{
						duration: celebrationEffect ? 0.5 : 0.3,
						repeat: celebrationEffect ? 3 : isSpinning ? Infinity : 0,
						ease: 'easeInOut'
					}}
					style={{
						textShadow: isSelected && celebrationEffect
							? '2px 2px 4px rgba(0,0,0,0.8)'
							: '1px 1px 2px rgba(0,0,0,0.2)'
					}}
				>
					{item.text}
				</motion.div>

				{/* Celebration effects for selected item */}
				{isSelected && celebrationEffect && (
					<div className="absolute inset-0 pointer-events-none">
						{[...Array(celebrationEffect === 'legendary' ? 12 : celebrationEffect === 'epic' ? 8 : 4)].map((_, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, scale: 0, x: itemHeight / 2, y: itemHeight / 2 }}
								animate={{
									opacity: [0, 1, 0],
									scale: [0, 1, 0],
									x: itemHeight / 2 + (Math.random() - 0.5) * itemHeight,
									y: itemHeight / 2 + (Math.random() - 0.5) * itemHeight
								}}
								transition={{ duration: 1, delay: i * 0.1 }}
								className="absolute w-2 h-2 rounded-full"
								style={{
									background: celebrationEffect === 'legendary'
										? 'linear-gradient(45deg, #FFD700, #FFA500)'
										: celebrationEffect === 'epic'
											? 'linear-gradient(45deg, #E6E6FA, #DDA0DD)'
											: celebrationEffect === 'rare'
												? 'linear-gradient(45deg, #E0F2E0, #90EE90)'
												: 'linear-gradient(45deg, #00FFFF, #0080FF)',
									boxShadow: '0 0 8px rgba(255,215,0,0.8)'
								}}
							/>
						))}
					</div>
				)}
			</motion.div>
		);
	};

	// Calculate viewport bounds for blur effects with perfect 3-item centering
	const viewportCenter = 140; // Center position of middle item: 93px (top offset) + 47px (half item height)
	const viewportTop = -translateY + (viewportCenter - itemHeight);
	const viewportBottom = -translateY + (viewportCenter + itemHeight);

	return (
		<div className="relative w-full h-full">
			{/* Chrome Window Frame */}
			<div className="absolute inset-0 rounded-xl border-4 pointer-events-none z-10" style={{
				borderColor: '#888888',
				background: 'linear-gradient(145deg, transparent 0%, transparent 95%, rgba(0,0,0,0.2) 100%)',
				boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)'
			}} />

			{/* Glass Effect */}
			<div className="absolute inset-2 rounded-lg pointer-events-none z-5" style={{
				background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
				backdropFilter: 'blur(0.5px)'
			}} />

			{/* Main spinning content */}
			<div className="relative w-full h-full overflow-hidden rounded-lg">
				<motion.div
					animate={{ y: translateY }}
					transition={{
						type: isSpinning ? "tween" : "spring",
						duration: isSpinning ? spinDuration : 0.6,
						ease: isSpinning ? [0.23, 1, 0.320, 1] : "easeOut", // Custom easing for realistic deceleration
						stiffness: 100,
						damping: 15
					}}
					className="absolute w-full"
					style={{ top: 0 }}
				>
					{/* Render all items in extended array */}
					{extendedItems.map((item, index) => {
						const itemTop = index * itemHeight;
						const itemBottom = itemTop + itemHeight;
						const isInViewport = itemBottom >= viewportTop && itemTop <= viewportBottom;

						return renderItem(item, index, isInViewport);
					})}
				</motion.div>

				{/* Selection Indicator - Perfectly aligned with center item */}
				<div
					className="absolute left-0 right-0 pointer-events-none z-20 border-4 rounded-lg"
					style={{
						top: '93px', // Aligns perfectly with center item (same as windowCenterOffset)
						height: `${itemHeight}px`, // Matches item height exactly (94px)
						borderColor: '#FFD700',
						background: celebrationEffect
							? celebrationEffect === 'epic'
								? 'linear-gradient(145deg, rgba(255,215,0,0.3) 0%, rgba(255,165,0,0.3) 100%)'
								: 'linear-gradient(145deg, rgba(0,255,255,0.3) 0%, rgba(0,128,255,0.3) 100%)'
							: 'linear-gradient(145deg, rgba(255,215,0,0.2) 0%, rgba(255,215,0,0.1) 100%)',
						boxShadow: celebrationEffect
							? '0 0 30px rgba(255,215,0,0.8), inset 0 0 20px rgba(255,255,255,0.3)'
							: '0 0 15px rgba(255,215,0,0.5), inset 0 0 10px rgba(255,255,255,0.2)'
					}}
				>
					{/* Chrome frame for selection */}
					<div className="absolute inset-0 rounded-lg border-2" style={{
						borderColor: '#C0C0C0',
						background: 'linear-gradient(90deg, rgba(192,192,192,0.3) 0%, transparent 50%, rgba(192,192,192,0.3) 100%)'
					}} />
				</div>

				{/* Chrome reflection effects */}
				<div className="absolute inset-0 pointer-events-none rounded-lg" style={{
					background: 'linear-gradient(125deg, rgba(255,255,255,0.4) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.2) 100%)'
				}} />
			</div>

			{/* Enhanced Spinning Visual Effects */}
			{isSpinning && (
				<>
					{/* Chrome gleam effect */}
					<motion.div
						initial={{ y: '-100%', opacity: 0 }}
						animate={{ y: '300%', opacity: [0, 1, 0] }}
						transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
						className="absolute inset-x-0 h-8 pointer-events-none z-25"
						style={{
							background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.8), transparent)',
							transform: 'skewY(-5deg)'
						}}
					/>

					{/* Edge blur effects */}
					<div className="absolute inset-0 pointer-events-none rounded-lg z-15" style={{
						background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, transparent 15%, transparent 85%, rgba(255,255,255,0.8) 100%)'
					}} />
				</>
			)}
		</div>
	);
} 