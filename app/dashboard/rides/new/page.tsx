'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SiteHeader } from '@/components/site-header';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

interface Station {
  id: number;
  name: string;
  station_address: string;
  station_latitude: string;
  station_longitude: string;
  image_url: string;
  is_bus_stop: boolean;
}

interface TransportOption {
  id: number;
  type: 'trotro' | 'taxi' | 'shared';
  name: string;
  price: number;
  duration: string;
  description: string;
}

export default function NewRidePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromStationId = searchParams.get('from');
  const toLocation = searchParams.get('to');
  
  const [fromStation, setFromStation] = useState<Station | null>(null);
  const [destination, setDestination] = useState(toLocation || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transportOptions, setTransportOptions] = useState<TransportOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    // Redirect if not authenticated
    const isAuthenticated = document.cookie.includes('authenticated=true');
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/dashboard/rides/new');
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch the origin station details
        if (fromStationId) {
          const response = await fetch(`/api/stations?id=${fromStationId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch station details');
          }
          const stationData = await response.json();
          setFromStation(stationData);
          
          // Mock transport options based on the origin
          // In a real app, this would be an API call with the destination
          setTransportOptions([
            {
              id: 1,
              type: 'trotro',
              name: 'Trotro - Standard',
              price: 5,
              duration: '30-45 min',
              description: 'Shared minibus service with multiple stops'
            },
            {
              id: 2,
              type: 'trotro',
              name: 'Trotro - Express',
              price: 8,
              duration: '20-30 min',
              description: 'Limited stops express minibus service'
            },
            {
              id: 3,
              type: 'taxi',
              name: 'Taxi - Shared',
              price: 12,
              duration: '15-25 min',
              description: 'Shared taxi with up to 4 passengers'
            },
            {
              id: 4,
              type: 'taxi',
              name: 'Taxi - Private',
              price: 25,
              duration: '15-20 min',
              description: 'Private taxi service direct to destination'
            }
          ]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ride data:', err);
        setError('Could not load ride information. Please try again later.');
        setLoading(false);
      }
    }

    fetchData();
  }, [fromStationId, toLocation, router]);

  const handleBookRide = () => {
    if (!selectedOption) return;
    
    // In a real app, this would make an API request to book the ride
    // For now, just navigate to a confirmation page
    router.push(`/dashboard/rides/confirmation?id=${Math.floor(Math.random() * 10000)}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 container mx-auto py-8 px-4 flex items-center justify-center">
          <div className="text-center">Loading ride options...</div>
        </main>
      </div>
    );
  }

  if (error || !fromStation) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 container mx-auto py-8 px-4 flex items-center justify-center">
          <div className="text-center text-red-500">{error || 'Could not load station information'}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Request a Ride</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-pink-500" />
                {fromStation.name}
              </div>
              <ArrowRight className="w-4 h-4" />
              <div>{destination}</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-xl font-semibold mb-4">Transport Options</h2>
                
                <div className="space-y-4">
                  {transportOptions.map((option) => (
                    <div 
                      key={option.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors hover:border-pink-500 ${
                        selectedOption === option.id ? 'border-pink-500 bg-pink-50' : ''
                      }`}
                      onClick={() => setSelectedOption(option.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{option.name}</h3>
                        <span className="font-bold text-lg">₵{option.price}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Clock className="w-4 h-4 mr-1" />
                        {option.duration} estimated
                      </div>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-20">
                <h2 className="text-xl font-semibold mb-4">Your Trip</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">From</label>
                    <div className="flex items-center p-2 bg-gray-50 rounded border">
                      <MapPin className="w-4 h-4 mr-2 text-pink-500" />
                      {fromStation.name}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">To</label>
                    <Input 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                    />
                  </div>
                  
                  {selectedOption && (
                    <div className="pt-4 border-t">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Selected Option</span>
                        <span className="font-medium">
                          {transportOptions.find(o => o.id === selectedOption)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Price</span>
                        <span className="font-medium">
                          ₵{transportOptions.find(o => o.id === selectedOption)?.price}
                        </span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-gray-600">Estimated Time</span>
                        <span className="font-medium">
                          {transportOptions.find(o => o.id === selectedOption)?.duration}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full bg-pink-500 hover:bg-pink-600"
                    disabled={!selectedOption}
                    onClick={handleBookRide}
                  >
                    {selectedOption ? 'Book Now' : 'Select an option'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">© 2024 404 Solutions Inc.</p>
        </div>
      </footer>
    </div>
  );
}