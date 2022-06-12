export type ISelection = [number, number];

export type IDiff = {
  start: number;
  end: number;
  insertText: string;
  removeText: string;
}