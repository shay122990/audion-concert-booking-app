export default function Home() {
  return (
    <main className="min-h-screen px-6 py-24 flex flex-col items-center text-center gap-12">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
        Welcome to <span className="text-purple-600">Audion</span>
      </h1>
      <p className="text-lg max-w-xl text-gray-600 dark:text-gray-400">
        Book your next concert experience in just a few clicks. Discover, choose,
        and reserve tickets to your favorite live events with ease.
      </p>
      <a
        href="#events"
        className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-full text-lg hover:bg-purple-700 transition"
      >
        Browse Events
      </a>
    </main>
  );
}
