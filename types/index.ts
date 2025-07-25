type Station = {
  id: number;
  name: string;
  station_address: string;
  station_latitude: string;
  station_longitude: string;
  image_url: string;
  is_bus_stop: boolean;
  gtfs_source: string;
};

type StationsApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Station[];
};
