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
    /* 1 – CSS */
    if (!document.querySelector("link[data-leaflet]")) {
      const link = document.createElement("link")
      link.setAttribute("data-leaflet", "true")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)
    }

    /* 2 – JS */
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

export default function Map() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

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

        const purple = makeIcon(L, "#9333ea")
        const pink = makeIcon(L, "#ec4899")

        const spots = [
          { n: "Burma Camp", p: [5.62, -0.165], i: purple },
          { n: "Burma Hills", p: [5.625, -0.16], i: purple },
          { n: "Labadi", p: [5.58, -0.15], i: pink },
          { n: "Tsui Bleoo Station", p: [5.59, -0.14], i: pink },
          { n: "Current – Amanfro (Kasoa)", p: [5.55, -0.42], i: purple },
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

  return <div ref={containerRef} className="h-full w-full" />
}
