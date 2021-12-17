import React from 'react';
import PropTypes from 'prop-types';
import { Col, Breadcrumb, BreadcrumbItem } from 'reactstrap';

import './styles.scss';

const PageHeader = props => {
  const {
    title,
    breadCrumbItems,
    children
  } = props;

  const cn = 'pageHeader';

  return (
    <div className={`${cn} d-flex flex-column flex-xl-row  justify-content-xl-between mb-4`}>
      <Col className={`${cn}__left mb-4`}>
        <h1>{title}</h1>
        { breadCrumbItems?.length > 0 &&
          <Breadcrumb className={`${cn}__breadcrumbs`}>
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
      <Col className={`${cn}__right mb-4`}>
        <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
          {children}
        </div>
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
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
};

export default PageHeader;
