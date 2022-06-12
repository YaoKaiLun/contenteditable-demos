import React, { forwardRef } from 'react';
import './index.less';

function MeasureLayer(_, ref) {
  return (
    <div ref={ref} className="measure-layer" />
  );
}

export default forwardRef(MeasureLayer);