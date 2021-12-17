import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap';

const PageHeader = props => {
  const {
    title,
    breadCrumbItems,
    children
  } = props;

  const cn = 'pageHeader';

  return (
    <div className={`${cn} d-flex flex-column flex-xl-row  justify-content-xl-between`}>
      <Col className={`${cn}__left`}>
        <h1>{title}</h1>
        { breadCrumbItems?.length > 0 &&
          <Breadcrumb>
            {breadCrumbItems?.map(item => (
              <BreadcrumbItem
                key={item.label}
                tag="a"
                href={item.path}
                active={item.active}
              >
                {item.label}
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        }
      </Col>
      <Col className={`${cn}__right`}>
        <Row xl="4" lg="3" className="justify-content-end">
          {children}
        </Row>
      </Col>
    </div>
  );
};

PageHeader.defaultProps = {
  breadCrumbItems: [],
  children: [],
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  breadCrumbItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      path: PropTypes.string,
      active: PropTypes.bool,
    }),
  ),
  children: PropTypes.array,
};

export default PageHeader;
