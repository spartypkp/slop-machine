'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GenerationResult } from '@/types/slop-machine';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface ResultDisplayProps {
	result: GenerationResult | null;
	isVisible: boolean;
	onGenerateVideo?: () => void;
	isGeneratingVideo?: boolean;
}

export default function ResultDisplay({
	result,
	isVisible,
	onGenerateVideo,
	isGeneratingVideo = false
}: ResultDisplayProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		if (!result) return;

		try {
			await navigator.clipboard.writeText(result.combinedPrompt);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	return (
		<AnimatePresence>
			{isVisible && result && (
				<motion.div
					initial={{ opacity: 0, y: 50, scale: 0.9 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 50, scale: 0.9 }}
					transition={{
						duration: 0.6,
						ease: 'easeOut',
						delay: 0.2
					}}
					className="w-full max-w-2xl mx-auto"
				>
					<Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-700 shadow-xl">
						<CardHeader className="text-center pb-4">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
								className="flex justify-center mb-2"
							>
								<Sparkles className="w-8 h-8 text-purple-500" />
							</motion.div>
							<CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
								Your Slop Creation!
							</CardTitle>
						</CardHeader>

						<CardContent className="space-y-6">
							{/* Generated Prompt */}
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.6, duration: 0.5 }}
								className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-gray-200 dark:border-gray-600"
							>
								<h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
									Generated Prompt:
								</h3>
								<p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
									{result.combinedPrompt}
								</p>
							</motion.div>

							{/* Component Breakdown */}
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.8, duration: 0.5 }}
								className="grid grid-cols-1 md:grid-cols-3 gap-4"
							>
								<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
									<h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
										🎭 Character
									</h4>
									<p className="text-sm text-blue-700 dark:text-blue-400">
										{result.character.text}
									</p>
								</div>

								<div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
									<h4 className="font-medium text-green-800 dark:text-green-300 mb-1">
										🎬 Action
									</h4>
									<p className="text-sm text-green-700 dark:text-green-400">
										{result.action.text}
									</p>
								</div>

								<div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
									<h4 className="font-medium text-orange-800 dark:text-orange-300 mb-1">
										🌍 Setting
									</h4>
									<p className="text-sm text-orange-700 dark:text-orange-400">
										{result.setting.text}
									</p>
								</div>
							</motion.div>

							{/* Action Buttons */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 1, duration: 0.5 }}
								className="flex flex-col sm:flex-row gap-3 justify-center"
							>
								<Button
									onClick={handleCopy}
									variant="outline"
									className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
								>
									{copied ? (
										<>
											<Check className="w-4 h-4 text-green-500" />
											Copied!
										</>
									) : (
										<>
											<Copy className="w-4 h-4" />
											Copy Prompt
										</>
									)}
								</Button>

								{onGenerateVideo && (
									<Button
										onClick={onGenerateVideo}
										disabled={isGeneratingVideo}
										className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
									>
										{isGeneratingVideo ? (
											<>
												<motion.div
													animate={{ rotate: 360 }}
													transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
													className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
												/>
												Generating...
											</>
										) : (
											<>
												<Sparkles className="w-4 h-4 mr-2" />
												Generate Video
											</>
										)}
									</Button>
								)}
							</motion.div>

							{/* Timestamp */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 1.2, duration: 0.5 }}
								className="text-center text-xs text-gray-500 dark:text-gray-400"
							>
								Generated on {result.timestamp.toLocaleString()}
							</motion.div>
						</CardContent>
					</Card>
				</motion.div>
			)}
		</AnimatePresence>
	);
} 