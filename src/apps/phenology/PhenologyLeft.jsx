import { Form } from "react-bootstrap";
import { SatelliteDataFilters, AuxDataFilters } from "../../components/DataFilterGroup";
import { useState } from "react";
import _ from "lodash"




export default function PhenologyLeft(props) {

  const [validated, setValidated] = useState(false)

  
  return (
    <div className="h-100 flex-column p-2">
    
      <Form method="POST" noValidate validated={validated} >
        <SatelliteDataFilters />
        {/* <AuxDataFilters /> */}

        {/* <DateRangeFilters /> */}
      

      </Form>

    </div>
  )
}