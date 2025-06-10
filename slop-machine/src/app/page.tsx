'use client';

import ResultDisplay from '@/components/slop-machine/ResultDisplay';
import SlopMachine from '@/components/slop-machine/SlopMachine';
import { useSlopMachineStore } from '@/lib/store/slop-machine-store';
import { GenerationResult } from '@/types/slop-machine';
import { useState } from 'react';

export default function Home() {
	const [modalResult, setModalResult] = useState<GenerationResult | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { generateImage, isGeneratingImage } = useSlopMachineStore();

	const handleGeneration = (result: GenerationResult) => {
		setModalResult(result);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setModalResult(null);
	};

	const handleGenerateImage = () => {
		if (modalResult?.combinedPrompt) {
			generateImage(modalResult.combinedPrompt);
		}
	};

	return (
		<>
			<SlopMachine onGenerate={handleGeneration} />

			{/* Modal Overlay */}
			{isModalOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
					onClick={handleCloseModal}
				>
					<div
						className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						<ResultDisplay
							result={modalResult}
							isVisible={isModalOpen}
							onGenerateImage={handleGenerateImage}
							isGeneratingImage={isGeneratingImage}
							onClose={handleCloseModal}
						/>
					</div>
				</div>
			)}
		</>
	);
}
