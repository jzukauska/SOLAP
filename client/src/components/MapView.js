import React from 'react'
import useWindowSize from '../helpers/useWindowSize'

import DraggableGrid from './DraggableGrid'
import MapFilter from './MapFilter'
import MapController from './MapController'

import View from './OpenLayers/DefaultView'
import Layer from './OpenLayers/DefaultLayer'

const MapView = () => {
  const [width] = useWindowSize()

  return (
    <DraggableGrid>
      <MapFilter width="250" />
      <MapController view={View} layers={[Layer]} width={`${width - 250}`} />
    </DraggableGrid>
  )
}

export default MapView
