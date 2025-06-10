import SlopMachine from '@/components/slop-machine/SlopMachine';

export default function Home() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-900/20 dark:via-gray-900 dark:to-pink-900/20">
			<div className="container mx-auto px-4 py-8">
				<SlopMachine />
			</div>
		</main>
	);
}
