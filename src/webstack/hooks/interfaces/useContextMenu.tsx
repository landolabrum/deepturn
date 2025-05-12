// useContextMenu.js
import React, { useState, useCallback, JSXElementConstructor, useEffect } from 'react';
import useMouse from './useMouse/useMouse';
interface IuseContextMenu{
  content: React.ReactElement<any, string | JSXElementConstructor<any>> | null,
  visible: boolean
}
const useContextMenu = () => {
  const {position} = useMouse();
  const [pos, setPos]=useState({x:0, y: 0});
  const [contextMenu, setContextMenu] = useState<IuseContextMenu>({ content: null, visible: false });

  const openContextMenu = useCallback((content:React.ReactElement<any, string | JSXElementConstructor<any>> ) => {
    setContextMenu({ content, visible: true });
  }, []);
  
  useEffect(() => {
    if(pos.x == 0 && pos.y === 0)setPos(position);
  }, [position]);
  const closeContextMenu = useCallback(() => {
    setContextMenu({ content: null, visible: false });
  }, []);
  const isContextMenuOpen = contextMenu.visible;
  const ContextMenuComponent = contextMenu.visible ? (
    <div
      id='custom-context-menu'
      style={{
        position: 'fixed',
        top: '0', // These should be updated to the mouse position
        left: '0', // These should be updated to the mouse position
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        zIndex: 1000, // Make sure this is above everything else
      }}
    >
      {contextMenu.content}
    </div>
  ) : null;

  return { openContextMenu, closeContextMenu, ContextMenuComponent, isContextMenuOpen };
};

export default useContextMenu;
