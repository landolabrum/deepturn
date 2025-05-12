import React, { useEffect, useRef, useState } from 'react';
import styles from './UiTextBalance.scss';
import useWindow from '@webstack/hooks/window/useWindow';

interface UiTextBalanceProps {
  text: string;
  animate?: 'keyboard' | string;
}

const UiTextBalance: React.FC<UiTextBalanceProps> = ({ text, animate = 'keyboard' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scales, setScales] = useState<number[]>([]);
  const [displayedText, setDisplayedText] = useState<string>('');
  const { width } = useWindow();

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const words = text.split(' ');
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      const newScales: number[] = [];
      const testDiv = document.createElement('div');
      testDiv.style.position = 'absolute';
      testDiv.style.visibility = 'hidden';
      testDiv.style.whiteSpace = 'nowrap';
      testDiv.style.fontWeight = 'bold';
      testDiv.style.textTransform = 'uppercase';
      document.body.appendChild(testDiv);

      words.forEach((word) => {
        let fontSize = 10;
        testDiv.style.fontSize = `${fontSize}px`;
        testDiv.innerText = word;

        while (
          testDiv.offsetWidth < containerWidth * 0.9 &&
          testDiv.offsetHeight < containerHeight / words.length 
        ) {
          fontSize += 1;
          testDiv.style.fontSize = `${fontSize}px`;
        }

        fontSize -= 1;
        newScales.push(fontSize);
      });

      setScales(newScales);
      document.body.removeChild(testDiv);
    }
  }, [text, width]);

  useEffect(() => {
    if (animate === 'keyboard') {
      setDisplayedText('');
      let currentIndex = 0;
      const typingInterval = setInterval(() => {

        setDisplayedText((prev) => prev + text.charAt(currentIndex - 1));
        currentIndex++;
        if (currentIndex === text.length) {
          clearInterval(typingInterval);
        }
      }, 50);
      return () => clearInterval(typingInterval);
    } else {
      setDisplayedText(text);
    }
  }, [text]);

  return (
    <>
      <style jsx>{styles}</style>
      <div ref={containerRef} className="ui-text-balance">
        <div className="ui-text-balance__content">
          {displayedText.split(' ').map((word, index) => (
            <div
              key={index}
              className="ui-text-balance__text"
              style={{
                fontSize: scales[index] ? `${scales[index]}px` : '10px',
              }}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UiTextBalance;
