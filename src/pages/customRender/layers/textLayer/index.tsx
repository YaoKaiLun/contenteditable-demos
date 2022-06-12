import React, { useContext } from 'react';
import EditorContext from '../../../context';
import './index.less';

export default function TextLayer() {
  const { content } = useContext(EditorContext);

  return (
    <div className="text-layer">
      {content}
    </div>
  );
}