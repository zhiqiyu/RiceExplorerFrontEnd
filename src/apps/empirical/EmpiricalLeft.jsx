import { useState } from "react"
import { Form } from "react-bootstrap"
import _ from "lodash";
import { SatelliteDataFilters, AuxDataFilters } from "../../components/DataFilterGroup";


export const EmpiricalLeft = (props) => {


  // local state
  const [validated, setValidated] = useState(false)
  // const [success, setSuccess] = useState(undefined); // undefined - normal; false - invalid; true - 


  return (
    <div className="sidebar h-100 flex-column p-2">
      <Form method="POST" noValidate validated={validated}>
        
        <fieldset >
          <SatelliteDataFilters />
          {/* {appName === "empirical" && <AuxDataFilters />} */}
          <AuxDataFilters />
        </fieldset>
                
      </Form>
    </div>
  )
}