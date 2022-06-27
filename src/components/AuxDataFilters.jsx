import { Card, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { dataList, featureList, districtList } from "../utils/constants";
import { update, changeDataSource } from "../features/datasetSlice";

export const AuxDataFilters = (props) => {

  const datasetFilters = useSelector((state) => state.dataset);
  const dispatch = useDispatch();

  const handleChange = (field, value) => {
    dispatch(update({ [field]: value }));
  };

  return (
    <Card className="mb-2 border-secondary">
      <Card.Header>
        <h6 className="m-0 p-0">
          Auxiliary Datasets
        </h6>
      </Card.Header>
      <Card.Body>
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
              value={datasetFilters["boundary"]}
            >
              {Object.entries(districtList).map(([key, value]) => (
                <option value={key} key={key}>
                  {value}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        {datasetFilters["boundary"] === "upload" ? (
          <Form.Group
            as={Row}
            controlId={"dataset_boundary_file"}
            className="align-items-center mb-2"
          >
            <Form.Label column xs={4}>
              Boundary file <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Col xs={8}>
              <Form.Control
                type="file"
                className="w-100 form-control"
                required
                name="boundary_file"
                onChange={(e) =>
                  handleChange(
                    "boundary_file",
                    URL.createObjectURL(e.target.files[0])
                  )
                }
              />
            </Col>
          </Form.Group>
        ) : null}

        <Form.Group
          as={Row}
          controlId={"use_cropmask"}
          className="align-items-center"
        >
          <Form.Label column xs={4}>
            Crop Mask 
          </Form.Label>
          <Col xs={8}>
            <Form.Check 
              type="checkbox" 
              label="" 
              checked={datasetFilters["use_crop_mask"]}
              onChange={(e) => handleChange("use_crop_mask", e.target.checked)}
            />
          </Col>

        </Form.Group>
        
        {datasetFilters["use_crop_mask"] ? (
          <Form.Group
            as={Row}
            controlId={"dataset_cropmask"}
            className="mb-2 align-items-center"
          >
            <Form.Label column xs={4}>
              (GEE asset)
            </Form.Label>
            <Col xs={8}>
              <Form.Control
                type={"text"}
                onChange={(e) => handleChange("crop_mask", e.target.value)}
                value={datasetFilters["crop_mask"]}
              />
            </Col>
          </Form.Group>
        ) : null
        }
        
      </Card.Body>
    </Card>
  )
}
