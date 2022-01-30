import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Col, Breadcrumb, BreadcrumbItem, UncontrolledAlert } from 'reactstrap';

import './styles.scss';

const PageHeader = props => {
  const {
    title,
    breadCrumbItems,
    alerts,
    children
  } = props;

  const cn = 'pageHeader';

  const { pathname: currentPath } = useLocation();

  return (
    <>
      <div className={`${cn} d-flex flex-column flex-md-row  justify-content-lg-between`}>
        <Col className={`${cn}__left mb-4`} md="8">
          <h1>{title}</h1>
          { breadCrumbItems?.length > 0 &&
            <Breadcrumb className={`${cn}__breadcrumbs`}>
              {breadCrumbItems?.map(item => (
                <BreadcrumbItem
                  key={item.label}
                  tag={Link}
                  to={item.path || currentPath}
                  active={item.active}
                  disabled={item.active}
                >
                  {item.label}
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
          }
        </Col>
        <Col className={`${cn}__right mb-4`}>
          <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
            {children}
          </div>
        </Col>
      </div>
      <div className={`${cn}__alerts mb-4`}>

        { Array.isArray(alerts) && alerts.map((a, idx) => (
          <UncontrolledAlert key={`${a}_${idx}`}  color={a.color}>
            {a.message}
          </UncontrolledAlert>
        ))}
      </div>
    </>
  );
};

PageHeader.defaultProps = {
  breadCrumbItems: [],
  children: [],
  alerts: [],
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
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
      message: PropTypes.string,
    }),
  ),
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
};

export default PageHeader;
