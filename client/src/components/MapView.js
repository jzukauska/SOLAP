import React from 'react'
import { FilterConsumer } from './FilterContextProvider'
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
    <FilterConsumer>
      {filterContext => {
        return (
          <DraggableGrid>
            <MapFilter width={filterWidth} filterContext={filterContext} />
            <MapController
              view={View}
              layers={[Layer]}
              width={`${width - filterWidth}`}
            />
          </DraggableGrid>
        )
      }}
    </FilterConsumer>
  )
}

export default MapView
