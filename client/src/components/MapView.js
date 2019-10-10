import React from 'react'
import useWindowSize from '../helpers/useWindowSize'

import DraggableGrid from './DraggableGrid'
import MapFilter from './MapFilter'
import MapController from './MapController'

import View from './OpenLayers/DefaultView'
import Layer from './OpenLayers/DefaultLayer'

const filterWidth = '250'

const MapView = () => {
  const [width] = useWindowSize()
  return (
    <DraggableGrid>
      <MapFilter width={filterWidth} />
      <MapController
        view={View}
        layers={[Layer]}
        width={`${width - filterWidth}`}
      />
    </DraggableGrid>
  )
}

export default MapView
