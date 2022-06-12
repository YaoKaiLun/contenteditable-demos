import React, { useRef, useCallback, useLayoutEffect, useContext, useMemo, useEffect } from 'react';
import EditorContext from '../context';
import { debounce, throttle } from 'lodash';
import './index.less';

export default function Editable() {
  const ref = useRef<HTMLDivElement>(null);
  const { content, setContent, selection, setSelection } = useContext(EditorContext);

  const onDOMBeforeInput = useCallback((event: InputEvent) => {
    const { inputType } = event;
    const data = (event as any).dataTransfer || event.data || undefined;

    if (!selection) {
      return;
    }

    if (inputType === 'insertCompositionText') {
      return
    }

    event.preventDefault();

    switch (inputType) {
      case 'deleteContentBackward': {
        const startOffset = selection[0];
        const newContent = content.slice(0, startOffset - 1) + content.slice(startOffset, content.length);
        setContent(newContent);
        setSelection([startOffset - 1, startOffset - 1]);
        break
      }

      case 'insertText': {
        const startOffset = selection[0];
        const newContent = content.slice(0, startOffset) + data + content.slice(startOffset, content.length);
        setContent(newContent);
        setSelection([startOffset + 1, startOffset + 1]);
      }
    }
  }, [content, selection]);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('beforeinput', onDOMBeforeInput);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('beforeinput', onDOMBeforeInput);
      }
    }
  }, [onDOMBeforeInput]);

  const onDOMSelectionChange = useCallback(throttle(() => {
      const domSelection = document.getSelection();

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

    }, 100),
    []
  );

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