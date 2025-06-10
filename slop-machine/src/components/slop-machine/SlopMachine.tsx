'use client';

import { getCombinationOdds, getRealRarityPercentages, wheelData } from '@/lib/data/wheel-content';
import { useSlopMachineStore } from '@/lib/store/slop-machine-store';
import { filterRecentItems, getStaggerDelay, selectWeightedRandom } from '@/lib/utils/random';
import { SlopMachineProps } from '@/types/slop-machine';
import { motion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';
import OddsDisplay from './OddsDisplay';
import SpinWheel from './SpinWheel';

export default function SlopMachine({ onGenerate }: SlopMachineProps) {
	const {
		wheels,
		getAllWheelsSpinning,
		setWheelSpinning,
		setWheelResult,
		addGeneration,
		resetWheels,
		recentCharacters,
		recentActions,
		recentSettings
	} = useSlopMachineStore();

	const [wheelIndices, setWheelIndices] = useState<{ [key: string]: number; }>({});
	const [leverPulled, setLeverPulled] = useState(false);
	const [celebrationEffect, setCelebrationEffect] = useState<string | null>(null);
	const [showParticles, setShowParticles] = useState(false);

	// Calculate real percentages and odds
	const realPercentages = useMemo(() => getRealRarityPercentages(), []);
	const combinationOdds = useMemo(() => getCombinationOdds(), []);

	const handleSpin = useCallback(() => {
		if (getAllWheelsSpinning()) return;

		// Animate lever pull
		setLeverPulled(true);
		setTimeout(() => setLeverPulled(false), 800);

		// Reset any previous results
		resetWheels();

		// *** PRE-CALCULATE THEN ANIMATE APPROACH ***
		// Step 1: Immediately calculate the final results using weighted randomization
		const preCalculatedResults: { [key: string]: any; } = {};
		const preCalculatedIndices: { [key: string]: number; } = {};

		wheelData.forEach((category, categoryIndex) => {
			const wheelKey = category.id === 'characters' ? 'character' :
				category.id === 'actions' ? 'action' : 'setting';

			// Filter recent items to avoid repetition
			const recentItems = category.id === 'characters' ? recentCharacters :
				category.id === 'actions' ? recentActions : recentSettings;

			const filteredItems = filterRecentItems(category.items, recentItems);
			const selectedItem = selectWeightedRandom(filteredItems);
			const selectedIndex = category.items.findIndex(item => item.id === selectedItem.id);

			// Store the pre-calculated results
			preCalculatedResults[wheelKey] = selectedItem;
			preCalculatedIndices[category.id] = selectedIndex;
		});

		// Step 2: Set the wheel indices for animation targeting
		setWheelIndices(preCalculatedIndices);

		// Step 3: Start spinning animations with staggered delays, but they'll animate TO the pre-calculated results
		wheelData.forEach((category, categoryIndex) => {
			const delay = getStaggerDelay(categoryIndex);

			setTimeout(() => {
				const wheelKey = category.id === 'characters' ? 'character' :
					category.id === 'actions' ? 'action' : 'setting';

				// Start the visual spinning animation - it will animate to the pre-calculated target
				setWheelSpinning(wheelKey, true);
			}, delay * 1000);
		});
	}, [getAllWheelsSpinning, resetWheels, setWheelSpinning, recentCharacters, recentActions, recentSettings]);

	const handleWheelComplete = useCallback((wheelId: string, result: any) => {
		const wheelKey = wheelId === 'characters' ? 'character' :
			wheelId === 'actions' ? 'action' : 'setting';

		setWheelResult(wheelKey, result);

		// Check if all wheels are done spinning
		setTimeout(() => {
			const results = useSlopMachineStore.getState().getWheelResults();
			if (results.character && results.action && results.setting) {
				addGeneration(results.character, results.action, results.setting);

				// Trigger celebration effects based on rarity combination
				const rarities = [results.character.rarity, results.action.rarity, results.setting.rarity];
				const hasLegendary = rarities.includes('legendary');
				const hasEpic = rarities.includes('epic');
				const hasRare = rarities.includes('rare');
				const hasUncommon = rarities.includes('uncommon');

				if (hasLegendary) {
					setCelebrationEffect('legendary');
					setShowParticles(true);
				} else if (hasEpic) {
					setCelebrationEffect('epic');
					setShowParticles(true);
				} else if (hasRare) {
					setCelebrationEffect('rare');
					setShowParticles(true);
				} else if (hasUncommon) {
					setCelebrationEffect('uncommon');
				}

				// Clear celebration effects after animation
				setTimeout(() => {
					setCelebrationEffect(null);
					setShowParticles(false);
				}, 3000);

				// SIGNIFICANTLY DELAY the modal/external result display (8 seconds)
				setTimeout(() => {
					if (onGenerate) {
						const generation = useSlopMachineStore.getState().currentGeneration;
						if (generation) {
							onGenerate(generation);
						}
					}
				}, 8000); // 8 second delay instead of immediate
			}
		}, 100);
	}, [setWheelResult, addGeneration, onGenerate]);

	const isAnyWheelSpinning = getAllWheelsSpinning();

	return (
		<div className="min-h-screen flex items-center justify-center p-4" style={{
			background: 'radial-gradient(ellipse at center, #1E3A8A 0%, #1E40AF 30%, #1E3A8A 60%, #0F172A 100%)'
		}}>
			{/* Celebration Screen Flash */}
			{(celebrationEffect === 'legendary' || celebrationEffect === 'epic') && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: [0, celebrationEffect === 'legendary' ? 1 : 0.8, 0] }}
					transition={{ duration: celebrationEffect === 'legendary' ? 0.8 : 0.5, repeat: celebrationEffect === 'legendary' ? 5 : 3 }}
					className="fixed inset-0 z-40 pointer-events-none"
					style={{
						background: celebrationEffect === 'legendary'
							? 'radial-gradient(circle, rgba(255,215,0,1) 0%, rgba(255,255,255,0.8) 50%, transparent 100%)'
							: 'radial-gradient(circle, rgba(255,215,0,0.9) 0%, rgba(255,255,255,0.5) 50%, transparent 100%)'
					}}
				/>
			)}

			{/* Particle Effects */}
			{showParticles && (
				<div className="fixed inset-0 z-30 pointer-events-none">
					{[...Array(celebrationEffect === 'legendary' ? 100 : 50)].map((_, i) => (
						<motion.div
							key={i}
							initial={{
								opacity: 1,
								scale: 0,
								x: Math.random() * window.innerWidth,
								y: window.innerHeight + 50,
								rotate: 0
							}}
							animate={{
								opacity: [1, 1, 0],
								scale: [0, celebrationEffect === 'legendary' ? 1.5 : 1, 0.5],
								y: -100,
								rotate: 360,
								x: Math.random() * window.innerWidth
							}}
							transition={{
								duration: celebrationEffect === 'legendary' ? 4 : 3 + Math.random() * 2,
								delay: Math.random() * 2,
								ease: 'easeOut'
							}}
							className="absolute w-3 h-3 rounded-full"
							style={{
								background: celebrationEffect === 'legendary'
									? 'linear-gradient(45deg, #FFD700, #FFA500)'
									: celebrationEffect === 'epic'
										? 'linear-gradient(45deg, #E6E6FA, #DDA0DD)'
										: celebrationEffect === 'rare'
											? 'linear-gradient(45deg, #E0F2E0, #90EE90)'
											: 'linear-gradient(45deg, #32CD32, #FFD700)',
								boxShadow: celebrationEffect === 'legendary'
									? '0 0 15px rgba(255,215,0,1)'
									: '0 0 10px rgba(255,215,0,0.8)'
							}}
						/>
					))}
				</div>
			)}

			{/* Vintage Slot Machine Cabinet */}
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{
					scale: 1,
					opacity: 1,
					boxShadow: celebrationEffect === 'legendary'
						? [
							"0 0 80px rgba(255,215,0,1)",
							"0 0 150px rgba(255,215,0,1)",
							"0 0 80px rgba(255,215,0,1)"
						]
						: celebrationEffect === 'epic'
							? [
								"0 0 50px rgba(255,215,0,0.8)",
								"0 0 100px rgba(255,215,0,1)",
								"0 0 50px rgba(255,215,0,0.8)"
							]
							: celebrationEffect === 'rare'
								? [
									"0 0 30px rgba(0,255,0,0.6)",
									"0 0 60px rgba(0,255,0,0.9)",
									"0 0 30px rgba(0,255,0,0.6)"
								]
								: "0 0 20px rgba(0,0,0,0.5)"
				}}
				transition={{
					duration: 0.8,
					ease: "easeOut",
					boxShadow: {
						duration: celebrationEffect ? 1 : 0.8,
						repeat: celebrationEffect ? 3 : 0
					}
				}}
				className="relative"
			>
				{/* Main Cabinet - Wider Horizontal Style */}
				<div className="relative rounded-3xl shadow-2xl border-8 p-6" style={{
					background: 'linear-gradient(145deg, #E5E5E5 0%, #F5F5F5 20%, #E5E5E5 50%, #D3D3D3 80%, #C0C0C0 100%)',
					borderColor: '#A0A0A0',
					borderImage: 'linear-gradient(45deg, #C0C0C0, #E5E5E5, #C0C0C0) 1',
					boxShadow: '0 0 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(255,255,255,0.1)',
					width: '800px',
					minHeight: '500px'
				}}>
					{/* Chrome Border Effect */}
					<div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
						background: 'linear-gradient(145deg, transparent 0%, transparent 60%, rgba(0,0,0,0.2) 100%)',
						boxShadow: 'inset 0 0 80px rgba(0,0,0,0.3)'
					}} />

					{/* Top Header Section - "SLOP MACHINE" */}
					<div className="relative rounded-2xl p-4 mb-4 border-4" style={{
						background: 'linear-gradient(145deg, #003366 0%, #1E3A8A 50%, #003366 100%)',
						borderColor: '#C0C0C0',
						boxShadow: 'inset 0 0 30px rgba(0,51,102,0.5)'
					}}>
						{/* Decorative corners */}
						<div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-gold" style={{ borderColor: '#FFD700' }} />
						<div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-gold" style={{ borderColor: '#FFD700' }} />
						<div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-gold" style={{ borderColor: '#FFD700' }} />
						<div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-gold" style={{ borderColor: '#FFD700' }} />

						<motion.div
							animate={{
								textShadow: [
									"4px 4px 0px rgba(0,0,0,1), 0 0 30px rgba(255,215,0,0.8)",
									"4px 4px 0px rgba(0,0,0,1), 0 0 50px rgba(255,215,0,1)",
									"4px 4px 0px rgba(0,0,0,1), 0 0 30px rgba(255,215,0,0.8)"
								]
							}}
							transition={{ duration: 2, repeat: Infinity }}
							className="text-center"
						>
							<h1 className="text-4xl font-black tracking-wider" style={{
								color: '#FFD700',
								fontFamily: '"Fredoka One", "Arial Black", sans-serif',
								textShadow: '4px 4px 0px rgba(0,0,0,1), 0 0 30px rgba(255,215,0,0.8)'
							}}>
								🎰 SLOP MACHINE 🎰
							</h1>
						</motion.div>
					</div>

					{/* Rarity Guide Section - Updated from Payline Guide */}
					<div className="relative rounded-2xl p-3 mb-4 border-4" style={{
						background: 'linear-gradient(145deg, #FFFFFF 0%, #F8F8F8 50%, #FFFFFF 100%)',
						borderColor: '#C0C0C0',
						boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
					}}>
						<div className="text-center mb-2">
							<div className="text-lg font-black" style={{
								color: '#003366',
								fontFamily: '"Fredoka One", "Arial Black", sans-serif',
								textShadow: '2px 2px 0px rgba(255,255,255,0.8)'
							}}>
								RARITY GUIDE
							</div>
						</div>
						<div className="grid grid-cols-5 gap-1 text-xs">
							{/* Legendary - Gold */}
							<div className="flex flex-col items-center p-1.5 rounded border-2" style={{
								background: 'linear-gradient(145deg, #FFF9C4 0%, #FFD700 50%, #FFA500 100%)',
								borderColor: '#DAA520',
								boxShadow: '0 0 8px rgba(255,215,0,0.8)'
							}}>
								<div className="text-sm mb-0.5">🏆</div>
								<span className="font-black text-yellow-900 text-xs">LEGENDARY</span>
								<span className="text-xs text-yellow-800">{realPercentages.legendary.toFixed(1)}%</span>
							</div>

							{/* Epic - Purple */}
							<div className="flex flex-col items-center p-1.5 rounded border-2" style={{
								background: 'linear-gradient(145deg, #F3E8FF 0%, #E6E6FA 50%, #DDA0DD 100%)',
								borderColor: '#9932CC',
								boxShadow: '0 0 6px rgba(153,50,204,0.6)'
							}}>
								<div className="text-sm mb-0.5">👑</div>
								<span className="font-black text-purple-900 text-xs">EPIC</span>
								<span className="text-xs text-purple-800">{realPercentages.epic.toFixed(1)}%</span>
							</div>

							{/* Rare - Green */}
							<div className="flex flex-col items-center p-1.5 rounded border-2" style={{
								background: 'linear-gradient(145deg, #E0F2E0 0%, #90EE90 50%, #E0F2E0 100%)',
								borderColor: '#228B22',
								boxShadow: '0 0 4px rgba(34,139,34,0.4)'
							}}>
								<div className="text-sm mb-0.5">💎</div>
								<span className="font-black text-green-900 text-xs">RARE</span>
								<span className="text-xs text-green-800">{realPercentages.rare.toFixed(1)}%</span>
							</div>

							{/* Uncommon - Blue */}
							<div className="flex flex-col items-center p-1.5 rounded border-2" style={{
								background: 'linear-gradient(145deg, #E0F6FF 0%, #87CEEB 50%, #E0F6FF 100%)',
								borderColor: '#4169E1',
								boxShadow: '0 0 4px rgba(65,105,225,0.4)'
							}}>
								<div className="text-sm mb-0.5">⭐</div>
								<span className="font-black text-blue-900 text-xs">UNCOMMON</span>
								<span className="text-xs text-blue-800">{realPercentages.uncommon.toFixed(1)}%</span>
							</div>

							{/* Common - Gray */}
							<div className="flex flex-col items-center p-1.5 rounded border-2" style={{
								background: 'linear-gradient(145deg, #FFFFFF 0%, #F5F5F5 100%)',
								borderColor: '#D1D5DB',
								boxShadow: '0 0 2px rgba(0,0,0,0.1)'
							}}>
								<div className="text-sm mb-0.5">●</div>
								<span className="font-black text-gray-700 text-xs">COMMON</span>
								<span className="text-xs text-gray-600">{realPercentages.common.toFixed(1)}%</span>
							</div>
						</div>


						{/* Detailed Odds Display */}
						<div className="mt-3 pt-3 border-t border-gray-200">
							<OddsDisplay />
						</div>
					</div>

					{/* Main Reels Section with Lever on Right */}
					<div className="flex items-center gap-6 mb-4">
						{/* Reels Container */}
						<div className="flex-1 rounded-3xl p-4 border-6" style={{
							background: 'linear-gradient(145deg, #2A2A2A 0%, #4A4A4A 50%, #2A2A2A 100%)',
							borderColor: '#A0A0A0',
							boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)'
						}}>
							<div className="grid grid-cols-3 gap-6">
								{wheelData.map((category, index) => (
									<motion.div
										key={category.id}
										initial={{ y: 50, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{ delay: index * 0.2, duration: 0.6 }}
										className="relative"
									>
										{/* Heavy Chrome Reel Frame */}
										<div className="rounded-2xl p-3 shadow-2xl border-6" style={{
											background: 'linear-gradient(145deg, #F5F5F5 0%, #E5E5E5 20%, #D3D3D3 50%, #C0C0C0 80%, #A0A0A0 100%)',
											borderColor: '#888888',
											boxShadow: '0 15px 40px rgba(0,0,0,0.6), inset 0 0 30px rgba(255,255,255,0.2)'
										}}>
											{/* Reel Label */}
											<div className="text-center mb-3">
												<div className="text-white px-3 py-2 rounded-lg text-sm font-black border-2" style={{
													background: 'linear-gradient(145deg, #003366 0%, #1E3A8A 50%, #003366 100%)',
													borderColor: '#FFD700',
													textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
													fontFamily: '"Fredoka One", "Arial Black", sans-serif',
													boxShadow: 'inset 0 0 10px rgba(0,51,102,0.5)'
												}}>
													{category.emoji} {category.name.toUpperCase()}
												</div>
											</div>

											{/* Reel Window - Enhanced and Taller */}
											<div className="bg-white rounded-xl border-6 shadow-inner overflow-hidden" style={{
												height: '280px',
												borderColor: '#666666',
												boxShadow: 'inset 0 0 40px rgba(0,0,0,0.7)'
											}}>
												<SpinWheel
													wheelId={category.id}
													items={category.items}
													isSpinning={
														category.id === 'characters' ? wheels.character.isSpinning :
															category.id === 'actions' ? wheels.action.isSpinning :
																wheels.setting.isSpinning
													}
													finalIndex={wheelIndices[category.id]}
													onSpinComplete={(result) => handleWheelComplete(category.id, result)}
													emoji={category.emoji}
													name={category.name}
													celebrationEffect={celebrationEffect}
												/>
											</div>
										</div>
									</motion.div>
								))}
							</div>
						</div>

						{/* Lever Section - Moved to Right */}
						<div className="flex flex-col items-center">
							{/* Lever Mechanism */}
							<motion.div
								className="relative"
								animate={leverPulled ? { x: 25 } : { x: 0 }}
								transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
							>
								{/* Lever Base - Heavier Chrome */}
								<div className="w-20 h-40 rounded-full shadow-2xl border-6" style={{
									background: 'linear-gradient(to right, #E5E5E5 0%, #F5F5F5 20%, #D3D3D3 50%, #C0C0C0 80%, #A0A0A0 100%)',
									borderColor: '#888888',
									boxShadow: '0 15px 30px rgba(0,0,0,0.6), inset 0 0 15px rgba(255,255,255,0.3)'
								}} />

								{/* Lever Handle - Enhanced */}
								<motion.button
									onClick={handleSpin}
									disabled={isAnyWheelSpinning}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									animate={leverPulled ? { rotate: 45, y: 15 } : { rotate: 0, y: 0 }}
									transition={{ duration: 0.4, type: "spring" }}
									className="absolute -top-8 -right-12 w-32 h-20 rounded-full shadow-2xl border-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
									style={{
										background: leverPulled
											? 'linear-gradient(145deg, #DC143C 0%, #8B0000 50%, #DC143C 100%)'
											: 'linear-gradient(145deg, #FF4500 0%, #DC143C 50%, #8B0000 100%)',
										borderColor: '#FFD700',
										boxShadow: '0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,215,0,0.3)',
										height: '80px'
									}}
								>
									<div className="text-white font-black text-2xl" style={{
										fontFamily: '"Fredoka One", "Arial Black", sans-serif',
										textShadow: '3px 3px 6px rgba(0,0,0,0.8)'
									}}>
										{isAnyWheelSpinning ? "..." : "PULL"}
									</div>
								</motion.button>
							</motion.div>
						</div>
					</div>

					{/* Bottom Decorative Section */}
					<div className="relative rounded-2xl p-3 border-4" style={{
						background: 'linear-gradient(145deg, #003366 0%, #1E3A8A 50%, #003366 100%)',
						borderColor: '#C0C0C0',
						boxShadow: 'inset 0 0 30px rgba(0,51,102,0.5)'
					}}>
						<div className="text-center">
							<motion.div
								animate={{
									textShadow: [
										"3px 3px 0px rgba(0,0,0,1), 0 0 20px rgba(255,215,0,0.8)",
										"3px 3px 0px rgba(0,0,0,1), 0 0 40px rgba(255,215,0,1)",
										"3px 3px 0px rgba(0,0,0,1), 0 0 20px rgba(255,215,0,0.8)"
									]
								}}
								transition={{ duration: 3, repeat: Infinity }}
								className="text-2xl font-black"
								style={{
									color: '#FFD700',
									fontFamily: '"Fredoka One", "Arial Black", sans-serif',
									textShadow: '3px 3px 0px rgba(0,0,0,1), 0 0 20px rgba(255,215,0,0.8)'
								}}
							>
								💰 JACKPOT 💰
							</motion.div>
							<div className="text-sm mt-1" style={{
								color: '#FFFFFF',
								fontFamily: 'monospace',
								textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
							}}>
								AI PROMPT GENERATOR
							</div>
						</div>
					</div>
				</div>

				{/* Cabinet Legs - Enhanced */}
				<div className="absolute -bottom-12 left-16 w-8 h-12 rounded-b-xl shadow-xl" style={{
					background: 'linear-gradient(145deg, #E5E5E5 0%, #C0C0C0 100%)',
					boxShadow: '0 5px 15px rgba(0,0,0,0.5)'
				}} />
				<div className="absolute -bottom-12 right-16 w-8 h-12 rounded-b-xl shadow-xl" style={{
					background: 'linear-gradient(145deg, #E5E5E5 0%, #C0C0C0 100%)',
					boxShadow: '0 5px 15px rgba(0,0,0,0.5)'
				}} />
			</motion.div>
		</div>
	);
} 