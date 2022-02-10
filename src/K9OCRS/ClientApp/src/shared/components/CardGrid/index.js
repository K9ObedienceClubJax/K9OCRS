import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Card, Row, Col, Spinner } from 'reactstrap';
import CustomPagination from '../Pagination';

import './style.scss';

const CardGrid = props => {
  const {
    loading,
    errored,
    itemsPerPage,
    items,
    keyName,
    emptyStateComponent,
    clickable
  } = props;

  const [page, setPage] = useState(1);

  // Calculate the start and end of our paginated subset of items
  const pageStartIndex = (page - 1) * itemsPerPage;
  const pageEndIndex = page * itemsPerPage;

  // Slice the items up to the max amount of items per page
  const visibleItems = items?.slice(pageStartIndex, pageEndIndex);

  return (
    <Container className="cardGrid px-lg-5" fluid>
        { loading && <Spinner className='cardGrid__loader' /> }
        { loading || errored ? null : (
          <Row className="cardGrid__row my-4">
            {
              visibleItems?.length > 0 ? visibleItems.map(item => {
                return (
                  (
                    <Col className="cardGrid__row__col mb-4" sm="12" md="6" lg="4" xl="3" key={item.props[keyName]} >
                      <Card className={`${item.props.className ?? ''} cardGrid__row__col__card${clickable ? '--clickable' : ''} h-100`}>
                        {item}
                      </Card>
                    </Col>
                  )
                );
              }) : emptyStateComponent
            }
          </Row>
        )}
        <div className="cardGrid__pagination-container d-flex justify-content-end">
          <CustomPagination
            className="cardGrind__pagination-container__pagination"
            onPageChange={setPage}
            totalCount={items?.length}
            currentPage={page}
            pageSize={itemsPerPage}
          />
        </div>
      </Container>
  );
};

CardGrid.defaultProps = {
  loading: false,
  errored: false,
  itemsPerPage: 8,
  emptyStateComponent: <p>No items to show.</p>,
  keyName: 'id',
  clickable: false,
};

CardGrid.propTypes = {
  loading: PropTypes.bool,
  errored: PropTypes.bool,
  itemsPerPage: PropTypes.number,
  items: PropTypes.array.isRequired,
  emptyStateComponent: PropTypes.node,
  keyName: PropTypes.string,
  clickable: PropTypes.bool,
};

export default CardGrid;
