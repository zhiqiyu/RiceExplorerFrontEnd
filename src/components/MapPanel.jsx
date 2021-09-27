import { useContext } from "react"
import Map from "./LeafletMap"
import { useDispatch, useSelector } from "react-redux"
import { MapCarousel } from "./MapCarousel"

export default function MapPanel(props) {

  const { showEditControl, info } = props

  // const sampleGeoJson = useSelector(state => state.samples)

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div className="map-container">
        <Map showEditControl={showEditControl} info={info} />
      </div>
      <div className="map-carousel-container">
        <MapCarousel />
      </div>
    </div>
  )
}