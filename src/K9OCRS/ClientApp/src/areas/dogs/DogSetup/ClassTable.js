import Table from '../../../shared/components/Table'
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';
import ClassDetailColumns from './ClassDetailColumns';
import {useState} from 'react'
import './styles.scss';

const ClassTable = (props) => {

    const [dogDetails, setDogDetails] = useState([]);

    return (
        <div className='ClassTableContainer'>
            <h3 className='ClassTableContainer_Header'>Classes</h3>
            <Row className='ClassTableContainer_HeaderInput'>
                <Col>
                    <FormGroup>
                        <Input
                            id="Dog_Class_Search_Bar"
                            name="search"
                            placeholder="Search"
                            type="search"
                        />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup> 
                        <Label check>
                            <Input className='Show_Past_Classes_Dogs' type="checkbox" />
                            Show Past Classes 
                        </Label>
                    </FormGroup>
                </Col>
            </Row>
            <Table 
                columns={ClassDetailColumns}
                data={dogDetails}
                pageSize={12}
                withPagination
            />
        </div>
    );
};

export default ClassTable;