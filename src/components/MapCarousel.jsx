import { MapContainer } from "react-leaflet"


const SmallMap = (props) => {

  const {pos, } = props

  return (
    <MapContainer
      center={[28.5973518, 83.54495724]}
      zoom={8}
      id="map"
      whenCreated={(m) => {
        map = m;
      }}
    >

    </MapContainer>
  )
}