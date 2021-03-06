import React, { useState, useEffect } from 'react';
import EditorContext from '../context';
import Editable from './editable';
import { ISelection } from '../types';
import './index.less';

export default function CustomRenderPage() {
  const [content, setContent] = useState('hello world!');
  const [selection, setSelection] = useState<ISelection | null>([0, 0]);

  useEffect(() => {
    document.title = 'CustomRender';
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
        <h1>CustomRender</h1>
        <Editable />
      </div>
    </EditorContext.Provider>
  );
}