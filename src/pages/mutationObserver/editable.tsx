import React, { useCallback, useRef, useMemo, useContext, useLayoutEffect, useEffect } from 'react';
import EditorContext from '../context';
import { useMutationObserver } from './use-mutation-observer';
import { debounce, throttle } from 'lodash';
import { IDiff } from '../types';
import './index.less';

export default function Editable() {
  const ref = useRef<HTMLDivElement>(null);
  const { content, setContent, selection, setSelection } = useContext(EditorContext);

  const callback = useCallback((newContent: string, diff: IDiff) => {
    setContent(newContent);

    if (diff) {
      console.log('diff', diff);

      let offset = newContent.length;

      if (diff.insertText.length > 0) {
        offset = diff.start + 1;
      } else if (diff && diff.removeText.length > 0) {
        offset = diff.start;
      }

      setSelection([offset, offset]);
    }
  }, []);

  useMutationObserver(ref, callback);

  const onDOMSelectionChange = useCallback(throttle(() => {
    const domSelection = document.getSelection();
    // console.log('onDOMSelectionChange', domSelection);

    if (!domSelection) {
      setSelection(null);
      return;
    }

    const { anchorOffset, focusOffset, isCollapsed } = domSelection;

    if (isCollapsed) {
      setSelection([anchorOffset, anchorOffset]);
      return;
    } else {
      setSelection([anchorOffset, focusOffset]);
    }

  }, 100), []);

  const scheduleOnDOMSelectionChange = useMemo(
    () => debounce(onDOMSelectionChange, 0),
    [onDOMSelectionChange]
  )

  useLayoutEffect(() => {
    window.document.addEventListener('selectionchange', scheduleOnDOMSelectionChange);

    return () => {
      window.document.removeEventListener('selectionchange', scheduleOnDOMSelectionChange);
    }
  }, [scheduleOnDOMSelectionChange])

  useEffect(() => {
    var sel = window.getSelection()
    if (selection && sel) {
      if (sel) {
        const { anchorOffset, focusOffset } = sel;
        if (anchorOffset === selection[0] && focusOffset === selection[1]) {
          return;
        }
      }

      try {
        const textNode = ref.current.childNodes[0];
        var range = document.createRange();
        range.setStart(textNode, selection[0]);
        range.setEnd(textNode, selection[1]);
        range.collapse(true)
        sel.removeAllRanges();
        sel.addRange(range); 
      } catch (error) {
        console.log('addRange fail', error);
      }
    }
  }, [selection]);

  return (
    <div
      className="editor"
      contentEditable={true}
      ref={ref}
      suppressContentEditableWarning={true}
    >
      {content}
    </div>
  );
}