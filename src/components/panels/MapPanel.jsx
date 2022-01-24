import { useContext } from "react"
import Map from "../LeafletMap"
import { useDispatch, useSelector } from "react-redux"
import { MapCarousel } from "../MapCarousel"

export default function MapPanel(props) {

  const { info } = props

  const appName = useSelector(state => state.appName)

  // const sampleGeoJson = useSelector(state => state.samples)

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div className="map-container">
        <Map info={info} />
      </div>
      {appName === "phenology" ? (
        <div className="map-carousel-container">
          <MapCarousel />
        </div>
      ) : null}

    </div>
  )
}