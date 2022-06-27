import { Form, Card } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import _ from "lodash";

import { changeOp } from "../../features/seasonSlice";
import SeasonPanel from "../../components/SeasonPanel";


export default function EmpiricalRight() {

  const seasonFilters = useSelector(state => state.seasons)
  const dispatch = useDispatch()


  const handleChangeLogicalOperation = (op) => {
    dispatch(changeOp(op))
  }
  
  return (
    <div className="h-100 d-flex flex-column p-2">
      
      <Card className="mb-2">
        <Card.Body className="d-flex">
          <div className="px-2">
            Aggregate method
          </div>
          <div className="d-flex flex-grow-1 justify-content-around">
            <Form.Check 
              checked={seasonFilters.op === "and"}
              type={"radio"}
              label={"All"}
              onChange={() => handleChangeLogicalOperation("and")}
            />
            <Form.Check
              checked={seasonFilters.op === "or"}
              type={"radio"}
              label={"Any"}
              onChange={() => handleChangeLogicalOperation("or")}
            />
          </div>
        </Card.Body>
      </Card>

      <SeasonPanel />

    </div>
  );
}
