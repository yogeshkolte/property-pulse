'use client'

import dynamic from 'next/dynamic'
import Spinner from '@/components/Spinner'

// Leaflet needs the browser's window object, so load it only on the client
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => <Spinner />,
})

export default LeafletMap
