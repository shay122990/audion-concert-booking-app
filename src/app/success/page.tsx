import Link from "next/link";
export default function SuccessPage() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Payment Successful!</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Thank you for your booking! A confirmation email has been sent.
        </p>
        <Link href="/" className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700">
          Back to Home
        </Link>
      </div>
    );
  }
  