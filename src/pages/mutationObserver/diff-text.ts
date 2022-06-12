import { IDiff } from '../types';

type TextRange = {
  start: number
  end: number
}

export function diffText(prev?: string, next?: string): IDiff | null {
  if (prev === undefined || next === undefined) return null
  const offsets = getDiffOffsets(prev, next)
  if (offsets == null) return null
  const insertText = sliceText(next, offsets)
  const removeText = sliceText(prev, offsets)
  return {
    start: offsets.start,
    end: prev.length - offsets.end,
    insertText,
    removeText,
  }
}

function getDiffOffsets(prev: string, next: string): TextRange | null {
  if (prev === next) return null
  const start = getDiffStart(prev, next)
  if (start === null) return null
  const maxEnd = Math.min(prev.length - start, next.length - start)
  const end = getDiffEnd(prev, next, maxEnd)!
  if (end === null) return null
  return { start, end }
}

function getDiffStart(prev: string, next: string): number | null {
  const length = Math.min(prev.length, next.length)

  for (let i = 0; i < length; i++) {
    if (prev.charAt(i) !== next.charAt(i)) return i
  }

  if (prev.length !== next.length) return length
  return null
}

function getDiffEnd(prev: string, next: string, max: number): number | null {
  const prevLength = prev.length
  const nextLength = next.length
  const length = Math.min(prevLength, nextLength, max)

  for (let i = 0; i < length; i++) {
    const prevChar = prev.charAt(prevLength - i - 1)
    const nextChar = next.charAt(nextLength - i - 1)
    if (prevChar !== nextChar) return i
  }

  if (prev.length !== next.length) return length
  return null
}

function sliceText(text: string, offsets: TextRange): string {
  return text.slice(offsets.start, text.length - offsets.end)
}