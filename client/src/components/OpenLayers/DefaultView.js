import View from "ol/View";
import { fromLonLat } from "ol/proj";

const MinneapolisLngLat = [-93.5, 46];
const MinneapolisMercator = fromLonLat(MinneapolisLngLat);

export default new View({
  center: MinneapolisMercator,
  zoom: 6
});
