import React from 'react';
import PawIcon from "./pawIcon.js";

import './style.scss';

function SiteBanner() {
  return (
    <div className="px-5 py-4 mb-5 text-white bg-dark">
      <h1>
        K9 Obedience Club <PawIcon className="sitebanner__pawicon" />
      </h1>
    </div>
  )
}

export default SiteBanner;

