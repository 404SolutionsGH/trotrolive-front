// app/stations/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MapPin, ChevronLeft, MapIcon, Clock, Info, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SiteHeader } from '@/components/site-header';

interface Station {
  id: number;
  name: string;
  station_address: string;
  station_latitude: string;
  station_longitude: string;
  image_url: string;
  is_bus_stop: boolean;
}

export default function StationDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [station, setStation] = useState<Station | null>(null);
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRideForm, setShowRideForm] = useState(false);

  useEffect(() => {
    async function fetchStationDetails() {
      try {
        setLoading(true);
        const response = await fetch(`/api/stations?id=${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch station details');
        }
        
        const data = await response.json();
        setStation(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching station details:', err);
        setError('Could not load station details. Please try again later.');
        setLoading(false);
      }
    }

    if (params.id) {
      fetchStationDetails();
    }
  }, [params.id]);

  const handleRequestRide = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated and redirect if not
    const isAuthenticated = document.cookie.includes('authenticated=true');
    
    if (!isAuthenticated) {
      // Store intended destination in sessionStorage to retrieve after login
      sessionStorage.setItem('pendingRide', JSON.stringify({
        originStationId: params.id,
        destination
      }));
      
      router.push(`/auth/login?redirect=/stations/${params.id}`);
      return;
    }
    
    // If authenticated, proceed to ride request
    router.push(`/dashboard/rides/new?from=${params.id}&to=${encodeURIComponent(destination)}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 container mx-auto py-8 px-4 flex items-center justify-center">
          <div className="text-center">Loading station details...</div>
        </main>
      </div>
    );
  }

  if (error || !station) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 container mx-auto py-8 px-4 flex items-center justify-center">
          <div className="text-center text-red-500">{error || 'Station not found'}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      
      <main className="flex-1 mb-32">
        {/* Hero Section */}
        <div className="relative h-96">
          <Image
            src={station.image_url || "https://i.imgur.com/Yys2FtU.png"}
            alt={station.name}
            fill
            unoptimized={true}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="container mx-auto px-4 py-8 text-white">
              <button 
                onClick={() => router.back()}
                className="flex items-center text-white mb-4 hover:underline"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to all stations
              </button>
              <h1 className="text-4xl font-bold mb-2">{station.name}</h1>
              {station.station_address && (
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <p>{station.station_address}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Station Details */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-2xl font-semibold mb-4">About This Station</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <MapIcon className="w-5 h-5 mr-3 text-pink-500 mt-1" />
                    <div>
                      <h3 className="font-medium">Location</h3>
                      <p className="text-gray-600">
                        {station.station_address || 'Address not available'}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Coordinates: {station.station_latitude}, {station.station_longitude}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 mr-3 text-pink-500 mt-1" />
                    <div>
                      <h3 className="font-medium">Operating Hours</h3>
                      <p className="text-gray-600">5:00 AM - 10:00 PM</p>
                      <p className="text-gray-500 text-sm mt-1">Daily operations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Info className="w-5 h-5 mr-3 text-pink-500 mt-1" />
                    <div>
                      <h3 className="font-medium">Station Type</h3>
                      <p className="text-gray-600">
                        {station.is_bus_stop ? 'Bus Stop' : 'Transit Point'}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        {station.is_bus_stop ? 'Trotro and Taxi services available' : 'Limited services available'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Navigation className="w-5 h-5 mr-3 text-pink-500 mt-1" />
                    <div>
                      <h3 className="font-medium">Popular Destinations</h3>
                      <p className="text-gray-600">Accra Central, Madina, Kasoa</p>
                      <p className="text-gray-500 text-sm mt-1">Direct routes available</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Available Services</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="border rounded-md p-3 text-center">
                    <p className="font-medium">Trotro Services</p>
                    <p className="text-sm text-gray-500">Multiple routes</p>
                  </div>
                  <div className="border rounded-md p-3 text-center">
                    <p className="font-medium">Taxi Services</p>
                    <p className="text-sm text-gray-500">On-demand</p>
                  </div>
                  <div className="border rounded-md p-3 text-center">
                    <p className="font-medium">Waiting Area</p>
                    <p className="text-sm text-gray-500">Covered seating</p>
                  </div>
                  <div className="border rounded-md p-3 text-center">
                    <p className="font-medium">Food Vendors</p>
                    <p className="text-sm text-gray-500">Available nearby</p>
                  </div>
                  <div className="border rounded-md p-3 text-center">
                    <p className="font-medium">Washrooms</p>
                    <p className="text-sm text-gray-500">Public facilities</p>
                  </div>
                  <div className="border rounded-md p-3 text-center">
                    <p className="font-medium">Information Desk</p>
                    <p className="text-sm text-gray-500">Limited hours</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Ride Request Panel */}
            <div>
              <div className="bg-white mt-[500px] p-6 rounded-lg shadow-sm sticky scale-[0.8] ml-4 lg:-ml-[1200px]">
                <h2 className="text-xl font-semibold mb-4">Plan Your Trip</h2>
                
                {!showRideForm ? (
                  <div className="text-center">
                    <p className="mb-4 text-gray-600">Ready to travel from {station.name}?</p>
                    <Button 
                      onClick={() => setShowRideForm(true)}
                      className="w-1/2 bg-pink-500 hover:bg-pink-600 mb-4"
                    >
                      Request a Ride
                    </Button>
                    <p className="text-sm text-gray-500">
                      Find the most convenient and affordable transport options
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRequestRide}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="from">
                          From
                        </label>
                        <Input 
                          id="from"
                          value={station.name}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="to">
                          To
                        </label>
                        <Input 
                          id="to"
                          placeholder="Enter your destination"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit"
                        className="w-full bg-pink-500 hover:bg-pink-600"
                        disabled={!destination.trim()}
                      >
                        Find Transport Options
                      </Button>
                      
                      <p className="text-xs text-gray-500 text-center">
                        {`You'll be prompted to sign in if you're not already logged in`}
                      </p>
                    </div>
                  </form>
                )}
                
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-2">Popular Routes from {station.name}</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between text-sm">
                      <span>To Accra Central</span>
                      <span className="font-medium">₵8</span>
                    </li>
                    <li className="flex items-center justify-between text-sm">
                      <span>To Madina Market</span>
                      <span className="font-medium">₵10</span>
                    </li>
                    <li className="flex items-center justify-between text-sm">
                      <span>To Circle</span>
                      <span className="font-medium">₵7</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t mt-44">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">© 2024 404 Solutions Inc.</p>
        </div>
      </footer>
    </div>
  );
}