'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GenerationResult } from '@/types/slop-machine';
import { motion } from 'framer-motion';
import { Check, Copy, Download, Image as ImageIcon, X } from 'lucide-react';
import { useState } from 'react';

interface ResultDisplayProps {
	result: GenerationResult | null;
	isVisible: boolean;
	onGenerateImage?: () => void;
	isGeneratingImage?: boolean;
	onClose?: () => void;
}

export default function ResultDisplay({
	result,
	isVisible,
	onGenerateImage,
	isGeneratingImage = false,
	onClose
}: ResultDisplayProps) {
	const [copied, setCopied] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);

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

	const handleDownloadImage = () => {
		if (!result?.imageBase64) return;

		const link = document.createElement('a');
		link.href = `data:image/png;base64,${result.imageBase64}`;
		link.download = `slop-machine-${result.id}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	if (!isVisible || !result) return null;

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.8 }}
			transition={{ duration: 0.3 }}
			className="w-full mx-auto"
		>
			<Card className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-4 border-yellow-400 shadow-2xl relative">
				{/* Close Button */}
				{onClose && (
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						onClick={onClose}
						className="absolute -top-2 -right-2 w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-colors z-10"
					>
						<X className="w-5 h-5" />
					</motion.button>
				)}

				<CardHeader className="text-center pb-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-xl">
					<motion.div
						initial={{ scale: 0, rotate: -180 }}
						animate={{ scale: 1, rotate: 0 }}
						transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
						className="flex justify-center mb-2"
					>
						<div className="text-4xl">🎰</div>
					</motion.div>
					<CardTitle className="text-2xl font-bold tracking-wide">
						🎉 JACKPOT! 🎉
					</CardTitle>
					<div className="text-sm opacity-90">Your Creative Combination</div>
				</CardHeader>

				<CardContent className="space-y-6 p-6">
					{/* Generated Image */}
					{result.imageBase64 && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.3, duration: 0.6 }}
							className="flex justify-center"
						>
							<div className="relative rounded-xl overflow-hidden shadow-lg border-4 border-yellow-400">
								<img
									src={`data:image/png;base64,${result.imageBase64}`}
									alt={result.combinedPrompt}
									className="max-w-full h-auto max-h-80 object-contain"
									onLoad={() => setImageLoaded(true)}
								/>
								{!imageLoaded && (
									<div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
										<motion.div
											animate={{ rotate: 360 }}
											transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
											className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full"
										/>
									</div>
								)}
							</div>
						</motion.div>
					)}

					{/* Generated Prompt */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className="bg-black rounded-xl p-4 border-2 border-yellow-400"
					>
						<h3 className="text-lg font-bold mb-3 text-yellow-400 font-mono">
							🎯 GENERATED PROMPT:
						</h3>
						<p className="text-green-400 font-mono text-base leading-relaxed">
							{result.combinedPrompt}
						</p>
					</motion.div>

					{/* Component Breakdown - Slot Machine Style */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6, duration: 0.5 }}
						className="grid grid-cols-3 gap-3"
					>
						<div className="bg-gradient-to-b from-red-500 to-red-600 text-white rounded-lg p-3 border-2 border-red-400 shadow-lg">
							<h4 className="font-bold text-center mb-1 text-xs">
								🎭 CHARACTER
							</h4>
							<p className="text-xs text-center leading-tight">
								{result.character.text}
							</p>
							{result.character.rarity !== 'common' && (
								<div className="text-xs text-center mt-1 opacity-80 capitalize">
									✨ {result.character.rarity}
								</div>
							)}
						</div>

						<div className="bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded-lg p-3 border-2 border-blue-400 shadow-lg">
							<h4 className="font-bold text-center mb-1 text-xs">
								🎬 ACTION
							</h4>
							<p className="text-xs text-center leading-tight">
								{result.action.text}
							</p>
							{result.action.rarity !== 'common' && (
								<div className="text-xs text-center mt-1 opacity-80 capitalize">
									✨ {result.action.rarity}
								</div>
							)}
						</div>

						<div className="bg-gradient-to-b from-green-500 to-green-600 text-white rounded-lg p-3 border-2 border-green-400 shadow-lg">
							<h4 className="font-bold text-center mb-1 text-xs">
								🌍 SETTING
							</h4>
							<p className="text-xs text-center leading-tight">
								{result.setting.text}
							</p>
							{result.setting.rarity !== 'common' && (
								<div className="text-xs text-center mt-1 opacity-80 capitalize">
									✨ {result.setting.rarity}
								</div>
							)}
						</div>
					</motion.div>

					{/* Action Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8, duration: 0.5 }}
						className="flex flex-wrap gap-3 justify-center"
					>
						<Button
							onClick={handleCopy}
							variant="outline"
							className="flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-400 font-bold"
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

						{result.imageBase64 && (
							<Button
								onClick={handleDownloadImage}
								variant="outline"
								className="flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-400 font-bold"
							>
								<Download className="w-4 h-4" />
								Download Image
							</Button>
						)}

						{onGenerateImage && (
							<Button
								onClick={onGenerateImage}
								disabled={isGeneratingImage}
								className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-6 py-2 rounded-lg shadow-lg border-2 border-green-400 transition-all duration-200"
							>
								{isGeneratingImage ? (
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
										<ImageIcon className="w-4 h-4 mr-2" />
										{result.imageBase64 ? 'Generate New Image' : 'Generate Image'}
									</>
								)}
							</Button>
						)}
					</motion.div>

					{/* Timestamp */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1, duration: 0.5 }}
						className="text-center text-xs text-gray-600 font-mono"
					>
						Generated: {result.timestamp.toLocaleString()}
					</motion.div>
				</CardContent>
			</Card>
		</motion.div>
	);
} 