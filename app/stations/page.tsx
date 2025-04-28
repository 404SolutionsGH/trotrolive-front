'use client'

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

interface Station {
  id: number;
  name: string;
  station_address: string;
  station_latitude: string;
  station_longitude: string;
  image_url: string;
  is_bus_stop: boolean;
}

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStations() {
      try {
        setLoading(true);
        const response = await fetch('/api/stations');
        if (!response.ok) {
          throw new Error('Failed to fetch stations');
        }
        const data = await response.json();
        setStations(data);
        setFilteredStations(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching stations:", err);
        setError("Failed to load stations. Please try again later.");
        setLoading(false);
      }
    }

    fetchStations();
  }, []);

  // Filter stations based on search input
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredStations(stations);
      return;
    }
    
    const filtered = stations.filter(station => 
      station.name.toLowerCase().includes(query.toLowerCase()) ||
      station.station_address.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredStations(filtered);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">All Trotro Stations</h1>
          <div className="relative max-w-md">
            <Input 
              placeholder="Search for stations by name or address" 
              value={searchQuery}
              onChange={handleSearch}
              className="pr-10"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-10">Loading stations...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : filteredStations.length === 0 ? (
          <div className="text-center py-10">No stations found matching your search.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStations.map((station) => (
              <Link href={`/stations/${station.id}`} key={station.id}>
                <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 relative bg-gray-200">
                    <Image
                      src={station.image_url || "https://i.imgur.com/Yys2FtU.png"}
                      alt={station.name}
                      fill
                      unoptimized={true}
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="font-bold text-xl mb-2">{station.name}</h2>
                    <div className="flex items-start mb-2">
                      <MapPin className="h-5 w-5 mr-2 text-pink-500 mt-0.5" />
                      <p className="text-gray-600">
                        {station.station_address || "Address not available"}
                      </p>
                    </div>
                    {station.is_bus_stop && (
                      <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        Bus Stop
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">© 2024 404 Solutions Inc.</p>
        </div>
      </footer>
    </div>
  );
}