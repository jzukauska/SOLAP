import View from 'ol/View'
import { fromLonLat } from 'ol/proj'

const MinneapolisLngLat = [-93.26384, 44.97997]
const MinneapolisMercator = fromLonLat(MinneapolisLngLat)

export default new View({
  center: MinneapolisMercator,
  zoom: 10
})
