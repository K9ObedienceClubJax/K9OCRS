import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Col, Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap';
// import BottomActions from './BottomActions';

import './styles.scss';

function debounce(fn, ms) {
    let timer;
    return (_) => {
        clearTimeout(timer);
        timer = setTimeout((_) => {
            timer = null;
            fn.apply(this, arguments);
        }, ms);
    };
}

const PageHeader = (props) => {
    const { title, breadCrumbItems, alerts, setAlerts, children } = props;

    const cn = 'pageHeader';

    const { pathname: currentPath } = useLocation();

    const handleAlertDismiss = (alertIdx) => {
        // Must make a copy of the alerts array or else
        // React won't re-render the component when we set
        // the new value of alerts
        const alertsCopy = [...alerts];
        // Splice returns the deleted elements
        // so we shouldn't setAlerts to the return value of splice
        alertsCopy.splice(alertIdx, 1);
        setAlerts(alertsCopy);
    };

    const collapseWidth = '(min-width: 992px)';

    const [breakpointHit, setBreakpointHit] = useState(window.matchMedia(collapseWidth).matches);

    useEffect(() => {
        const debouncedHandleResize = debounce(function updateBreakpointHit() {
            setBreakpointHit(window.matchMedia(collapseWidth).matches);
        }, 1000);

        window.addEventListener('resize', debouncedHandleResize);

        return (_) => window.removeEventListener('resize', debouncedHandleResize);
    });

    const childCount = React.Children.count(children);
    const showBottomBar = !breakpointHit && childCount > 0;

    return (
        <>
            {showBottomBar && (
                <div
                    className={`${cn}__action-buttons ${
                        childCount > 3 ? `${cn}__action-buttons--many` : ''
                    } gap-2`}
                >
                    {children}
                </div>
            )}
            <div
                className={`${cn} d-flex flex-column flex-md-row  justify-content-lg-between px-4 px-mb-5`}
            >
                <Col className={`${cn}__left mb-4`} md="8">
                    <h1>{title}</h1>
                    {breadCrumbItems?.length > 0 && (
                        <Breadcrumb className={`${cn}__breadcrumbs`}>
                            {breadCrumbItems?.map((item) => (
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
                    )}
                </Col>
                <Col className={`${cn}__right mb-4`}>
                    {breakpointHit && <div className={`${cn}__action-buttons`}>{children}</div>}
                </Col>
            </div>
            <div className={`${cn}__alerts mb-4 px-4 px-mb-5`}>
                {Array.isArray(alerts) &&
                    alerts.map((a, idx) => (
                        <Alert
                            key={`${a}_${idx}`}
                            color={a.color}
                            toggle={() => handleAlertDismiss(idx)}
                        >
                            {a.message}
                        </Alert>
                    ))}
            </div>
        </>
    );
};

PageHeader.defaultProps = {
    title: '',
    breadCrumbItems: [],
    children: [],
    alerts: [],
    setAlerts: () => {},
};

PageHeader.propTypes = {
    title: PropTypes.string,
    breadCrumbItems: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            path: PropTypes.string,
            active: PropTypes.bool,
        })
    ),
    alerts: PropTypes.arrayOf(
        PropTypes.shape({
            color: PropTypes.string,
            message: PropTypes.string,
        })
    ),
    setAlerts: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default PageHeader;
