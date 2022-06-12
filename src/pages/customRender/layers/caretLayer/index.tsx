import React, { useContext, useEffect, useRef } from 'react';
import EditorContext from '../../../context';
import textMeasure from '../../helpers/textMeasure';
import { ISelection } from '../../../types';
import './index.less';

export default function CaretLayer() {
  const { content, selection } = useContext(EditorContext);
  const caretRef = useRef();

  const selectionToCaretPosition = (selection: ISelection) => {
    const str = content.slice(0, selection[0]);
    const { width } = textMeasure.measureStringSize(str);

    return {
      width,
      height: 0,
    }
  };

  useEffect(() => {
    if (!caretRef.current || !selection) {
      return;
    }

    const { width } = selectionToCaretPosition(selection);
    caretRef.current.style.left = width + 'px';
    caretRef.current.style.top = 0 + 'px';
  }, [selection]);

  return (
    <div className="caret-layer">
      <div className="caret" ref={caretRef} />
    </div>
  );
}