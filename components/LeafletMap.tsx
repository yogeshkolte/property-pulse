'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import type { Coordinates } from '@/utils/requests'

const pinIcon = L.icon({
  iconUrl: '/images/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
})

const LeafletMap = ({ lat, lng }: Coordinates) => {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={false}
      // Own stacking context so map layers stay below the navbar menus
      className='relative z-0 h-[500px] w-full rounded-lg'
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={[lat, lng]} icon={pinIcon} />
    </MapContainer>
  )
}

export default LeafletMap
