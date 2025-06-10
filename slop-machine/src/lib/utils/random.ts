import { WheelItem } from '@/types/slop-machine';

/**
 * Select a random item from an array based on weighted probability
 */
export function selectWeightedRandom(items: WheelItem[]): WheelItem {
	const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
	let randomNum = Math.random() * totalWeight;

	for (const item of items) {
		randomNum -= item.weight;
		if (randomNum <= 0) {
			return item;
		}
	}

	// Fallback to first item (should never reach here)
	return items[0];
}

/**
 * Get a random index for a wheel with the given length
 */
export function getRandomWheelIndex(wheelLength: number): number {
	return Math.floor(Math.random() * wheelLength);
}

/**
 * Generate a random spin duration between min and max seconds
 */
export function getRandomSpinDuration(min: number = 2, max: number = 4): number {
	return Math.random() * (max - min) + min;
}

/**
 * Generate random rotation amount for wheel spin (multiple full rotations plus final position)
 */
export function getSpinRotation(finalIndex: number, wheelLength: number, minRotations: number = 3): number {
	const fullRotations = minRotations + Math.floor(Math.random() * 3); // 3-5 full rotations
	const finalRotation = (finalIndex / wheelLength) * 360;
	return fullRotations * 360 + finalRotation;
}

/**
 * Get random delay for staggered wheel spins
 */
export function getStaggerDelay(wheelIndex: number): number {
	return wheelIndex * 0.2; // 200ms delay between wheels
}

/**
 * Generate a unique ID for generation results
 */
export function generateId(): string {
	return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

/**
 * Anti-repetition system - filters out recently used items
 */
export function filterRecentItems(items: WheelItem[], recentIds: string[], maxRecent: number = 3): WheelItem[] {
	if (recentIds.length < maxRecent) {
		return items;
	}

	const recentSet = new Set(recentIds.slice(-maxRecent));
	const filtered = items.filter(item => !recentSet.has(item.id));

	// If all items are filtered out, return original array
	return filtered.length > 0 ? filtered : items;
} 