'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { wheelData } from '@/lib/data/wheel-content';
import { useSlopMachineStore } from '@/lib/store/slop-machine-store';
import { filterRecentItems, getStaggerDelay, selectWeightedRandom } from '@/lib/utils/random';
import { SlopMachineProps } from '@/types/slop-machine';
import { motion } from 'framer-motion';
import { Dices, RotateCcw } from 'lucide-react';
import { useCallback, useState } from 'react';
import ResultDisplay from './ResultDisplay';
import SpinWheel from './SpinWheel';

export default function SlopMachine({ onGenerate }: SlopMachineProps) {
	const {
		wheels,
		currentGeneration,
		isGeneratingVideo,
		getAllWheelsSpinning,
		canGenerate,
		setWheelSpinning,
		setWheelResult,
		addGeneration,
		resetWheels,
		recentCharacters,
		recentActions,
		recentSettings
	} = useSlopMachineStore();

	const [wheelIndices, setWheelIndices] = useState<{ [key: string]: number; }>({});

	const handleSpin = useCallback(() => {
		if (getAllWheelsSpinning()) return;

		// Reset any previous results
		resetWheels();

		// Start spinning all wheels with staggered delays
		wheelData.forEach((category, categoryIndex) => {
			const delay = getStaggerDelay(categoryIndex);

			setTimeout(() => {
				const wheelKey = category.id === 'characters' ? 'character' :
					category.id === 'actions' ? 'action' : 'setting';

				setWheelSpinning(wheelKey, true);

				// Filter recent items to avoid repetition
				const recentItems = category.id === 'characters' ? recentCharacters :
					category.id === 'actions' ? recentActions : recentSettings;

				const filteredItems = filterRecentItems(category.items, recentItems);
				const selectedItem = selectWeightedRandom(filteredItems);
				const selectedIndex = category.items.findIndex(item => item.id === selectedItem.id);

				setWheelIndices(prev => ({ ...prev, [category.id]: selectedIndex }));
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

				if (onGenerate) {
					const generation = useSlopMachineStore.getState().currentGeneration;
					if (generation) {
						onGenerate(generation);
					}
				}
			}
		}, 100);
	}, [setWheelResult, addGeneration, onGenerate]);

	const handleReset = useCallback(() => {
		resetWheels();
		setWheelIndices({});
	}, [resetWheels]);

	const isAnyWheelSpinning = getAllWheelsSpinning();

	return (
		<div className="w-full max-w-7xl mx-auto p-6 space-y-8">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="text-center"
			>
				<h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
					🎰 Slop Machine
				</h1>
				<p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
					Spin the wheels to generate wild and creative prompts for AI video generation.
					Combine characters, actions, and settings for hilarious results!
				</p>
			</motion.div>

			{/* Control Panel */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="flex justify-center gap-4"
			>
				<Button
					onClick={handleSpin}
					disabled={isAnyWheelSpinning}
					size="lg"
					className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isAnyWheelSpinning ? (
						<>
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
								className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
							/>
							Spinning...
						</>
					) : (
						<>
							<Dices className="w-5 h-5 mr-2" />
							Spin All Wheels!
						</>
					)}
				</Button>

				<Button
					onClick={handleReset}
					disabled={isAnyWheelSpinning}
					variant="outline"
					size="lg"
					className="px-6 py-4 text-lg rounded-xl"
				>
					<RotateCcw className="w-5 h-5 mr-2" />
					Reset
				</Button>
			</motion.div>

			{/* Wheels Container */}
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.6, delay: 0.4 }}
			>
				<Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700">
					<CardHeader>
						<CardTitle className="text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
							🎲 Spin the Wheels
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 justify-items-center">
							{wheelData.map((category, index) => (
								<motion.div
									key={category.id}
									initial={{ opacity: 0, y: 50 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										duration: 0.6,
										delay: 0.6 + (index * 0.1)
									}}
									className="w-full max-w-sm"
								>
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
									/>
								</motion.div>
							))}
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Result Display */}
			<ResultDisplay
				result={currentGeneration}
				isVisible={canGenerate() && !isAnyWheelSpinning}
				isGeneratingVideo={isGeneratingVideo}
				onGenerateVideo={() => {
					// This would integrate with your AI backend
					console.log('Generate video for:', currentGeneration?.combinedPrompt);
					// For now, just show the generating state
					useSlopMachineStore.getState().setGeneratingVideo(true);
					setTimeout(() => {
						useSlopMachineStore.getState().setGeneratingVideo(false);
					}, 3000);
				}}
			/>

			{/* Fun Stats or History could go here */}
			{currentGeneration && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.5, duration: 0.5 }}
					className="text-center text-sm text-gray-500 dark:text-gray-400"
				>
					🎉 Great combination! The rarer the items, the more epic your creation!
				</motion.div>
			)}
		</div>
	);
} 