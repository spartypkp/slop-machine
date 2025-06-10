import { WheelCategory } from '@/types/slop-machine';

export const wheelData: WheelCategory[] = [
	{
		id: 'characters',
		name: 'Characters',
		emoji: '🎭',
		items: [
			// Humans with Professions (Common)
			{ id: 'c1', text: 'A confused accountant', rarity: 'common', weight: 100 },
			{ id: 'c2', text: 'An overconfident life coach', rarity: 'common', weight: 100 },
			{ id: 'c3', text: 'A retired circus performer', rarity: 'common', weight: 100 },
			{ id: 'c4', text: 'A motivational speaker', rarity: 'common', weight: 100 },
			{ id: 'c5', text: 'A wedding photographer', rarity: 'common', weight: 100 },
			{ id: 'c6', text: 'A door-to-door salesman', rarity: 'common', weight: 100 },
			{ id: 'c7', text: 'A philosophy professor', rarity: 'common', weight: 100 },
			{ id: 'c8', text: 'A conspiracy theorist', rarity: 'common', weight: 100 },
			{ id: 'c9', text: 'A food critic', rarity: 'common', weight: 100 },
			{ id: 'c10', text: 'A professional mime', rarity: 'common', weight: 100 },
			{ id: 'c11', text: 'A meteorologist', rarity: 'common', weight: 100 },
			{ id: 'c12', text: 'A crossing guard', rarity: 'common', weight: 100 },
			{ id: 'c13', text: 'A mall Santa', rarity: 'common', weight: 100 },
			{ id: 'c14', text: 'A yoga instructor', rarity: 'common', weight: 100 },
			{ id: 'c15', text: 'A librarian with anger issues', rarity: 'common', weight: 100 },

			// Animals with Personalities (Uncommon)
			{ id: 'c16', text: 'A philosophical penguin', rarity: 'uncommon', weight: 20 },
			{ id: 'c17', text: 'An anxious giraffe', rarity: 'uncommon', weight: 20 },
			{ id: 'c18', text: 'A narcissistic peacock', rarity: 'uncommon', weight: 20 },
			{ id: 'c19', text: 'A procrastinating sloth', rarity: 'uncommon', weight: 20 },
			{ id: 'c20', text: 'A perfectionist cat', rarity: 'uncommon', weight: 20 },
			{ id: 'c21', text: 'A gossipy parrot', rarity: 'uncommon', weight: 20 },
			{ id: 'c22', text: 'An entrepreneurial beaver', rarity: 'uncommon', weight: 20 },
			{ id: 'c23', text: 'A pessimistic owl', rarity: 'uncommon', weight: 20 },
			{ id: 'c24', text: 'A dramatic llama', rarity: 'uncommon', weight: 20 },
			{ id: 'c25', text: 'A sophisticated dolphin', rarity: 'uncommon', weight: 20 },
			{ id: 'c26', text: 'A paranoid squirrel', rarity: 'uncommon', weight: 20 },
			{ id: 'c27', text: 'A zen koala', rarity: 'uncommon', weight: 20 },
			{ id: 'c28', text: 'A competitive hamster', rarity: 'uncommon', weight: 20 },
			{ id: 'c29', text: 'A judgmental camel', rarity: 'uncommon', weight: 20 },
			{ id: 'c30', text: 'An artistic octopus', rarity: 'uncommon', weight: 20 },

			// Inanimate Objects with Life (Rare)
			{ id: 'c31', text: 'A sentient toaster', rarity: 'rare', weight: 5 },
			{ id: 'c32', text: 'A philosophical traffic light', rarity: 'rare', weight: 5 },
			{ id: 'c33', text: 'A depressed vacuum cleaner', rarity: 'rare', weight: 5 },
			{ id: 'c34', text: 'An ambitious houseplant', rarity: 'rare', weight: 5 },
			{ id: 'c35', text: 'A gossipy washing machine', rarity: 'rare', weight: 5 },
			{ id: 'c36', text: 'A melodramatic chandelier', rarity: 'rare', weight: 5 },
			{ id: 'c37', text: 'An anxious smoke detector', rarity: 'rare', weight: 5 },
			{ id: 'c38', text: 'A competitive dishwasher', rarity: 'rare', weight: 5 },
			{ id: 'c39', text: 'A romantic street lamp', rarity: 'rare', weight: 5 },
			{ id: 'c40', text: 'A pessimistic umbrella', rarity: 'rare', weight: 5 },
			{ id: 'c41', text: 'An overachieving calculator', rarity: 'rare', weight: 5 },
			{ id: 'c42', text: 'A rebellious GPS device', rarity: 'rare', weight: 5 },

			// Fantasy/Sci-Fi Characters (Epic)
			{ id: 'c43', text: 'A robot therapist', rarity: 'epic', weight: 2 },
			{ id: 'c44', text: 'A vampire sommelier', rarity: 'epic', weight: 2 },
			{ id: 'c45', text: 'A wizard accountant', rarity: 'epic', weight: 2 },
			{ id: 'c46', text: 'A cyborg chef', rarity: 'epic', weight: 2 },
			{ id: 'c47', text: 'A ghost real estate agent', rarity: 'epic', weight: 2 },

			// Ultra-Rare Legendary Characters
			{ id: 'c48', text: 'A time-traveling barista', rarity: 'legendary', weight: 0.5 },
			{ id: 'c49', text: 'An alien anthropologist', rarity: 'legendary', weight: 0.5 },
			{ id: 'c50', text: 'A dragon life coach', rarity: 'legendary', weight: 0.5 },
			{ id: 'c51', text: 'The last remaining unicorn', rarity: 'legendary', weight: 0.5 },
			{ id: 'c52', text: 'A sentient black hole', rarity: 'legendary', weight: 0.5 }
		]
	},
	{
		id: 'actions',
		name: 'Actions',
		emoji: '🎬',
		items: [
			// Everyday Activities Gone Wrong (Common)
			{ id: 'a1', text: 'trying to assemble IKEA furniture', rarity: 'common', weight: 100 },
			{ id: 'a2', text: 'hosting a dinner party', rarity: 'common', weight: 100 },
			{ id: 'a3', text: 'giving a presentation', rarity: 'common', weight: 100 },
			{ id: 'a4', text: 'teaching a dance class', rarity: 'common', weight: 100 },
			{ id: 'a5', text: 'doing their taxes', rarity: 'common', weight: 100 },
			{ id: 'a6', text: 'parallel parking', rarity: 'common', weight: 100 },
			{ id: 'a7', text: 'making small talk in an elevator', rarity: 'common', weight: 100 },
			{ id: 'a8', text: 'trying to cancel a subscription', rarity: 'common', weight: 100 },
			{ id: 'a9', text: 'explaining the internet to their grandmother', rarity: 'common', weight: 100 },
			{ id: 'a10', text: 'attempting to be trendy', rarity: 'common', weight: 100 },
			{ id: 'a11', text: 'learning TikTok dances', rarity: 'common', weight: 100 },
			{ id: 'a12', text: 'organizing their closet', rarity: 'common', weight: 100 },
			{ id: 'a13', text: 'trying to eat healthy', rarity: 'common', weight: 100 },
			{ id: 'a14', text: 'mastering meditation', rarity: 'common', weight: 100 },
			{ id: 'a15', text: 'going through a midlife crisis', rarity: 'common', weight: 100 },

			// Professional Scenarios (Uncommon)
			{ id: 'a16', text: 'hosting a cooking show', rarity: 'uncommon', weight: 20 },
			{ id: 'a17', text: 'running a business meeting', rarity: 'uncommon', weight: 20 },
			{ id: 'a18', text: 'teaching a masterclass', rarity: 'uncommon', weight: 20 },
			{ id: 'a19', text: 'conducting a job interview', rarity: 'uncommon', weight: 20 },
			{ id: 'a20', text: 'giving a TED talk', rarity: 'uncommon', weight: 20 },
			{ id: 'a21', text: 'running for political office', rarity: 'uncommon', weight: 20 },
			{ id: 'a22', text: 'hosting a game show', rarity: 'uncommon', weight: 20 },
			{ id: 'a23', text: 'reviewing restaurants', rarity: 'uncommon', weight: 20 },
			{ id: 'a24', text: 'leading a workout class', rarity: 'uncommon', weight: 20 },
			{ id: 'a25', text: 'moderating a debate', rarity: 'uncommon', weight: 20 },
			{ id: 'a26', text: 'running a support group', rarity: 'uncommon', weight: 20 },
			{ id: 'a27', text: 'training new employees', rarity: 'uncommon', weight: 20 },
			{ id: 'a28', text: 'pitching their startup idea', rarity: 'uncommon', weight: 20 },
			{ id: 'a29', text: 'hosting a podcast', rarity: 'uncommon', weight: 20 },
			{ id: 'a30', text: 'running a therapy session', rarity: 'uncommon', weight: 20 },

			// Creative/Artistic Pursuits (Rare)
			{ id: 'a31', text: 'creating a masterpiece', rarity: 'rare', weight: 5 },
			{ id: 'a32', text: 'writing their memoirs', rarity: 'rare', weight: 5 },
			{ id: 'a33', text: 'composing a love song', rarity: 'rare', weight: 5 },
			{ id: 'a34', text: 'choreographing a dance', rarity: 'rare', weight: 5 },
			{ id: 'a35', text: 'directing a movie', rarity: 'rare', weight: 5 },
			{ id: 'a36', text: 'designing a fashion line', rarity: 'rare', weight: 5 },
			{ id: 'a37', text: 'building a sculpture', rarity: 'rare', weight: 5 },
			{ id: 'a38', text: 'writing a screenplay', rarity: 'rare', weight: 5 },
			{ id: 'a39', text: 'creating a viral video', rarity: 'rare', weight: 5 },
			{ id: 'a40', text: 'designing a video game', rarity: 'rare', weight: 5 },
			{ id: 'a41', text: 'composing an opera', rarity: 'rare', weight: 5 },
			{ id: 'a42', text: 'creating a comic book', rarity: 'rare', weight: 5 },

			// Major Challenges (Epic)
			{ id: 'a43', text: 'curing procrastination', rarity: 'epic', weight: 2 },
			{ id: 'a44', text: 'eliminating traffic jams', rarity: 'epic', weight: 2 },
			{ id: 'a45', text: 'solving the mystery of missing socks', rarity: 'epic', weight: 2 },
			{ id: 'a46', text: 'creating the perfect pizza', rarity: 'epic', weight: 2 },
			{ id: 'a47', text: 'finding the meaning of life', rarity: 'epic', weight: 2 },

			// World-Changing Actions (Legendary)
			{ id: 'a48', text: 'solving world hunger', rarity: 'legendary', weight: 0.5 },
			{ id: 'a49', text: 'fixing climate change', rarity: 'legendary', weight: 0.5 },
			{ id: 'a50', text: 'achieving world peace', rarity: 'legendary', weight: 0.5 },
			{ id: 'a51', text: 'discovering the cure for aging', rarity: 'legendary', weight: 0.5 },
			{ id: 'a52', text: 'unifying all dimensions', rarity: 'legendary', weight: 0.5 }
		]
	},
	{
		id: 'settings',
		name: 'Settings',
		emoji: '🌍',
		items: [
			// Unlikely Locations (Common)
			{ id: 's1', text: 'in a haunted library', rarity: 'common', weight: 100 },
			{ id: 's2', text: 'on a deserted island', rarity: 'common', weight: 100 },
			{ id: 's3', text: 'in a medieval castle', rarity: 'common', weight: 100 },
			{ id: 's4', text: 'at a retirement home', rarity: 'common', weight: 100 },
			{ id: 's5', text: 'in a grocery store after hours', rarity: 'common', weight: 100 },
			{ id: 's6', text: 'in a hot air balloon', rarity: 'common', weight: 100 },
			{ id: 's7', text: 'in a tree house', rarity: 'common', weight: 100 },
			{ id: 's8', text: 'in a museum after closing', rarity: 'common', weight: 100 },
			{ id: 's9', text: 'on a pirate ship', rarity: 'common', weight: 100 },
			{ id: 's10', text: 'in an abandoned mall', rarity: 'common', weight: 100 },
			{ id: 's11', text: 'at a gas station at 3am', rarity: 'common', weight: 100 },
			{ id: 's12', text: 'in a laundromat', rarity: 'common', weight: 100 },
			{ id: 's13', text: 'at a 24-hour diner', rarity: 'common', weight: 100 },
			{ id: 's14', text: 'in a parking garage', rarity: 'common', weight: 100 },
			{ id: 's15', text: 'at a truck stop', rarity: 'common', weight: 100 },

			// Time-Based Contexts (Uncommon)
			{ id: 's16', text: 'during their first day on the job', rarity: 'uncommon', weight: 20 },
			{ id: 's17', text: 'while being filmed for a documentary', rarity: 'uncommon', weight: 20 },
			{ id: 's18', text: 'during a live TV interview', rarity: 'uncommon', weight: 20 },
			{ id: 's19', text: 'while their parents are watching', rarity: 'uncommon', weight: 20 },
			{ id: 's20', text: 'during a natural disaster', rarity: 'uncommon', weight: 20 },
			{ id: 's21', text: 'during their 15 minutes of fame', rarity: 'uncommon', weight: 20 },
			{ id: 's22', text: 'while everyone else is asleep', rarity: 'uncommon', weight: 20 },
			{ id: 's23', text: 'during a full moon', rarity: 'uncommon', weight: 20 },
			{ id: 's24', text: 'while being secretly recorded', rarity: 'uncommon', weight: 20 },
			{ id: 's25', text: 'during the apocalypse', rarity: 'uncommon', weight: 20 },
			{ id: 's26', text: 'while their boss is on vacation', rarity: 'uncommon', weight: 20 },
			{ id: 's27', text: 'during a thunderstorm', rarity: 'uncommon', weight: 20 },
			{ id: 's28', text: 'while wearing a disguise', rarity: 'uncommon', weight: 20 },
			{ id: 's29', text: 'during rush hour', rarity: 'uncommon', weight: 20 },
			{ id: 's30', text: 'while being followed by paparazzi', rarity: 'uncommon', weight: 20 },

			// Social/Event Contexts (Rare)
			{ id: 's31', text: 'at their high school reunion', rarity: 'rare', weight: 5 },
			{ id: 's32', text: 'during a family dinner', rarity: 'rare', weight: 5 },
			{ id: 's33', text: 'at a corporate retreat', rarity: 'rare', weight: 5 },
			{ id: 's34', text: 'during a first date', rarity: 'rare', weight: 5 },
			{ id: 's35', text: 'at a children\'s birthday party', rarity: 'rare', weight: 5 },
			{ id: 's36', text: 'during a job interview', rarity: 'rare', weight: 5 },
			{ id: 's37', text: 'at a funeral', rarity: 'rare', weight: 5 },
			{ id: 's38', text: 'during a wedding ceremony', rarity: 'rare', weight: 5 },
			{ id: 's39', text: 'at a PTA meeting', rarity: 'rare', weight: 5 },
			{ id: 's40', text: 'during a blind date', rarity: 'rare', weight: 5 },
			{ id: 's41', text: 'at a book club meeting', rarity: 'rare', weight: 5 },
			{ id: 's42', text: 'during a parent-teacher conference', rarity: 'rare', weight: 5 },

			// Surreal Contexts (Epic)
			{ id: 's43', text: 'where everyone communicates through interpretive dance', rarity: 'epic', weight: 2 },
			{ id: 's44', text: 'while slowly turning into their opposite', rarity: 'epic', weight: 2 },
			{ id: 's45', text: 'in a reality where time moves backwards', rarity: 'epic', weight: 2 },
			{ id: 's46', text: 'where gravity works sideways', rarity: 'epic', weight: 2 },
			{ id: 's47', text: 'while everything is made of jello', rarity: 'epic', weight: 2 },

			// Mind-Bending Legendary Settings
			{ id: 's48', text: 'in a zero-gravity disco', rarity: 'legendary', weight: 0.5 },
			{ id: 's49', text: 'inside a giant snow globe', rarity: 'legendary', weight: 0.5 },
			{ id: 's50', text: 'inside a black hole', rarity: 'legendary', weight: 0.5 },
			{ id: 's51', text: 'at the edge of the multiverse', rarity: 'legendary', weight: 0.5 },
			{ id: 's52', text: 'in the consciousness of an AI', rarity: 'legendary', weight: 0.5 }
		]
	}
];

