import React, { useState, useRef, useEffect } from 'react'

import OLMap from './OpenLayers/OLMap'

const MapController = ({ view, layers }) => {
  const [mapInstance, setMapInstance] = useState(null)
  const mapRef = useRef()

  useEffect(() => {
    // BUG: Somehow this creates a new map on viewport width change
    const redrawMap = () => {
      mapInstance.updateSize()
    }
    window.addEventListener('resize', redrawMap)

    return () => {
      window.removeEventListener('resize', redrawMap)
    }
  }, [])

  useEffect(() => {
    setMapInstance(OLMap(mapRef.current, view, layers))
  }, [view, layers])
  // data-nodrag is used to disable dragging on the grid
  return <div ref={mapRef} data-nodrag="true" style={{ height: '100%' }} />
}

export default MapController
