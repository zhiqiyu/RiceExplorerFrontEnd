import React from "react";
import { Card, Col, Form, Row } from "react-bootstrap";

import PropTypes from "prop-types";
import { useContext } from "react";
import EmpiricalFormContext from "../context/EmpiricalFormContext";
import { useCallback } from "react";


export const SeasonFilterGroup = (props) => {
  const { name, inputThres, readOnly, filters, dispatch } = props;

  // const ctx = useContext(EmpiricalFormContext);
  // let { filters, dispatch } = ctx[name]

  const handleChange = useCallback(
    (type, value) => {
      dispatch({
        type: type,
        value: value,
      });
    },
    [dispatch]
  );

  return (
    <Card className="mb-2 border-secondary">
      <Row className="align-items-center gx-2 m-0 card-header">
        <Col xs="auto">
          <Form.Check
            type="switch"
            id={`${name}_switch`}
            aria-label={name}
            checked={filters.on}
            onChange={(e) => handleChange("on", e.target.checked)}
          />
        </Col>
        <Col xs="auto">
          <h6 className="m-0">{name.charAt(0).toUpperCase() + name.slice(1)}</h6>
        </Col>
      </Row>
      <fieldset id={`${name}_fields`} disabled={!filters.on}>
        <Card.Body>
          <Form.Group
            as={Row}
            className="mb-2"
            controlId={`${name}_start_fields`}
          >
            <Form.Label column sm={4}>
              Start date <span style={{color: "red"}}>*</span>
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="date"
                required
                readOnly={readOnly}
                name={`${name}_start`}
                value={filters.start}
                onChange={(e) => handleChange("start", e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-2"
            controlId={`${name}_end_fields`}
          >
            <Form.Label column sm={4}>
              End date <span style={{color: "red"}}>*</span>
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="date"
                required
                readOnly={readOnly}
                name={`${name}_end`}
                value={filters.end}
                onChange={(e) => handleChange("end", e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className="mb-2"
            // controlId={`${name}_threshold_fields`}
          >
            <Form.Label column sm={4}>
              Threshold {inputThres ? <span style={{color: "red"}}>*</span> : null}
            </Form.Label>
            <Col sm={8}>
              <Row className="gx-1 align-items-center">
                <Col>
                  <Form.Control
                    type="number"
                    required={inputThres}
                    readOnly={!inputThres || readOnly}
                    id={`${name}_min`}
                    placeholder="min"
                    step="0.01"
                    name={`${name}_min`}
                    value={filters.min}
                    onChange={(e) => handleChange("min", e.target.value)}
                  />
                </Col>
                <Col sm="auto">{"≤ x ≤"}</Col>
                <Col>
                  <Form.Control
                    type="number"
                    required={inputThres}
                    readOnly={!inputThres || readOnly}
                    id={`${name}_max`}
                    placeholder="max"
                    step="0.01"
                    name={`${name}_max`}
                    value={filters.max}
                    onChange={(e) => handleChange("max", e.target.value)}
                  />
                </Col>
              </Row>
            </Col>
          </Form.Group>
        </Card.Body>
      </fieldset>
    </Card>
  );
}

SeasonFilterGroup.propTypes = {
  name: PropTypes.string.isRequired,
  inputThres: PropTypes.bool.isRequired,
};
