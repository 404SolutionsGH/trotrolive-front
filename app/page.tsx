'use client'

import Support from "@/components/support";
import Image from "next/image"
import Link from "next/link"
import { Phone } from "lucide-react"
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
  const [isLocationEditable, setIsLocationEditable] = useState(false);
  const [error, setError] = useState("");

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
        } catch (err) {
          console.error("Error fetching location:", err);
          setError("Failed to fetch location address.");
        }
      },
      (positionError) => {
        setError(positionError.message || "Could not retrieve location.");
      }
    );
  }, []);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const toggleLocationEdit = () => {
    setIsLocationEditable(!isLocationEditable);
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
              <div className="flex items-center space-x-2">
                {isLocationEditable ? (
                  <Input
                    placeholder="Enter pickup location"
                    value={location}
                    onChange={handleLocationChange}
                    className="flex-1"
                  />
                ) : (
                  <Input
                    placeholder="Enter pickup location"
                    value={location}
                    readOnly
                    className="flex-1 cursor-not-allowed"
                  />
                )}
                <Button
                  variant="outline"
                  onClick={toggleLocationEdit}
                  className="px-3"
                >
                  {isLocationEditable ? "Save" : "Edit"}
                </Button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Input placeholder="Enter destination" />
              <Button className="w-full bg-pink-500 hover:bg-pink-600">Check Now</Button>
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
              <Input placeholder="Enter location" className="mb-6" />
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
        <section className="bg-gradient-to-r from-yellow-50 via-pink-50 to-pink-100 py-16">
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


        {/* Features */}
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

      {/* Footer */}
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