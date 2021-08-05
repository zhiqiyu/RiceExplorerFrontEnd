import { useContext } from "react"
import PhenologyContext from "../context/PhenologyContext"
import Map from "./LeafletMap"


export default function MapPanel(props) {

  const ctx = useContext(PhenologyContext)

  

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div className="map-container">
        <Map setMap={ctx.setMap} setLayerControl={ctx.setLayerControl} />
      </div>
      <div className="map-carousel-container">

      </div>
    </div>
  )
}