import React, { useEffect, useState } from 'react';
import Editable from './editable';
import EditorContext from '../context';
import { ISelection } from '../types';
import './index.less';

export default function MutationObserverPage() {
  const [content, setContent] = useState('hello world!');
  const [selection, setSelection] = useState<ISelection | null>([0, 0]);

  useEffect(() => {
    document.title = 'MutationObserver';
  });

  const contextValue = {
    content,
    setContent,
    selection,
    setSelection,
  };

  return (
    <EditorContext.Provider value={contextValue}>
      <div>
        <h1>MutationObserver</h1>
        <Editable />
      </div>
    </EditorContext.Provider>
  );
}