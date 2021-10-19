import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { APP_NAME, setAppName } from "../features/phenology/appNameSlice"

export function Home() {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setAppName(APP_NAME.home))
  }, [])

  return (
    <div>
      <h1>Hello</h1>
    </div>
  )
}

export default Home;