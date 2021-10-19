import {
  interaction, layer, custom, control, //name spaces
  Interactions, Overlays, Controls,     //group
  Map, Layers, Overlay, Util    //objects
} from "react-openlayers";

/** OpenLayers */
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import {
  defaults as defaultControls,
  ScaleLine,
  OverviewMap,
  MousePosition,
  ZoomToExtent,
} from "ol/control";

import MapContext from "./MapContext"

export function OlMap(props) {
  const { showEditControl, info } = props;

  const mapRef = useRef();

  const sampleState = useSelector(state => state.samples)

  useEffect(() => {

    // scale control
    const scalelineCtrl = new ScaleLine();

    const map = new Map({
      target: mapRef.current,
      layers: [context.base_layer],
      view: map_view,
      controls: defaultControls().extend([
        scalelineCtrl,
      ]),
    });
    
  }, []);

  // useEffect(() => {
  //   if (sampleState.selected) {

  //     let selected_sample = sampleState.geojson.features.filter(f => f.properties[idField] === sampleState.selected)[0]
  //     let latlon = [...selected_sample.geometry.coordinates].reverse()
  //     panToLatLng(latlon)

  //   }
  // }, [sampleState.selected])

  const displayMap = useMemo(
    () => (
      <div ref={mapRef} className="ol-map"></div>
    ),
    [showEditControl, info]
  );

  return (
    <MapContext.Provider value={null}>
      {displayMap}
    </MapContext.Provider>
  );
}