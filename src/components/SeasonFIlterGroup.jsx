import React, { useState } from "react";
import { Button, Card, Col, Form, Row, ToggleButton } from "react-bootstrap";

import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { addSeason, deleteSeason, modifySeason, changeSeasonName } from "../features/seasonSlice";

import _ from "lodash"
import { PencilSquare } from "react-bootstrap-icons";

export const SeasonFilterGroup = (props) => {
  const { idx, inputThres, readOnly } = props;
  
  // use state and actions from redux
  const seasonFilter = useSelector(state => state.seasons.seasons[idx])
  const dispatch = useDispatch()
  // const action = actions[name]

  const [name, setName] = useState(seasonFilter.name)
  const [editing, setEditing] = useState(false)

  const handleChange = (field, value) => {
    dispatch(modifySeason({
      name: seasonFilter.name, 
      [field]: value
    }))
  }

  const handleDeleteSeason = (e) => {
    dispatch(deleteSeason(seasonFilter.name))
  }

  const handleClickEdit = (e) => {
    if (editing) {
      // if it is currently in editing mode, clicking button again would 
      // confirm editing and save the edited name
      dispatch(changeSeasonName({
        oldName: seasonFilter.name, 
        newName: name,
      }))
    }
    setEditing(!editing)
  }

  const handleEditingName = (e) => {
    setName(e.target.value)
  }

  return (
    <Card className="mb-2 border-secondary">
      <Row className="align-items-center gx-2 m-0 card-header">
        <Col xs="auto">
          
          <ToggleButton 
            size="sm" 
            type="checkbox"
            checked={editing}
            variant="outline-secondary" 
            onClick={handleClickEdit}
          >
            <PencilSquare />
          </ToggleButton>
        </Col>
        <Col >
          {editing ? 
            <Form.Control
              plaintext={!editing}
              readOnly={!editing}
              onChange={handleEditingName}
              defaultValue={name}
            /> :
            <h6 className={"mb-0"}>{name}</h6>
          }
        </Col>
        <Col xs="auto">
          <Button size="sm" variant="danger" onClick={handleDeleteSeason}>
            X
          </Button>
        </Col>
      </Row>
      {/* <div className="position-absolute end-0">
          <Button size="sm">
            X
          </Button>
        </div> */}
      <fieldset id={`${seasonFilter.name}_fields`}>
        <Card.Body>
          <Form.Group
            as={Row}
            className="mb-2"
            controlId={`${seasonFilter.name}_start_fields`}
          >
            <Form.Label column sm={4}>
              Start date <span style={{color: "red"}}>*</span>
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="date"
                required
                name={`${seasonFilter.name}_start`}
                value={seasonFilter.start}
                onChange={(e) => handleChange("start", e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-2"
            controlId={`${seasonFilter.name}_end_fields`}
          >
            <Form.Label column sm={4}>
              End date <span style={{color: "red"}}>*</span>
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="date"
                required
                name={`${seasonFilter.name}_end`}
                value={seasonFilter.end}
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
                    id={`${seasonFilter.name}_min`}
                    placeholder="min"
                    step="0.01"
                    name={`${seasonFilter.name}_min`}
                    value={seasonFilter.min}
                    onChange={(e) => handleChange("min", e.target.value)}
                  />
                </Col>
                <Col sm="auto">{"≤ x ≤"}</Col>
                <Col>
                  <Form.Control
                    type="number"
                    required={inputThres}
                    readOnly={!inputThres || readOnly}
                    id={`${seasonFilter.name}_max`}
                    placeholder="max"
                    step="0.01"
                    name={`${seasonFilter.name}_max`}
                    value={seasonFilter.max}
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
