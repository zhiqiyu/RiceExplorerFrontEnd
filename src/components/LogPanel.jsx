import { useSelector } from "react-redux"
import parse from 'html-react-parser'

export const LogPanel = () => {

  const log = useSelector(state => state.log)
  
  return (
    <div className="w-100 h-100 p-2 bg-white overflow-auto text-break d-flex flex-column-reverse">
      <div>
      {parse(log)}
      </div>
    </div>
  )
}