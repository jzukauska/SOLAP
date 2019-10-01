import Tile from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
export default new Tile({
  source: new OSM()
})
