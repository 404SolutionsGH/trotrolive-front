"use client"

import { useEffect, useRef } from "react"

/* ------------------------------------------------------------
   Runtime loader – injects <link> + <script> only once
------------------------------------------------------------ */
function loadLeaflet(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"))

  //  Already loaded → reuse
  if ((window as any).L) return Promise.resolve((window as any).L)

  return new Promise((resolve, reject) => {
    /* 1 – CSS */
    if (!document.querySelector("link[data-leaflet]")) {
      const link = document.createElement("link")
      link.setAttribute("data-leaflet", "true")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)
    }

    /* 2 – JS */
    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.async = true
    script.onload = () => resolve((window as any).L)
    script.onerror = () => reject(new Error("Leaflet failed to load"))
    document.head.appendChild(script)
  })
}

/* SVG pin helper */
function makeIcon(L: any, hex: string) {
  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="${hex}"/>
        <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  })
}

/* SVG start marker helper */
function makeStartIcon(L: any) {
  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="15" r="12" fill="#10b981" stroke="white" stroke-width="3"/>
        <text x="15" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">S</text>
      </svg>
    `)}`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  })
}

/* SVG destination marker helper */
function makeDestinationIcon(L: any) {
  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="15" r="12" fill="#ef4444" stroke="white" stroke-width="3"/>
        <text x="15" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">D</text>
      </svg>
    `)}`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  })
}

interface MapProps {
  startStation?: {
    id: number;
    name: string;
    station_address: string;
    station_latitude: string;
    station_longitude: string;
    image_url: string;
    is_bus_stop: boolean;
    gtfs_source: string;
  } | null;
  destinationStation?: {
    id: number;
    name: string;
    station_address: string;
    station_latitude: string;
    station_longitude: string;
    image_url: string;
    is_bus_stop: boolean;
    gtfs_source: string;
  } | null;
}

export default function Map({ startStation, destinationStation }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const routeLayerRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false

    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current) return
        /* Init only once */
        if (mapRef.current) return

        const map = L.map(containerRef.current).setView([5.6037, -0.187], 12)
        mapRef.current = map

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map)

        // Create a layer group for route elements
        const routeLayer = L.layerGroup().addTo(map)
        routeLayerRef.current = routeLayer

        const purple = makeIcon(L, "#9333ea")
        const pink = makeIcon(L, "#ec4899")

        const spots = [
          // { n: "Burma Camp", p: [5.62, -0.165], i: purple },
        ] as const

        spots.forEach(({ n, p, i }) =>
          L.marker(p as [number, number], { icon: i })
            .addTo(map)
            .bindPopup(`<strong>${n}</strong>`),
        )
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err)
      })

    return () => {
      cancelled = true
      mapRef.current?.remove()
    }
  }, [])

  // Handle route updates when start/destination stations change
  useEffect(() => {
    if (!mapRef.current || !routeLayerRef.current) return

    const L = (window as any).L
    if (!L) return

    // Clear existing route
    routeLayerRef.current.clearLayers()

    // If both start and destination are provided, draw the route
    if (startStation && destinationStation) {
      const startLat = parseFloat(startStation.station_latitude)
      const startLng = parseFloat(startStation.station_longitude)
      const destLat = parseFloat(destinationStation.station_latitude)
      const destLng = parseFloat(destinationStation.station_longitude)

      // Check if coordinates are valid
      if (!isNaN(startLat) && !isNaN(startLng) && !isNaN(destLat) && !isNaN(destLng)) {
        const startIcon = makeStartIcon(L)
        const destIcon = makeDestinationIcon(L)

        // Add start marker
        const startMarker = L.marker([startLat, startLng], { icon: startIcon })
          .addTo(routeLayerRef.current)
          .bindPopup(`<strong>Start: ${startStation.name}</strong><br>${startStation.station_address}`)

        // Add destination marker
        const destMarker = L.marker([destLat, destLng], { icon: destIcon })
          .addTo(routeLayerRef.current)
          .bindPopup(`<strong>Destination: ${destinationStation.name}</strong><br>${destinationStation.station_address}`)

        // Draw route line
        const routeLine = L.polyline(
          [[startLat, startLng], [destLat, destLng]],
          {
            color: '#9333ea',
            weight: 4,
            opacity: 0.8,
            dashArray: '10, 10'
          }
        ).addTo(routeLayerRef.current)

        // Add route info popup at midpoint
        const midLat = (startLat + destLat) / 2
        const midLng = (startLng + destLng) / 2
        const routeInfo = L.popup({
          closeButton: false,
          autoClose: false,
          closeOnClick: false
        })
          .setLatLng([midLat, midLng])
          .setContent(`
            <div style="text-align: center; font-weight: bold; color: #9333ea;">
              Route: ${startStation.name} → ${destinationStation.name}
            </div>
          `)
          .addTo(routeLayerRef.current)

        // Fit map to show the entire route
        const bounds = L.latLngBounds([[startLat, startLng], [destLat, destLng]])
        mapRef.current.fitBounds(bounds, { padding: [20, 20] })
      }
    }
  }, [startStation, destinationStation])

  return <div ref={containerRef} className="h-full w-full" />
}
