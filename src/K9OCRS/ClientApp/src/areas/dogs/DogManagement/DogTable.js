import Table from '../../../shared/components/Table'
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';
import DogDetailColumns from './DogDetailColumns';
import {useState} from 'react'
import './styles.scss';

const DogTable = (props) => {

    const [dogDetails] = useState([]);

    return (
            <Table 
                columns={DogDetailColumns}
                data={dogDetails}
                pageSize={12}
                withPagination
            />
    );
};

export default DogTable;