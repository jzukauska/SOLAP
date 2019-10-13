import React from 'react'
import useWindowSize from '../helpers/useWindowSize'

import DraggableGrid from './DraggableGrid'
import MapFilter from './MapFilter'
import MapController from './MapController'

import View from './OpenLayers/DefaultView'
import Default from './OpenLayers/DefaultLayer'
import MNCountiesLayer from './OpenLayers/MNCountiesLayer'
import AlcoholLayer from './OpenLayers/AlcoholLayer'

const filterWidth = '250'

const MapView = () => {
  const [width] = useWindowSize()
  return (
    <DraggableGrid>
      <MapFilter width={filterWidth} />
      <MapController
        view={View}
        layers={[Default, MNCountiesLayer, AlcoholLayer]}
        width={`${width - filterWidth}`}
      />
    </DraggableGrid>
  )
}

export default MapView
