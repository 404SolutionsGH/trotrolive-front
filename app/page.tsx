'use client'

import Support from "@/components/support";
import Footer from "@/components/footer"; // Import the Footer component
import Image from "next/image";
import { Book, CreditCard, Flag } from 'lucide-react';
import { Button } from "@/components/ui/button";
// Removed unused useEffect import
import { useState } from "react";
import { useRouter } from "next/navigation";
import { stations, trips } from "@/data/dummy-data"; // Import dummy data

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <div className="p-6 flex flex-col items-start">
    <div className="w-12 h-12 rounded bg-primary flex items-center justify-center mb-4">
      {icon}
    </div>
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default function Home() {
  const [startStation, setStartStation] = useState("");
  const [destinationStation, setDestinationStation] = useState("");
  const router = useRouter();

  const handleCheckFare = () => {
    if (!startStation || !destinationStation) {
      alert("Please select both start and destination stations.");
      return;
    }

    const matchingTrip = trips.find(
      (trip) =>
        trip.start_station.id.toString() === startStation &&
        trip.destination.id.toString() === destinationStation
    );

    if (matchingTrip) {
      router.push(
        `/trips?start=${startStation}&destination=${destinationStation}`
      );
    } else {
      alert("No trips found for the selected stations.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <Image
            src='/assets/circle.jpeg'
            alt="Person in car"
            width={1200}
            height={600}
            className="w-full h-[800px] object-cover"
          />
          <div className="absolute top-1/2 right-8 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h3 className="text-2xl font-extrabold mb-6">
              Select your start and destination stations to check your fare now!
            </h3>
            <p>
              Its easy to plan your trip with Trotro.Live data fare by GPRTU and People.
            </p>
            <p>
              Trotro.Live leverages blockchain and DAO principles to revolutionize transportation in Ghana. By decentralizing decision-making and empowering commuters, we aim to create a more efficient and transparent transportation ecosystem. Join us in shaping the future of mobility.
            </p>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="start-station" className="text-sm font-medium">
                  Start Station
                </label>
                <select
                  id="start-station"
                  className="flex-1 border border-gray-300 rounded-lg p-2"
                  value={startStation}
                  onChange={(e) => setStartStation(e.target.value)}
                >
                  <option value="">Select your start station</option>
                  {stations.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="destination-station" className="text-sm font-medium">
                  Destination Station
                </label>
                <select
                  id="destination-station"
                  className="flex-1 border border-gray-300 rounded-lg p-2"
                  value={destinationStation}
                  onChange={(e) => setDestinationStation(e.target.value)}
                >
                  <option value="">Select your destination station</option>
                  {stations.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                className="w-full bg-pink-500 hover:bg-pink-600"
                onClick={handleCheckFare}
              >
                Check Fare Now
              </Button>
            </div>
          </div>
        </section>

        {/* About Trotro.Live Section */}
        <section className="grid md:grid-cols-2 items-center bg-gradient-to-br from-yellow-50 via-pink-50 to-pink-100 py-16 px-8 md:px-16">
          <div className="max-w-lg mx-auto space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight">
              About <span className="text-pink-500">Us</span>
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              We are revolutionizing transportation in Ghana by making Trotro (shared minibus) information accessible to over 3.5 million commuters in Accra, Kumasi, and Obuasi.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We are on a mission to digitize transportation, making it smarter, safer, and more efficient for everyone. Whether its finding fares, routes, or sending items, Trotro.Live is your go-to platform.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Join us in transforming the way Ghana moves, one ride at a time.
            </p>
            <Button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg shadow-lg">
              Learn More
            </Button>
          </div>
          <div className="relative">
            <Image
              src="/assets/about.png"
              alt="About Trotro.Live"
              width={1200}
              height={800}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        </section>
        {/* App Promotion */}
        <section id="services" className="bg-gradient-to-r from-yellow-50 via-pink-50 to-pink-100 py-16">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
            <Image
              src='/assets/trotrodao.jpeg'
              alt="Mobile app screenshot"
              width={400}
              height={800}
              className="mx-auto"
            />
            <div>
              <h1 className="text-7xl font-extrabold mb-6">Introducing Trotro DAO: The Future of Transportation</h1>
              <p className="text-gray-600 mb-6">
            Trotro.Live leverages blockchain and DAO principles to revolutionize transportation in Ghana. By decentralizing decision-making and empowering commuters, we aim to create a more efficient and transparent transportation ecosystem. Join us in shaping the future of mobility.
          </p>
              <Button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg shadow-lg">
          Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <div className="p-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureItem
              icon={<Book className="w-6 h-6 text-primary-foreground" />}
              title="Open Data"
              description="Station API and Trips API will be open and publicly consumable without login, enabling banks and individual projects to integrate seamlessly."
            />
            <FeatureItem
              icon={<CreditCard className="w-6 h-6 text-primary-foreground" />}
              title="Web 3 Community"
              description="Bringing more people on-chain by addressing local pain points of trotro through civic digital conversations. Earn Trotro tokens for approved data contributions."
            />
            <FeatureItem
              icon={<Flag className="w-6 h-6 text-primary-foreground" />}
              title="Trotro Pay"
              description="Connect your mobile money wallets to make payments directly to trotro mates and taxi drivers with ease."
            />
          </div>
        </div>

        {/* Support Section */}
        <section id="contact" className="py-16">
          <Support />
        </section>
      </main>

      {/* Footer */}
      <Footer /> {/* Use the imported Footer component */}
    </div>
  );
}