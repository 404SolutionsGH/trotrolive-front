'use client'

import Support from "@/components/support";
import Image from "next/image"
import Link from "next/link"
import { Phone, Search, MapPin } from "lucide-react"
import { Book, CreditCard, Flag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";

interface FeatureItemProps {
  icon: React.ReactNode
  title: string
  description: string
}

interface Station {
  id: number;
  name: string;
  station_address: string;
  station_latitude: string;
  station_longitude: string;
  image_url: string;
  is_bus_stop: boolean;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <div className="p-6 flex flex-col items-start">
    <div className="w-12 h-12 rounded bg-primary flex items-center justify-center mb-4">
      {icon}
    </div>
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-muted-foreground">{description}</p>
  </div>
)

export default function Home() {
  const [location, setLocation] = useState("");
  const [isLocationEditable, setIsLocationEditable] = useState(true);
  const [error, setError] = useState("");
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showStationsList, setShowStationsList] = useState(false);

  // Fetch all stations on component mount
  useEffect(() => {
    async function fetchStations() {
      try {
        const response = await fetch('/api/stations');
        if (!response.ok) {
          throw new Error('Failed to fetch stations');
        }
        const data = await response.json();
        setStations(data);
        // Show first 5 stations by default
        setFilteredStations(data.slice(0, 5));
      } catch (err) {
        console.error("Error fetching stations:", err);
        setError("Failed to load stations. Please try again later.");
      }
    }

    fetchStations();
  }, []);

  // Get user location if available
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          setLocation(data.display_name || "Location not found");
          setIsLocationEditable(false);
        } catch (err) {
          console.error("Error fetching location:", err);
          setError("Failed to fetch location address.");
        }
      },
      (positionError) => {
        setError("Location permission denied. Please enter location manually.");
        setIsLocationEditable(true);
        if (positionError){
          return
        }
        if (isLocationEditable){
          return
        }
      }
    );
  }, [isLocationEditable]);

  // Handle location search and show stations
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    setSearchQuery(value);
    
    // Filter stations based on search
    if (value.trim()) {
      const results = stations.filter(station => 
        station.name.toLowerCase().includes(value.toLowerCase()) ||
        station.station_address.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStations(results.slice(0, 5));
      setShowStationsList(true);
    } else {
      setFilteredStations(stations.slice(0, 5));
      setShowStationsList(false);
    }
  };

  const selectStation = (station: Station) => {
    setLocation(station.name);
    setShowStationsList(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <SiteHeader />
        {/* Hero Section */}
        <section className="relative">
          <Image
            src='/assets/home-hero.svg'
            alt="Person in car"
            width={1200}
            height={600}
            className="w-full h-[800px] object-cover"
          />
          <div className="absolute top-1/2 right-8 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h3 className="text-2xl font-extrabold mb-6">
              Wondering the cost of transportation from anywhere to anywhere?
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search for a station"
                    value={location}
                    onChange={handleLocationChange}
                    className="flex-1 pr-10"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                {showStationsList && filteredStations.length > 0 && (
                  <div className="absolute z-10 w-full bg-white mt-1 border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    <ul>
                      {filteredStations.map((station) => (
                        <li 
                          key={station.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => selectStation(station)}
                        >
                          <MapPin className="h-4 w-4 mr-2 text-pink-500" />
                          <div>
                            <div className="font-medium">{station.name}</div>
                            {station.station_address && (
                              <div className="text-sm text-gray-500">{station.station_address}</div>
                            )}
                          </div>
                        </li>
                      ))}
                      {stations.length > 5 && (
                        <li className="px-4 py-2 text-center">
                          <Link href="/stations" className="text-pink-500 hover:text-pink-700">
                            View all stations
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              
              {error && <p className="text-red-500 text-sm">{error}</p>}
              
              <Button 
                onClick={() => setShowStationsList(!showStationsList)} 
                className="w-full bg-pink-500 hover:bg-pink-600"
              >
                Find Stations Near Me
              </Button>
            </div>
          </div>
        </section>

        {/* Live Station Section */}
        <section className="grid md:grid-cols-2">
          <div className="py-10">
            <div className="w-[68%] bg-navy-50 mx-auto p-10 gap-8 px-16">
              <h1 className="text-7xl font-extrabold mb-6">All trotro live station on your device</h1>
              <p className="text-gray-600 mb-6">
                Our fare system for trotros and taxis is available at over 48 stations points throughout Ghana. Reaching more towns and stations.
              </p>
              <div className="relative mb-6">
                <Input 
                  placeholder="Enter location" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <Link href="/stations">
                <Button className="w-full bg-pink-500 hover:bg-pink-600 mb-6">
                  View All Stations
                </Button>
              </Link>
              <p className="text-sm text-gray-600">
                App on when looking for a partner! You can also find all TROTROS and TAXIS issuing offices in our app.
              </p>
            </div>
          </div>
          <div className="bg-gray-100 w-full">
            {/* Map placeholder */}
            <div className="h-full min-h-[100%] bg-gray-200"></div>
          </div>
        </section>

        {/* App Promotion */}
        <section id="services" className="bg-gradient-to-r from-yellow-50 via-pink-50 to-pink-100 py-16">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
            <Image
              src='/assets/phone.svg'
              alt="Mobile app screenshot"
              width={400}
              height={800}
              className="mx-auto"
            />
            <div>
              <h1 className="text-7xl font-extrabold mb-6">Best city guide for Trotro rides!</h1>
              <p className="text-gray-600 mb-6">
                Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry&apos;s standard dummy text ever since the
              </p>
              <div className="flex gap-4 mb-8">
                <Image
                  src='/assets/AppStore.svg'
                  alt="Download on App Store"
                  width={140}
                  height={42}
                  className="h-[42px] w-auto"
                />
                <Image
                  src='/assets/Google play.svg'
                  alt="Get it on Google Play"
                  width={140}
                  height={42}
                  className="h-[42px] w-auto"
                />
              </div>
              <div className="space-y-2">
                <p className="flex items-center gap-2">• Lorem ipsum has been the industry&apos;s standard dummy text ever</p>
                <p className="flex items-center gap-2">• There are many variations of passages of ipsum available</p>
                <p className="flex items-center gap-2">• Many variations of passages of ipsum available</p>
                <p className="flex items-center gap-2">• There are many variations of passages of ipsum available</p>
              </div>
            </div>
          </div>

          <div className="p-10">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureItem
                icon={<Book className="w-6 h-6 text-primary-foreground" />}
                title="Get all stations"
                description="Lorem Ipsum has been the industry's standard dummy text ever There are many variations of passages of Ipsum"
              />
              <FeatureItem
                icon={<CreditCard className="w-6 h-6 text-primary-foreground" />}
                title="Availabel fares"
                description="Lorem Ipsum has been the industry's standard dummy text ever There are many variations of passages of Ipsum"
              />
              <FeatureItem
                icon={<Flag className="w-6 h-6 text-primary-foreground" />}
                title="Find missing item"
                description="Lorem Ipsum has been the industry's standard dummy text ever There are many variations of passages of Ipsum"
              />
            </div>
          </div>
        </section>

        {/* Support Section */}
        <Support />
      </main>

      {/* Footer - remains unchanged */}
      <footer className="bg-white py-12 border-t">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Our Mission</h3>
            <p className="text-sm text-gray-600">
              Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Pick a ride</li>
              <li>Find missing item</li>
              <li>Live station</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Home</li>
              <li>Services</li>
              <li>About Us</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                0245 985 764
              </p>
              <p>info@trotro.ai</p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">© 2024 404 Solutions Inc.</div>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>English</span>
              <span>Accra</span>
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}