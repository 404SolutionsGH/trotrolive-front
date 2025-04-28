import { NextResponse } from 'next/server';

// Mock data for stations
const stationsData = [
  {
    id: 1,
    name: "Accra Central",
    station_address: "Kwame Nkrumah Avenue, Accra",
    station_latitude: "5.550000",
    station_longitude: "-0.216667",
    image_url: "https://i.imgur.com/Yys2FtU.png",
    is_bus_stop: true
  },
  {
    id: 2,
    name: "Home Touch",
    station_address: "Home Touch Station",
    station_latitude: "5.587401",
    station_longitude: "-0.1675613",
    image_url: "https://i.imgur.com/Yys2FtU.png",
    is_bus_stop: true
  },
  {
    id: 3,
    name: "Roman Ridge 2nd",
    station_address: "",
    station_latitude: "5.601804",
    station_longitude: "-0.198887",
    image_url: "https://i.imgur.com/Yys2FtU.png",
    is_bus_stop: true
  },
  {
    id: 4,
    name: "Madina Market",
    station_address: "Madina Market Road",
    station_latitude: "5.669444",
    station_longitude: "-0.168889",
    image_url: "https://i.imgur.com/Yys2FtU.png",
    is_bus_stop: true
  },
  {
    id: 5,
    name: "Circle Station",
    station_address: "Kwame Nkrumah Circle",
    station_latitude: "5.570833",
    station_longitude: "-0.214722",
    image_url: "https://i.imgur.com/Yys2FtU.png",
    is_bus_stop: true
  },
  {
    id: 6,
    name: "Kasoa Main",
    station_address: "Kasoa Main Road",
    station_latitude: "5.533333",
    station_longitude: "-0.416667",
    image_url: "https://i.imgur.com/Yys2FtU.png",
    is_bus_stop: true
  },
  {
    id: 7,
    name: "Kaneshie Market",
    station_address: "Kaneshie Main Station",
    station_latitude: "5.576667",
    station_longitude: "-0.236944",
    image_url: "https://i.imgur.com/Yys2FtU.png",
    is_bus_stop: true
  }
];

// Default image if none is provided
const DEFAULT_IMAGE = "https://i.imgur.com/Yys2FtU.png";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const query = searchParams.get('query')?.toLowerCase();
  const id = searchParams.get('id');
  
  if (id) {
    const station = stationsData.find(s => s.id === parseInt(id));
    
    if (!station) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 });
    }
    
    const stationWithImage = {
      ...station,
      image_url: station.image_url || DEFAULT_IMAGE
    };
    
    return NextResponse.json(stationWithImage);
  }
  
  let filteredStations = stationsData;
  if (query) {
    filteredStations = stationsData.filter(station => 
      station.name.toLowerCase().includes(query) || 
      station.station_address.toLowerCase().includes(query)
    );
  }
  
  const stationsWithDefaultImages = filteredStations.map(station => ({
    ...station,
    image_url: station.image_url || DEFAULT_IMAGE
  }));
  
  return NextResponse.json(stationsWithDefaultImages);
}