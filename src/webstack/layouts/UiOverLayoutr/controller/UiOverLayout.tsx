import React, { useRef, useEffect, useState, ReactElement } from 'react';
import styles from './UiOverLayout.scss';

const UiOverLayout: React.FC<any> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Create a state to hold styles for each child
  const [childStyles, setChildStyles] = useState<{[key: string]: React.CSSProperties}>({});

  useEffect(() => {
    if (ref.current) {
      const childElements = Array.from(ref.current.children);
      const styles = childElements.reduce((acc:any, child:any) => {
        const id = child.id || child.textContent;  // Fallback to textContent if no ID
        acc[id] = {
          position: 'absolute',
          top: child.getAttribute('data-top') || 'auto',
          right: child.getAttribute('data-right') || 'auto',
          bottom: child.getAttribute('data-bottom') || 'auto',
          left: child.getAttribute('data-left') || 'auto'
        };
        return acc;
      }, {} as {[key: string]: React.CSSProperties});
      setChildStyles(styles);
    }
  }, [children]);  // Dependency array includes children to re-run on children update

  // Function to clone children with added styles
  const renderStyledChildren = () => {
    return React.Children.map(children, child => 
      React.cloneElement(child as ReactElement, {
        style: {
          ...childStyles[child?.props?.children?.toString() || 'default'], 
          ...child.props.style
        }
      })
    );
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className="over-layout" ref={ref}>
        {renderStyledChildren()}
      </div>
    </>
  );
};

export default UiOverLayout;
