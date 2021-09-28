import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import NavBar from 'components/NavBar';
import * as actions from '../modules/actions';

import './style.scss';

const Layout = props => {
  const {
    children,
  } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.initialize());
  }, []);

  return (
    <div className="k9ocrs-layout">
      <NavBar />
      <div className="k9ocrs-layout__container">
        {children}
      </div>
    </div>
  );
};

export default Layout;
