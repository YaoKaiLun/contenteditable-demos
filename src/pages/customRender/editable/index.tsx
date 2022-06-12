import React, { useCallback, useRef, useContext, useEffect } from 'react';
import EditorContext from '../../context';
import MeasureLayer from '../layers/measureLayer';
import TextLayer from '../layers/textLayer';
import CaretLayer from '../layers/caretLayer';
import textMeasure from '../helpers/textMeasure';
import './index.less';

export default function Editable() {
  const { content, setContent, selection, setSelection } = useContext(EditorContext);
  const textViewRef = useRef();
  const textareaRef = useRef();
  const measureRef = useRef();

  useEffect(() => {
    textMeasure.init(measureRef.current);
  }, []);

  const enterEdit = useCallback((event?) => {
    if (!textViewRef.current || !textareaRef.current) {
      return;
    }

    if (event) {
      const textViewRect = textViewRef.current.getBoundingClientRect();
      const clickPosition = {
        x: event.clientX - textViewRect.x,
        y : event.clientY - textViewRect.y,
      };
      const newSelection = textMeasure.screenPositionToSelection(content, clickPosition);
      setSelection(newSelection);
    }

    textareaRef.current.focus();
  }, [content]);

  useEffect(() => {
    enterEdit();
  }, []);

  const handleTextareaInput = useCallback((event) => {
    const value = event.target.value;

    const startOffset = selection[0];
    const newContent = content.slice(0, startOffset) + value + content.slice(startOffset, content.length);
    setContent(newContent);
    setSelection([startOffset + 1, startOffset + 1]);
    event.target.value = '';
   }, [content, selection]);

   const handleTextareaKeydown = useCallback((event) => {
    if (!(event.metaKey || event.ctrlKey || event.altKey) && (event.key === 'Delete' || event.key === 'Backspace')) {
      const startOffset = selection[0];
      const newContent = content.slice(0, startOffset - 1) + content.slice(startOffset, content.length);
      setContent(newContent);
      setSelection([startOffset - 1, startOffset - 1]);
    };
   }, [content, selection]);

  return (
    <div className="editable">
      <div ref={textViewRef} className="text-view" onClick={enterEdit}>
        <MeasureLayer ref={measureRef} />
        <TextLayer />
        <CaretLayer />
      </div>
      <textarea
        ref={textareaRef}
        onInput={handleTextareaInput}
        onKeyDown={handleTextareaKeydown}
      />
    </div>
  );
}