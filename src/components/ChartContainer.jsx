import { Fragment, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Chart from "react-google-charts";
import _ from 'lodash'
import { idField } from "./SampleContainer";
import { Button, Card, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import { ArrowsFullscreen } from "react-bootstrap-icons";
import { saveAs } from 'file-saver'

const prepareChartData = (sample) => {
  let curve_data = {}
  Object.entries(sample.properties).forEach(([key, val]) => {
    if (key.endsWith('_feature')) {
      let words = key.split('_')
      let date = new Date(Number.parseInt(words[words.length - 2])).getTime()
      curve_data[date] = val === 99999 ? null : val
    }
  })

  if (Object.keys(curve_data).length === 0) {
    return null
  }

  let chartData = [['date', 'value']]

  Object.keys(curve_data).sort((a,b)=>Number.parseInt(a)-Number.parseInt(b)).forEach(date => {
    let row = Array(chartData[0].length).fill(null)
    row[0] = new Date(Number.parseInt(date))
    row[1] = curve_data[date]
    chartData.push(row)
  })
  
  return chartData
}


export const ChartContainer = () => {

  
  const [chartModalShow, setChartModalShow] = useState(false);

  const [chartData, setChartData] = useState(null);

  const sampleState = useSelector((state) => state.samples);


  useEffect(() => {
    if (typeof sampleState.selected === 'number') {
      // console.log(sampleState.selected.geometry.coordinates.reverse())
      let selected_sample = sampleState.geojson.features.filter(f => f.properties[idField] == sampleState.selected)[0]
      setChartData(prepareChartData(selected_sample))
    }
  }, [sampleState.selected, sampleState.geojson])


  const handleClose = () => setChartModalShow(false)
  const handleShow = () => setChartModalShow(true)

  const handleSelect = (eventKey, e) => {
    let csv = ""
    if (eventKey === "one") {
      csv = chartData.map(e => {
        return e.join(",")
      }).join("\n")
    } else {
      
      let positiveSamples = sampleState.geojson.features.filter(v => {
        return v.properties[sampleState.classProperty.name] === sampleState.classProperty.positiveValue
      })

      let curveData = {}

      positiveSamples.forEach(sample => {
        Object.entries(sample.properties).forEach(([key, val]) => {
          if (key.endsWith('_feature')) {
            let words = key.split('_')
            let date = new Date(Number.parseInt(words[words.length - 2])).getTime()
            if (curveData[date] === undefined) {
              curveData[date] = []
            }
            curveData[date].push(val === 99999 ? null : val)

          }
        })
      })

      csv = Object.entries(curveData).sort((a, b) => a[0] - b[0]).map(([d, v]) => {
        return new Date(Number.parseInt(d)) + "," + v.join(",") 
      }).join("\n")
      
    }

    let file = new Blob([csv], {type: 'text/csv;charset=utf-8'})
    saveAs(file, 'phenology.csv')
  }

  return (
    <Fragment>
      <Card className="h-100 w-100">
        <Card.Body className="p-2">
          <ChartArea chartData={chartData}/>

          <div className="position-absolute bottom-0 end-0 d-flex justify-content-end mb-1">
            
            <DropdownButton 
              size="sm" 
              title="Download..." 
              onSelect={handleSelect}
            >
              <Dropdown.Item eventKey={"one"} disabled={!!!chartData}>
                Phenology of the selected sample
              </Dropdown.Item>
              <Dropdown.Item eventKey={"all"}>
                Phenology of all {sampleState.classProperty.positiveValue} samples
              </Dropdown.Item>
            </DropdownButton>

            <Button size="sm" variant="secondary" onClick={handleShow}>
              <ArrowsFullscreen size={11}/>
            </Button>
          </div>

        </Card.Body>
      </Card>

      <Modal 
        fullscreen
        show={chartModalShow} 
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Phenology Chart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ChartArea chartData={chartData} />
        </Modal.Body>
      </Modal>
    </Fragment>
    
  )
}

const ChartArea = ({chartData}) => {

  // const [chartData, setChartData] = useState(null);

  return (
    chartData ?
        <Chart 
          width="100%" 
          height="90%" 
          chartType="LineChart" 
          loader={<div>Loading Chart...</div>} 
          data={chartData}
          options={{
            hAxis: {
              title: 'Date',
              format: "yyyy-MM-dd"
            },
            vAxis: {
              title: 'Value',
            },
            legend: {
              position: 'bottom'
            },
            pointSize: 3,
          }}
          rootProps={{ 'data-testid': '1' }}
          legendToggle
          
        />
    :
    "Select a sample to show its phenology."
  )
}