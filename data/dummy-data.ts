export const stations = [
  { id: 2, name: "Home Touch", latitude: "5.587401", longitude: "-0.1675613" },
  { id: 3, name: "Roman Ridge 2nd", latitude: "5.601804", longitude: "-0.198887" },
  { id: 4, name: "Bus Stop", latitude: "9.4498916", longitude: "-0.845144" },
  { id: 5, name: "Sowutuom", latitude: "5.6247652", longitude: "-0.2834304" },
  { id: 6, name: "Under Bridge", latitude: "5.6747917", longitude: "-0.0435957" },
  { id: 9, name: "Kokrobite", latitude: "5.4983674", longitude: "-0.3666181" },
  { id: 10, name: "ACP Junction", latitude: "5.68398", longitude: "-0.2776609" },
];

export const trips = [
  {
    id: 1,
    start_station: { id: 3, name: "Roman Ridge 2nd" },
    destination: { id: 4, name: "Bus Stop" },
    transport_type: "trotro",
    fare: "90.00",
    route: "Khshudioos",
  },
  {
    id: 2,
    start_station: { id: 6, name: "Under Bridge" },
    destination: { id: 9, name: "Kokrobite" },
    transport_type: "okada",
    fare: "10.00",
    route: "China Mall UnderBridge to Ashiaman Station",
  },
  {
    id: 3,
    start_station: { id: 10, name: "ACP Junction" },
    destination: { id: 5, name: "Sowutuom" },
    transport_type: "taxi",
    fare: "20.00",
    route: "Korle Bu Road",
  },
  {
    id: 4,
    start_station: { id: 2, name: "Home Touch" },
    destination: { id: 6, name: "Under Bridge" },
    transport_type: "trotro",
    fare: "15.00",
    route: "Home Touch to Under Bridge",
  },
  {
    id: 5,
    start_station: { id: 5, name: "Sowutuom" },
    destination: { id: 9, name: "Kokrobite" },
    transport_type: "okada",
    fare: "25.00",
    route: "Sowutuom to Kokrobite",
  },
  {
    id: 6,
    start_station: { id: 4, name: "Bus Stop" },
    destination: { id: 10, name: "ACP Junction" },
    transport_type: "taxi",
    fare: "30.00",
    route: "Bus Stop to ACP Junction",
  },
  {
    id: 7,
    start_station: { id: 3, name: "Roman Ridge 2nd" },
    destination: { id: 9, name: "Kokrobite" },
    transport_type: "trotro",
    fare: "50.00",
    route: "Roman Ridge 2nd to Kokrobite",
  },
  {
    id: 8,
    start_station: { id: 6, name: "Under Bridge" },
    destination: { id: 4, name: "Bus Stop" },
    transport_type: "okada",
    fare: "12.00",
    route: "Under Bridge to Bus Stop",
  },
];

const transportTypes = ["trotro", "okada", "taxi"];

function getRandomFare() {
  return (Math.floor(Math.random() * 9500) / 100 + 5).toFixed(2);
}

// Helper function to get a random transport type
function getRandomTransportType() {
  return transportTypes[Math.floor(Math.random() * transportTypes.length)];
}

export function generateAllPossibleTrips() {
  const allTrips = [];
  let tripId = 1;

  // Generate all possible combinations of start and destination stations
  for (let i = 0; i < stations.length; i++) {
    for (let j = 0; j < stations.length; j++) {
      // Skip if start and destination are the same
      if (i === j) continue;

      const startStation = stations[i];
      const destStation = stations[j];
      
      // Check if this trip already exists in the original trips data
      const existingTrip = trips.find(
        trip => 
          trip.start_station.id === startStation.id && 
          trip.destination.id === destStation.id
      );
      
      if (existingTrip) {
        // Use existing trip data
        allTrips.push({
          ...existingTrip,
          id: tripId++
        });
      } else {
        // Create a new trip with random transport type and fare
        const transportType = getRandomTransportType();
        const fare = getRandomFare();
        
        allTrips.push({
          id: tripId++,
          start_station: { id: startStation.id, name: startStation.name },
          destination: { id: destStation.id, name: destStation.name },
          transport_type: transportType,
          fare: fare,
          route: `${startStation.name} to ${destStation.name}`
        });
      }
    }
  }

  return allTrips;
}