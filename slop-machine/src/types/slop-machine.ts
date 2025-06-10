export interface WheelItem {
	id: string;
	text: string;
	rarity: 'common' | 'uncommon' | 'rare' | 'epic';
	weight: number;
}

export interface WheelCategory {
	id: string;
	name: string;
	emoji: string;
	items: WheelItem[];
}

export interface GenerationResult {
	id: string;
	timestamp: Date;
	character: WheelItem;
	action: WheelItem;
	setting: WheelItem;
	combinedPrompt: string;
	imageBase64?: string;
}

export interface SpinWheelProps {
	wheelId: string;
	items: WheelItem[];
	isSpinning: boolean;
	finalIndex?: number;
	onSpinComplete: (result: WheelItem) => void;
}

export interface ResultDisplayProps {
	character: string;
	action: string;
	setting: string;
	isVisible: boolean;
	generatedImage?: string;
	onGenerateImage?: () => void;
	isGeneratingImage?: boolean;
}

export interface SlopMachineProps {
	onGenerate?: (result: GenerationResult) => void;
}

export interface WheelState {
	isSpinning: boolean;
	selectedItem: WheelItem | null;
}

export interface SlopMachineState {
	wheels: {
		character: WheelState;
		action: WheelState;
		setting: WheelState;
	};
	generationHistory: GenerationResult[];
	currentGeneration: GenerationResult | null;
	isGeneratingImage: boolean;
}

export interface ImageGenerationRequest {
	prompt: string;
}

export interface ImageGenerationResponse {
	success: boolean;
	imageBase64?: string;
	prompt: string;
	timestamp: string;
	error?: string;
}

export type ImageJob = {
	id: string;
	status: 'pending' | 'processing' | 'complete' | 'error';
	imageUrl?: string;
	imageBase64?: string;
	estimatedTime?: number;
}; 