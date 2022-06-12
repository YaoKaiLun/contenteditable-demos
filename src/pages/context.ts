import React from 'react';
import { ISelection } from './types';

interface IProps {
  content: string,
  setContent: (content: string) => void;
  selection: ISelection | null;
  setSelection: (selection: ISelection | null) => void;
}

const defaultContext = {
  content: '',
  setContent: () => {},
  selection: null,
  setSelection: () => {},
}

const EditorContext = React.createContext<IProps>(defaultContext);

export default EditorContext;