export const getRarityColor = (rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'): string => {
	switch (rarity) {
		case 'common':
			return 'text-gray-600';
		case 'uncommon':
			return 'text-blue-500';
		case 'rare':
			return 'text-green-500';
		case 'epic':
			return 'text-purple-500';
		case 'legendary':
			return 'text-yellow-500';
		default:
			return 'text-gray-600';
	}
};

export const getRarityBgColor = (rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'): string => {
	switch (rarity) {
		case 'common':
			return 'bg-gray-100';
		case 'uncommon':
			return 'bg-blue-100';
		case 'rare':
			return 'bg-green-100';
		case 'epic':
			return 'bg-purple-100';
		case 'legendary':
			return 'bg-yellow-100';
		default:
			return 'bg-gray-100';
	}
};

export const getRarityGlow = (rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'): string => {
	switch (rarity) {
		case 'common':
			return '';
		case 'uncommon':
			return 'shadow-lg shadow-blue-500/25';
		case 'rare':
			return 'shadow-lg shadow-green-500/25';
		case 'epic':
			return 'shadow-lg shadow-purple-500/25';
		case 'legendary':
			return 'shadow-xl shadow-yellow-500/50 animate-pulse';
		default:
			return '';
	}
};

// Helper function to get weighted random item from a category
export const getWeightedRandomItem = (items: typeof wheelData[0]['items']) => {
	const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
	let random = Math.random() * totalWeight;

	for (const item of items) {
		random -= item.weight;
		if (random <= 0) {
			return item;
		}
	}

	return items[items.length - 1]; // fallback
};

