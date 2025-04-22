import Link from "next/link";
export default function CancelPage() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Payment Cancelled</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Your payment was not completed. You can try again anytime.
        </p>
        <Link href="/confirmation" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          Return to Confirmation Page
        </Link>
      </div>
    );
  }
  