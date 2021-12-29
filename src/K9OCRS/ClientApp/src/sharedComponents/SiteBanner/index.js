import React from 'react';
import PawIcon from "./pawIcon.js";

import './style.scss';

function SiteBanner() {
  return (
    <div className="sitebanner px-5 py-4 mb-5 text-white bg-dark">
      <p className="fs-1 fw-bold">
        K9 Obedience Club <PawIcon className="sitebanner__pawicon" />
      </p>
    </div>
  )
}

export default SiteBanner;