// Helper to get rarity distribution stats
export const getRarityStats = () => {
	const stats = { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 };

	wheelData.forEach(category => {
		category.items.forEach(item => {
			stats[item.rarity]++;
		});
	});

	return stats;
};

// Helper to calculate combination odds
export const getCombinationOdds = () => {
	const totalWeights = wheelData.map(category =>
		category.items.reduce((sum, item) => sum + item.weight, 0)
	);

	const rarityWeights = wheelData.map(category => {
		const weights = { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 };
		category.items.forEach(item => {
			weights[item.rarity] += item.weight;
		});
		return weights;
	});

	// Calculate odds for specific combinations
	const calculateOdds = (r1: string, r2: string, r3: string) => {
		const prob1 = rarityWeights[0][r1 as keyof typeof rarityWeights[0]] / totalWeights[0];
		const prob2 = rarityWeights[1][r2 as keyof typeof rarityWeights[1]] / totalWeights[1];
		const prob3 = rarityWeights[2][r3 as keyof typeof rarityWeights[2]] / totalWeights[2];
		return prob1 * prob2 * prob3;
	};

	// Calculate probability of getting at least one legendary
	const noLegendaryProb = rarityWeights.map((weights, i) =>
		(totalWeights[i] - weights.legendary) / totalWeights[i]
	);
	const anyLegendaryProb = 1 - (noLegendaryProb[0] * noLegendaryProb[1] * noLegendaryProb[2]);

	return {
		tripleCommon: calculateOdds('common', 'common', 'common'),
		tripleUncommon: calculateOdds('uncommon', 'uncommon', 'uncommon'),
		tripleRare: calculateOdds('rare', 'rare', 'rare'),
		tripleEpic: calculateOdds('epic', 'epic', 'epic'),
		tripleLegendary: calculateOdds('legendary', 'legendary', 'legendary'),
		anyLegendary: anyLegendaryProb,
		jackpot: calculateOdds('legendary', 'legendary', 'legendary')
	};
};

// Helper to get real rarity percentages for display
export const getRealRarityPercentages = () => {
	const totalWeight = wheelData[0].items.reduce((sum, item) => sum + item.weight, 0);

	const rarityWeights = { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 };
	wheelData[0].items.forEach(item => {
		rarityWeights[item.rarity] += item.weight;
	});

	return {
		common: (rarityWeights.common / totalWeight) * 100,
		uncommon: (rarityWeights.uncommon / totalWeight) * 100,
		rare: (rarityWeights.rare / totalWeight) * 100,
		epic: (rarityWeights.epic / totalWeight) * 100,
		legendary: (rarityWeights.legendary / totalWeight) * 100
	};
};