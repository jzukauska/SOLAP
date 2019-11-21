import React from 'react'

import FilterContextProvider from './FilterContextProvider'
import VizController from './VizController'

import { Grommet } from 'grommet'

import ViewBox from './ViewBox'

const theme = {
  global: {
    colors: {
      brand: '#0CA7D3',
      grey: '#DDDBE0',
      grey2: '#9A9A9A',
      focus: '#0CA7D3'
    },
    font: {
      family: 'Open Sans',
      size: '14px',
      height: '20px'
    }
  },
  heading: {
    font: {
      family: 'Archivo'
    }
  },
  formField: {
    label: {
      size: 'small'
    },
    help: {
      size: 'xsmall'
    }
  },
  checkBox: {
    border: {
      color: 'grey'
    },
    check: {
      extend: ({ checked }) => `
        ${checked && `background-color: #0CA7D3;`}
        `
    },
    icon: {
      extend: 'stroke: white;'
    },
    hover: {
      border: {
        color: 'brand'
      }
    }
  }
}

const App = () => {
  return (
    <Grommet theme={theme} full>
      <VizController>
        <FilterContextProvider>
          <ViewBox />
        </FilterContextProvider>
      </VizController>
    </Grommet>
  )
}

export default App
