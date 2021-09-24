import PropTypes from 'prop-types'
import { useRef } from 'react'

let ismdwn = 0

export function SplitPanel(props) {

  const {className, leftPanel, rightPanel} = props

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
    <div className={"h-100 " + className} style={{"display": "flex"}}>
      <div className="left-panel h-100" ref={panel1} children={leftPanel}></div>

      <div className="panel-separator" onMouseDown={handleMouseDown}></div>

      <div className="right-panel h-100 w-100" ref={panel2} children={rightPanel}></div>

    </div>
  )

}

SplitPanel.propTypes = {
  leftPanel: PropTypes.node,
  rightPanel: PropTypes.node,
}

export default SplitPanel