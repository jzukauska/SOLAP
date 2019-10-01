import { useState, useLayoutEffect } from 'react'

export default () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight])

  useLayoutEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', updateSize)
    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return size
}
