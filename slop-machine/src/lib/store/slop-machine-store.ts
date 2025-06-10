import { generateId } from '@/lib/utils/random';
import { GenerationResult, SlopMachineState, WheelItem } from '@/types/slop-machine';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SlopMachineStore extends SlopMachineState {
	// Actions
	setWheelSpinning: (wheelId: keyof SlopMachineState['wheels'], isSpinning: boolean) => void;
	setWheelResult: (wheelId: keyof SlopMachineState['wheels'], item: WheelItem) => void;
	addGeneration: (character: WheelItem, action: WheelItem, setting: WheelItem) => void;
	clearCurrentGeneration: () => void;
	setGeneratingVideo: (isGenerating: boolean) => void;
	resetWheels: () => void;

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
	isGeneratingVideo: false
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

			clearCurrentGeneration: () =>
				set({ currentGeneration: null }),

			setGeneratingVideo: (isGenerating) =>
				set({ isGeneratingVideo: isGenerating }),

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