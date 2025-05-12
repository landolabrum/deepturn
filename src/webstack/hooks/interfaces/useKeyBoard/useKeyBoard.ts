import { useState, useEffect, useCallback } from 'react';

interface IKeyBoard {
  keyPressed?: string[] | string;
  onKeyPress?: (event: KeyboardEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
}

const useKeyBoard = ({ onKeyPress, onKeyDown, onKeyUp }: IKeyBoard = {}) => {
  const [keyPressed, setKeyPressed] = useState<Set<string>>(new Set());
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    setKeyPressed((prevKeys) => new Set(prevKeys).add(event.key));
    setLastKeyPressed(event.key);
    if (onKeyDown) {
      onKeyDown(event);
    }
  }, [onKeyDown]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    setKeyPressed((prevKeys) => {
      const newKeys = new Set(prevKeys);
      newKeys.delete(event.key);
      return newKeys;
    });
    if (onKeyUp) {
      onKeyUp(event);
    }
  }, [onKeyUp]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (onKeyPress) {
      onKeyPress(event);
    }
  }, [onKeyPress]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleKeyDown, handleKeyUp, handleKeyPress]);

  return { keyPressed: Array.from(keyPressed), lastKeyPressed };
};

export default useKeyBoard;