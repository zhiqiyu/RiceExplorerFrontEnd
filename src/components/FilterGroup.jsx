import { useState } from "react"
import { Card, Col, Form, Row } from "react-bootstrap"

export function FilterGroup(props) {
  const { name } = props 

  const [checked, setChecked] = useState(true)

  const handleSwitch = (e) => {
    setChecked(!checked)
  }

  return (
    <Card className="mb-2">
      <Row className="align-items-center gx-2 m-0 card-header">
        <Col xs="auto">
          {/* <input type="checkbox" id="sowing_switch" value="" checked /> */}
          <Form.Check type="switch" id={`${name}_switch`} aria-label={name} checked={checked} onChange={handleSwitch}/>
        </Col>
        <Col xs="auto">
          <h5 class="m-0">{name}</h5>
        </Col>
      </Row>
      <fieldset id="sowing_fields" disabled={!checked}>
        <div class="card-body">
          <div class="row gx-3 mb-2 align-items-center">
            <div class="col-sm-4">
              <label for="sowing_start" class="col-form-label">Start date</label>
            </div>
            <div class="col-sm-8">
              <input type="date" id="sowing_start" class="form-control" name="sowing_start" />
            </div>
          </div>
          <div class="row gx-3 mb-2 align-items-center">
            <div class="col-sm-4"> 
              <label for="sowing_end" class="col-form-label">End date</label>
            </div>
            <div class="col-sm-8">
              <input type="date" id="sowing_end" class="form-control" name="sowing_end" />
            </div>
          </div>
          <div class="row gx-3 mb-2 align-items-center">
            <div class="col-sm-4">
              Orbit
            </div>
            <div class="col-sm-4">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="sowing_ascd" name="sowing_ascd" />
                <label class="form-check-label" for="sowing_ascd">
                  Ascending
                </label>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="sowing_desc" name="sowing_desc" checked />
                <label class="form-check-label" for="sowing_desc">
                  Descending
                </label>
              </div>
            </div>
          </div>
          <div class="row gx-3 align-items-center">
            <div class="col-sm-4">
              <label for="sowing_thres" class="col-form-label">Threshold</label>
            </div>
            <div class="col-sm-8">
              <div class="row gx-1 align-items-center">
                <div class="col">
                  <input type="number" class="form-control" step="0.01" placeholder="min" name="sowing_min" />
                </div>
                <div class="col-auto">-</div>
                <div class="col">
                  <input type="number" class="form-control" step="0.01" placeholder="max" name="sowing_max" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    </Card>
  )
}