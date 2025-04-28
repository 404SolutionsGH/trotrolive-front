'use client'

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import { CheckCircle, MapPin, Clock, Calendar, CheckCheck } from 'lucide-react';
import Link from 'next/link';

export default function RideConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');
  
  useEffect(() => {
    // Redirect if not authenticated
    const isAuthenticated = document.cookie.includes('authenticated=true');
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Ride Booked Successfully!</h1>
            <p className="text-gray-600">Your ride has been confirmed with booking ID #{bookingId}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-pink-500 mt-1" />
                <div>
                  <h3 className="font-medium">Trip Route</h3>
                  <p className="text-gray-600">
                    From Station to Destination
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="w-5 h-5 mr-3 text-pink-500 mt-1" />
                <div>
                  <h3 className="font-medium">Date & Time</h3>
                  <p className="text-gray-600">Today at {new Date().toLocaleTimeString()}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="w-5 h-5 mr-3 text-pink-500 mt-1" />
                <div>
                  <h3 className="font-medium">Estimated Arrival</h3>
                  <p className="text-gray-600">20-30 minutes</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCheck className="w-5 h-5 mr-3 text-pink-500 mt-1" />
                <div>
                  <h3 className="font-medium">Status</h3>
                  <p className="text-green-600">Confirmed</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-pink-50 p-6 rounded-lg mb-8">
            <h2 className="text-lg font-semibold mb-2">What happens next?</h2>
            <p className="text-gray-700 mb-4">
              Your ride has been booked. You can show this confirmation at the station or 
              use the mobile app to track your ride status. The driver will contact you shortly.
            </p>
          </div>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full bg-pink-500 hover:bg-pink-600">
                Book Another Ride
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">© 2024 404 Solutions Inc.</p>
        </div>
      </footer>
    </div>
  );
}