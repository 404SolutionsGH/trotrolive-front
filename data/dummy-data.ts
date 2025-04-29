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
];