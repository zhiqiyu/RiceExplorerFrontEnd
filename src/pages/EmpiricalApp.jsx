import { useRef } from "react"
import { useEffect } from "react"
import { Form } from "react-bootstrap"
import { FilterGroup } from "../components/FilterGroup"

let ismdwn = 0

export function EmpiricalApp() {

  const panel1 = useRef()
  const panel2 = useRef()

  function handleMouseDown(event) {
    ismdwn = 1
    document.body.addEventListener('mousemove', mV)
    document.body.addEventListener('mouseup', end)
  }

  const mV = (e) => {
    if (ismdwn === 1) {
      panel1.current.style.flexBasis = Math.min(Number.parseInt(e.clientX), document.body.clientWidth-10) + "px"
    } else {
      end()
    }
  }
  const end = (e) => {
    ismdwn = 0
    document.body.removeEventListener('mouseup', end)
    document.body.removeEventListener('mousemove', mV)
    // $('#separator').off('mousemove')
  }

  return (
    <div className="h-100 p-0" style={{"display": "flex"}}>

      <div className="sidebar-container h-100" ref={panel1}>
        <div class="sidebar h-100 p-2">
          <Form method="POST">
            <FilterGroup name="Sowing" />
          </Form>
        </div>
      </div>

      <div id="separator" onMouseDown={handleMouseDown}></div>

      <div className="map-container h-100 w-100" ref={panel2}>
        
      </div>
    </div>
  )
}

export default EmpiricalApp;