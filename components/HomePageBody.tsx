"use client";

import { SiteHeader } from "@/components/site-header";
import Support from "@/components/support";
import Footer from "@/components/footer";
import Image from "next/image";
import { Book, CreditCard, Flag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateAllPossibleTrips } from "@/data/dummy-data";
import Link from "next/link";
import { useQueryState, parseAsString } from "nuqs";
import { useAtom, useSetAtom } from "jotai";
import { stationsAtom } from "@/states/stations";
import StationComboBox from "@/components/StationComboBox";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="p-4 md:p-6 flex flex-col items-start">
    <div className="w-10 h-10 md:w-12 md:h-12 rounded bg-primary flex items-center justify-center mb-3 md:mb-4">
      {icon}
    </div>
    <h2 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">{title}</h2>
    <p className="text-sm md:text-base text-muted-foreground">{description}</p>
  </div>
);

interface ErrorCardProps {
  message: string;
  onClose: () => void;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ message, onClose }) => (
  <div
    className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-red-600">Error</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      <p className="mb-4">{message}</p>
      <div className="flex justify-end">
        <Button onClick={onClose} className="bg-pink-500 hover:bg-pink-600">
          OK
        </Button>
      </div>
    </div>
  </div>
);

interface Props {
  stations: StationsApiResponse["results"];
}

export default function HomePageBody() {
  const cities = [
    { id: "accra", name: "Accra" },
    { id: "kumasi", name: "Kumasi" },
  ];
  const [selectedCity, setSelectedCity] = useQueryState(
    "city",
    parseAsString.withDefault("")
  );
  const [startStation, setStartStation] = useQueryState(
    "start",
    parseAsString.withDefault("")
  );
  const [destinationStation, setDestinationStation] = useQueryState(
    "destination",
    parseAsString.withDefault("")
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const router = useRouter();
  const setStationsAtom = useSetAtom(stationsAtom);

  useEffect(() => {
    if (!selectedCity) {
      setStations([]);
      return;
    }
    setLoading(true);
    setFetchError("");
    fetch(`https://api.trotro.live/api/stations/by_city/?city=${selectedCity}&format=json`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch stations");
        const data: StationsApiResponse = await res.json();
        setStations(data.results);
      })
      .catch((err) => {
        setFetchError("Failed to fetch stations for the selected city.");
        setStations([]);
      })
      .finally(() => setLoading(false));
  }, [selectedCity]);

  const handleCheckFare = () => {
    if (!startStation || !destinationStation) {
      setErrorMessage("Please select both start and destination stations.");
      return;
    }
    setStationsAtom(stations);
    router.push(
      `/trips?start=${startStation}&destination=${destinationStation}&city=${selectedCity}`
    );
  };

  return (
    <main className="flex-1">
      {/* Error Message */}
      {errorMessage && (
        <ErrorCard message={errorMessage} onClose={() => setErrorMessage("")} />
      )}
      {/* Fetch Error */}
      {fetchError && (
        <ErrorCard message={fetchError} onClose={() => setFetchError("")} />
      )}
      {/* Hero Section */}
      <section className="relative">
        <div className="w-full h-[400px] md:h-[600px] lg:h-[800px] relative">
          <Image
            src="/assets/circle.jpeg"
            alt="Person in car"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:left-auto md:right-8 md:translate-x-0 bg-white p-4 md:p-6 rounded-lg shadow-lg w-[90%] max-w-sm mx-auto mt-12">
          <h3 className="text-xl md:text-2xl font-extrabold mb-4 md:mb-6">
            Select your start and destination stations to check your fare now!
          </h3>
          <div className="space-y-3 md:space-y-4">
            {/* City Dropdown */}
            <div className="flex flex-col space-y-1 md:space-y-2">
              <label htmlFor="city-select" className="text-sm font-medium">
                City
              </label>
              <select
                id="city-select"
                className="flex-1 border border-gray-300 rounded-lg p-2"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading stations...</div>
            ) : (
              <>
                <StationComboBox
                  label="Start Station"
                  id="start-station"
                  value={startStation}
                  onChange={setStartStation}
                  options={stations}
                  disabled={!selectedCity}
                />
                <StationComboBox
                  label="Destination Station"
                  id="destination-station"
                  value={destinationStation}
                  onChange={setDestinationStation}
                  options={stations}
                  disabled={!startStation}
                />
              </>
            )}
            <Button
              className="w-full bg-pink-500 hover:bg-pink-600"
              onClick={handleCheckFare}
              disabled={loading || !selectedCity}
            >
              Check Fare Now
            </Button>
          </div>
        </div>
      </section>
      {/* About Trotro.Live Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 items-center bg-gradient-to-br from-yellow-50 via-pink-50 to-pink-100 py-10 md:py-16 px-4 md:px-8 lg:px-16 gap-8">
        <div className="max-w-lg mx-auto space-y-4 md:space-y-6 order-2 md:order-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight">
            About <span className="text-pink-500">Us</span>
          </h1>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            We are revolutionizing transportation in Ghana by making Trotro
            (shared minibus) information accessible to over 3.5 million
            commuters in Accra, Kumasi, and Obuasi.
          </p>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            We are on a mission to digitize transportation, making it smarter,
            safer, and more efficient for everyone. Whether its finding fares,
            routes, or sending items, Trotro.Live is your go-to platform.
          </p>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Join us in transforming the way Ghana moves, one ride at a time.
          </p>
          <Button className="bg-pink-500 hover:bg-pink-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-lg">
            <Link href="/about" prefetch={true}>
              Learn More
            </Link>
          </Button>
        </div>
        <div className="relative w-full h-64 sm:h-80 md:h-96 order-1 md:order-2">
          <Image
            src="/assets/about.png"
            alt="About Trotro.Live"
            fill
            className="object-cover rounded-lg shadow-lg"
          />
        </div>
      </section>
      {/* App Promotion */}
      <section
        id="web3"
        className="bg-gradient-to-r from-yellow-50 via-pink-50 to-pink-100 py-10 md:py-16 px-4"
      >
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <div className="relative w-full h-[300px] md:h-[500px] max-w-sm mx-auto">
              <Image
                src="/assets/trotrodao.jpeg"
                alt="Mobile app screenshot"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6">
              Introducing Trotro DAO: The Future of Transportation
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
              Trotro.Live leverages blockchain and DAO principles to
              revolutionize transportation in Ghana. By decentralizing
              decision-making and empowering commuters, we aim to create a more
              efficient and transparent transportation ecosystem. Join us in
              shaping the future of mobility.
            </p>
            <Button className="bg-pink-500 hover:bg-pink-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>
      {/* Features */}
      <div className="p-4 md:p-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          <FeatureItem
            icon={
              <Book className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
            }
            title="Open Data"
            description="Station API and Trips API will be open and publicly consumable without login, enabling banks and individual projects to integrate seamlessly."
          />
          <FeatureItem
            icon={
              <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
            }
            title="Web 3 Community"
            description="Bringing more people on-chain by addressing local pain points of trotro through civic digital conversations. Earn Trotro tokens for approved data contributions."
          />
          <FeatureItem
            icon={
              <Flag className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
            }
            title="Trotro Pay"
            description="Connect your mobile money wallets to make payments directly to trotro mates and taxi drivers with ease."
          />
        </div>
      </div>
      {/* Support Section */}
      <section id="contact" className="py-8 md:py-16">
        <Support />
      </section>
      {/* Footer */}
      <Footer />
    </main>
  );
}
