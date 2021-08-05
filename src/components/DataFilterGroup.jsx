import { useContext } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import EmpiricalFormContext from "../context/EmpiricalFormContext";

import { dataList, featureList, districtList } from "../utils/constants"



export function DataFilterGroup(props) {
  // const ctx = useContext(EmpiricalFormContext);
  let { disabled, filters, dispatch } = props

  const handleChange = (type, value) => {
    dispatch({ type: type, value: value });
  };

  const handleDataChange = (e) => {
    handleChange("name", e.target.value)
    handleChange("cloud", "10")
    if (e.target.value in featureList.radar) {
      handleChange("feature", featureList.radar.VH)
    } else {
      handleChange("feature", featureList.optical.NDVI)
    }
    
  }

  return (
    <Card className="mb-2 border-secondary">
      <Card.Body>
        <fieldset disabled={disabled}>
        <Form.Group
          as={Row}
          controlId={"dataset_name"}
          className="mb-2 align-items-center"
        >
          <Form.Label column xs={4}>
            Dataset
          </Form.Label>
          <Col xs={8}>
            <Form.Select
              onChange={handleDataChange}
              value={filters["name"]}
            >
              {Object.entries(dataList).map(([key, value]) => (
                <optgroup key={key} label={key}>
                  {Object.entries(value).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </optgroup>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        {filters["name"] in dataList.optical ? (
          <Form.Group
            as={Row}
            controlId={"dataset_cloud"}
            className="align-items-center mb-2"
          >
            <Form.Label column xs="auto">
              Cloud cover (%)
            </Form.Label>
            <Col>
              <Form.Control
                type="number"
                min="0"
                max="100"
                step="1"
                value={filters["cloud"]}
                onChange={(e) => handleChange("cloud", e.target.value)}
              />
            </Col>
          </Form.Group>
        ) : null}

        <Form.Group as={Row} controlId={"dataset_feature"} className="mb-2">
          <Form.Label column xs={4}>
            Feature
          </Form.Label>
          <Col xs={8}>
            <Form.Select
              onChange={(e) => handleChange("feature", e.target.value)}
              value={filters["feature"]}
            >
              {/* {Object.entries(featureList).map(([key, value]) => (
                
                <option value={key}>{value}</option>
              ))} */}
              {filters['name'] in dataList.radar ? 
                Object.entries(featureList.radar).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))
              :
              Object.entries(featureList.optical).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))
              }
            </Form.Select>
          </Col>
        </Form.Group>
        
        {filters['composite'] !== undefined ? 
          <Form.Group as={Row} controlId={"dataset_composite"} className="mb-2">
            <Form.Label column xs={4}>
              Composite
            </Form.Label>
            <Col xs={8}>
              <Form.Select
                onChange={(e) => handleChange("composite", e.target.value)}
                value={filters["composite"]}
              >
                {['minimum', 'maximum', 'median', 'mean', 'mode'].map(type => (
                  <option value={type} key={type}>{type}</option>
                ))
                }
              </Form.Select>
            </Col>
          </Form.Group>
          :
          null
        }

        <Form.Group as={Row} controlId={"dataset_orbit"} className="mb-2">
          <Form.Label column xs={4}>
            Orbit
          </Form.Label>
          <Col xs={8}>
            <Form.Check
              type="checkbox"
              id={"desc"}
              name={"desc"}
              label="Descending"
              checked={filters["desc"]}
              onChange={(e) => handleChange("desc", e.target.checked)}
            />
            <Form.Check
              type="checkbox"
              id={"ascd"}
              name={"ascd"}
              label="Ascending"
              checked={filters["ascd"]}
              onChange={(e) => handleChange("ascd", e.target.checked)}
            />
          </Col>
        </Form.Group>
        
        <Form.Group
          as={Row}
          controlId={"dataset_boundary"}
          className="mb-2 align-items-center"
        >
          <Form.Label column xs={4}>
            Boundary
          </Form.Label>
          <Col xs={8}>
            <Form.Select
              onChange={(e) => handleChange("boundary", e.target.value)}
              value={filters["boundary"]}
            >
              {Object.entries(districtList).map(([key, value]) => (
                <option value={key} key={key}>{value}</option>
              ))
              }
            </Form.Select>
          </Col>
        </Form.Group>
        
        {filters['boundary'] === "upload" ? 
          <Form.Group as={Row} controlId={"dataset_boundary_file"} className="align-items-center">
            <Form.Label column xs={4}>Boundary file <span style={{color: "red"}}>*</span></Form.Label>
            <Col xs={8}>
              <Form.Control type="file" className="w-100 form-control" required name="boundary_file" onChange={e => handleChange("boundary_file", e.target.files[0])}/>
            </Col>
          </Form.Group>
          :
          null
        }
        </fieldset>
      </Card.Body>
    </Card>
  );
}

export default DataFilterGroup;
