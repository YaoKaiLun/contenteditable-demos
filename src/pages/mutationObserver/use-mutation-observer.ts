import { RefObject, useEffect, useLayoutEffect, useState } from 'react';
import { diffText } from './diff-text';

const MUTATION_OBSERVER_CONFIG: MutationObserverInit = {
  childList: true,
  characterData: true,
  characterDataOldValue: true,
  subtree: true,
};

export function useMutationObserver(node: RefObject<HTMLElement>, callback) {
  const [mutationObserver] = useState(() => new MutationObserver((mutations: MutationRecord[]) => {
    let newContent = '';
    mutations.forEach(mutation => {
      switch (mutation.type) {
        case 'characterData': {
          // console.log('mutation', mutation);
          const target = mutation.target;
          const oldValue = mutation.oldValue;
          newContent = target.textContent;
          const diff = diffText(oldValue, newContent);
          callback(newContent, diff);
          break;
        }
      }
    });
    callback(newContent);
  }));

  useLayoutEffect(() => {
    mutationObserver.disconnect();
  })

  useEffect(() => {
    if (!node.current) {
      throw new Error('Failed to attach MutationObserver, `node` is undefined');
    }

    mutationObserver.observe(node.current, MUTATION_OBSERVER_CONFIG);

    return mutationObserver.disconnect.bind(mutationObserver);
  })
}
