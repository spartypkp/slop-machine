import { generateId } from '@/lib/utils/random';
import { GenerationResult, ImageGenerationResponse, SlopMachineState, WheelItem } from '@/types/slop-machine';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SlopMachineStore extends SlopMachineState {
	// Actions
	setWheelSpinning: (wheelId: keyof SlopMachineState['wheels'], isSpinning: boolean) => void;
	setWheelResult: (wheelId: keyof SlopMachineState['wheels'], item: WheelItem) => void;
	addGeneration: (character: WheelItem, action: WheelItem, setting: WheelItem) => void;
	updateGenerationWithImage: (generationId: string, imageBase64: string) => void;
	clearCurrentGeneration: () => void;
	setGeneratingImage: (isGenerating: boolean) => void;
	resetWheels: () => void;
	generateImage: (prompt: string) => Promise<void>;

	// Getters
	getAllWheelsSpinning: () => boolean;
	getWheelResults: () => { character: WheelItem | null; action: WheelItem | null; setting: WheelItem | null; };
	canGenerate: () => boolean;

	// Recent items for anti-repetition
	recentCharacters: string[];
	recentActions: string[];
	recentSettings: string[];
	addRecentItem: (wheelId: 'characters' | 'actions' | 'settings', itemId: string) => void;
}

const initialState: SlopMachineState = {
	wheels: {
		character: { isSpinning: false, selectedItem: null },
		action: { isSpinning: false, selectedItem: null },
		setting: { isSpinning: false, selectedItem: null }
	},
	generationHistory: [],
	currentGeneration: null,
	isGeneratingImage: false
};

export const useSlopMachineStore = create<SlopMachineStore>()(
	persist(
		(set, get) => ({
			...initialState,
			recentCharacters: [],
			recentActions: [],
			recentSettings: [],

			setWheelSpinning: (wheelId, isSpinning) =>
				set((state) => ({
					wheels: {
						...state.wheels,
						[wheelId]: { ...state.wheels[wheelId], isSpinning }
					}
				})),

			setWheelResult: (wheelId, item) =>
				set((state) => ({
					wheels: {
						...state.wheels,
						[wheelId]: { ...state.wheels[wheelId], selectedItem: item, isSpinning: false }
					}
				})),

			addGeneration: (character, action, setting) => {
				const combinedPrompt = `${character.text} ${action.text} ${setting.text}`;
				const generation: GenerationResult = {
					id: generateId(),
					timestamp: new Date(),
					character,
					action,
					setting,
					combinedPrompt
				};

				set((state) => ({
					currentGeneration: generation,
					generationHistory: [generation, ...state.generationHistory.slice(0, 9)] // Keep last 10
				}));

				// Add to recent items for anti-repetition
				const store = get();
				store.addRecentItem('characters', character.id);
				store.addRecentItem('actions', action.id);
				store.addRecentItem('settings', setting.id);
			},

			updateGenerationWithImage: (generationId, imageBase64) =>
				set((state) => ({
					generationHistory: state.generationHistory.map(gen =>
						gen.id === generationId ? { ...gen, imageBase64 } : gen
					),
					currentGeneration:
						state.currentGeneration?.id === generationId
							? { ...state.currentGeneration, imageBase64 }
							: state.currentGeneration
				})),

			clearCurrentGeneration: () =>
				set({ currentGeneration: null }),

			setGeneratingImage: (isGenerating) =>
				set({ isGeneratingImage: isGenerating }),

			generateImage: async (prompt: string) => {
				set({ isGeneratingImage: true });

				try {
					const response = await fetch('/api/generate-image', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ prompt })
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const data: ImageGenerationResponse = await response.json();

					if (data.success && data.imageBase64) {
						const state = get();
						if (state.currentGeneration) {
							get().updateGenerationWithImage(state.currentGeneration.id, data.imageBase64);
						}
					} else {
						throw new Error(data.error || 'Failed to generate image');
					}
				} catch (error) {
					console.error('Error generating image:', error);
					// You might want to add error handling to the state
				} finally {
					set({ isGeneratingImage: false });
				}
			},

			resetWheels: () =>
				set((state) => ({
					wheels: {
						character: { isSpinning: false, selectedItem: null },
						action: { isSpinning: false, selectedItem: null },
						setting: { isSpinning: false, selectedItem: null }
					},
					currentGeneration: null
				})),

			getAllWheelsSpinning: () => {
				const state = get();
				return Object.values(state.wheels).some(wheel => wheel.isSpinning);
			},

			getWheelResults: () => {
				const state = get();
				return {
					character: state.wheels.character.selectedItem,
					action: state.wheels.action.selectedItem,
					setting: state.wheels.setting.selectedItem
				};
			},

			canGenerate: () => {
				const state = get();
				const results = state.getWheelResults();
				return results.character !== null && results.action !== null && results.setting !== null;
			},

			addRecentItem: (wheelId, itemId) =>
				set((state) => {
					const recentKey = `recent${wheelId.charAt(0).toUpperCase() + wheelId.slice(1)}` as keyof Pick<SlopMachineStore, 'recentCharacters' | 'recentActions' | 'recentSettings'>;
					const currentRecent = state[recentKey] as string[];

					return {
						[recentKey]: [itemId, ...currentRecent.slice(0, 4)] // Keep last 5
					};
				})
		}),
		{
			name: 'slop-machine-storage',
			partialize: (state) => ({
				generationHistory: state.generationHistory,
				recentCharacters: state.recentCharacters,
				recentActions: state.recentActions,
				recentSettings: state.recentSettings
			})
		}
	)
); 