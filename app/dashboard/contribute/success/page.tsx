'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ContributeSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect back to contribute page after 5 seconds
    const timeout = setTimeout(() => {
      router.push('/dashboard/contribute');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-xl mx-auto text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M16.707 22.293a1 1 0 00-1.414 1.414l6 6a1 1 0 001.414 0l12-12a1 1 0 10-1.414-1.414L22 27.586l-5.293-5.293z"
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Thank You for Your Contribution!</h2>
        
        <p className="text-gray-600 mb-8">
          Your data has been successfully submitted and will be reviewed by our team.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/dashboard/contribute')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Make Another Contribution
          </button>

          <p className="text-sm text-gray-500">
            You will be automatically redirected in 5 seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
