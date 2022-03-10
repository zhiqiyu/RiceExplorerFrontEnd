import Map from "../components/LeafletMap"
import { useDispatch, useSelector } from "react-redux"
import { MapCarousel } from "../components/MapCarousel"
import SplitPane from "react-split-pane"

export default function MapPanel(props) {

  const { info } = props

  const appName = useSelector(state => state.appName)

  // const sampleGeoJson = useSelector(state => state.samples)


  return (
    <SplitPane 
      split="horizontal" 
      primary="second" 
      defaultSize={appName === "phenology" ? 250 : 0} 
      maxSize={appName === "phenology" ? 400 : 0}
      minSize={0}
    >
      <div className="w-100 h-100">
        <Map info={info} />
      </div>

      <div className="w-100">
        {appName === "phenology" ? (<MapCarousel />) : null}
      </div>

    </SplitPane>
  )
}