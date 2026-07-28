import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const CHANGSHA_CENTER = [28.2282, 112.9388]

export default function TechnicianMap({ technicians }) {
  const mapElement = useRef(null)
  const mapInstance = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!mapElement.current || mapInstance.current) return undefined

    try {
      const map = L.map(mapElement.current, { zoomControl: false, scrollWheelZoom: false }).setView(CHANGSHA_CENTER, 13)
      mapInstance.current = map
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).on('tileerror', () => setFailed(true)).addTo(map)

      technicians.forEach((technician) => {
        const icon = L.divIcon({
          className: 'technician-marker-wrap',
          html: `<span class="technician-marker"><i>${technician.avatar}</i></span>`,
          iconSize: [34, 34],
          iconAnchor: [17, 34],
          popupAnchor: [0, -34],
        })
        L.marker([technician.latitude, technician.longitude], { icon }).addTo(map).bindPopup(`
          <div class="map-popup"><strong>${technician.name}</strong><span>★ ${technician.rating} · ${technician.distance}km</span><b>¥${technician.price} 起</b></div>
        `)
      })

      return () => {
        map.remove()
        mapInstance.current = null
      }
    } catch {
      setFailed(true)
      return undefined
    }
  }, [technicians])

  if (failed) return <section className="map-fallback"><span>⌖</span><div><b>附近技师地图暂不可用</b><small>您仍可通过下方列表预约服务</small></div></section>

  return <section className="map-section" aria-label="长沙附近技师地图"><div className="map-caption"><span>⌖ 长沙附近</span><small>{technicians.length} 位技师在线</small></div><div ref={mapElement} className="technician-map" /></section>
}
