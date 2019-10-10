import React, { useEffect, useRef } from 'react'

import Muuri from 'muuri'

import styled from 'styled-components'

const windowHeight = window.innerHeight

const DraggableContainer = styled.div.attrs({
  className: '.draggable-grid'
})`
  position: relative;
  width: 100%;
  background-color: #363636;
`
const DraggableItem = styled.div.attrs({
  className: 'draggable-grid-item'
})`
  display: block;
  position: absolute;
  height: ${windowHeight - 50}px;
  z-index: 1;
  background-color: #dddbe0;
`

const DraggableGrid = ({ children }) => {
  const draggableRef = useRef()
  useEffect(() => {
    new Muuri(draggableRef.current, {
      items: '.draggable-grid-item',
      dragEnabled: false,
      dragAxis: 'x',
      dragStartPredicate: (item, e) => {
        // If the item is the map don't allow dragging
        if (item._child.children[0].dataset.nodrag) {
          return false
        }
        // Return default drag predicate
        return Muuri.ItemDrag.defaultStartPredicate(item, e)
      }
    })
  }, [])
  return (
    <DraggableContainer ref={draggableRef}>
      {children.map((child, idx) => {
        return (
          <DraggableItem key={idx}>
            <div
              className="draggable-item-content"
              style={{ width: `${child.props.width}px` }}
            >
              {child}
            </div>
          </DraggableItem>
        )
      })}
    </DraggableContainer>
  )
}

export default DraggableGrid
