import PropTypes from 'prop-types'
import { useRef } from 'react'

let ismdwn = 0
let sepId = null

export function TriplePanel(props) {

  const {leftPanel, midPanel, rightPanel} = props

  const panel1 = useRef()
  const panel2 = useRef()
  const panel3 = useRef()

  function handleMouseDown(event) {
    ismdwn = 1
    document.body.addEventListener('mousemove', mV)
    document.body.addEventListener('mouseup', end)
  }

  const mV = (e) => {
    if (ismdwn === 1) {
      if (!sepId) {
        sepId = e.target.id
      }
      if (sepId === "sep1") {
        console.log(panel2.current.style.flexBasis, panel3.current.style.flexBasis)
        panel1.current.style.flexBasis = Math.min(Number.parseInt(e.clientX), document.body.clientWidth-10) + "px"
      } else {
        panel2.current.style.flexBasis = Math.min(Number.parseInt(e.clientX), document.body.clientWidth-10) + "px"
      }

    } else {
      end()
    }
  }
  const end = (e) => {
    ismdwn = 0
    sepId = null
    document.body.removeEventListener('mouseup', end)
    document.body.removeEventListener('mousemove', mV)
    // $('#separator').off('mousemove')
  }

  return (
    <div className="h-100 p-0" style={{"display": "flex"}}>
      <div className="left-panel h-100" ref={panel1} >
        {leftPanel}
      </div>

      <div id="sep1" className="panel-separator" onMouseDown={handleMouseDown}></div>

      <div className="mid-panel h-100" ref={panel2}>
        {midPanel}
      </div>

      <div id="sep2" className="panel-separator" onMouseDown={handleMouseDown}></div>

      <div className="right-panel h-100 w-100" ref={panel3} >
        {rightPanel}
      </div>

    </div>
  )

}

TriplePanel.propTypes = {
  leftPanel: PropTypes.node,
  midPanel: PropTypes.node,
  rightPanel: PropTypes.node,
}

export default TriplePanel