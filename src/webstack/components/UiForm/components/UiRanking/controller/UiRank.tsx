import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './UiRank.scss';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';

export interface IUiRankItem {
  id: string;
  name: string;
  score: number;
  placement: number;        // 1-based
  children?: React.ReactNode;
}

type DragInfo = {
  id: string;
  fromIndex: number;
  overIndex: number;
  pointer: { x: number; y: number };
};

type ReorderMeta = {
  id: string;
  fromIndex: number;
  toIndex: number;
  changed: boolean;
};

export interface IUiRankProps {
  items: IUiRankItem[];
  onReorder?: (items: IUiRankItem[], meta: ReorderMeta) => void;
  onDrag?: (info: DragInfo) => void;
  itemHeight?: number;             // fixed row height, default 56
  disabled?: boolean;
  renderItem?: (item: IUiRankItem) => React.ReactNode; // custom row content (besides handle + placement)
  ariaLabel?: string;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const move = <T,>(arr: T[], from: number, to: number): T[] => {
  if (from === to) return arr.slice();
  const next = arr.slice();
  const [it] = next.splice(from, 1);
  next.splice(to, 0, it);
  return next;
};

const UiRank: React.FC<IUiRankProps> = ({
  items,
  onReorder,
  onDrag,
  itemHeight = 56,
  disabled = false,
  renderItem,
  ariaLabel = 'Ranking list',
}) => {
  const [order, setOrder] = useState<IUiRankItem[]>(items);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragFrom, setDragFrom] = useState<number>(-1);
  const [overIndex, setOverIndex] = useState<number>(-1);
  const [offsetY, setOffsetY] = useState<number>(0);

  const listRef = useRef<HTMLDivElement | null>(null);
  const pointerStartY = useRef<number>(0);
  const itemTopAtPick = useRef<number>(0);

  // sync external changes when not dragging
  useEffect(() => {
    if (!dragId) setOrder(items);
  }, [items, dragId]);

  // placement is derived from array index (1-based)
  const withDerivedPlacement = useCallback(
    (arr: IUiRankItem[]) => arr.map((it, i) => ({ ...it, placement: i + 1 })),
    []
  );

  const indexById = useCallback((id: string) => order.findIndex(i => i.id === id), [order]);

  const startDrag = useCallback((id: string, clientY: number) => {
    const idx = indexById(id);
    if (idx < 0) return;
    setDragId(id);
    setDragFrom(idx);
    setOverIndex(idx);
    pointerStartY.current = clientY;
    itemTopAtPick.current = idx * itemHeight;
    setOffsetY(0);
  }, [indexById, itemHeight]);

  const updateDrag = useCallback((clientY: number) => {
    if (!dragId) return;
    const dy = clientY - pointerStartY.current;
    setOffsetY(dy);
    const rawIndex = Math.round((itemTopAtPick.current + dy) / itemHeight);
    const nextOver = clamp(rawIndex, 0, order.length - 1);
    setOverIndex(nextOver);
    onDrag?.({ id: dragId, fromIndex: dragFrom, overIndex: nextOver, pointer: { x: 0, y: clientY } });
  }, [dragId, dragFrom, itemHeight, order.length, onDrag]);

  const endDrag = useCallback(() => {
    if (!dragId) return;
    const from = dragFrom;
    const to = overIndex < 0 ? from : overIndex;
    const changed = from !== to;
    const id = dragId;

    const next = changed ? move(order, from, to) : order.slice();
    const normalized = withDerivedPlacement(next);

    setOrder(normalized);
    setDragId(null);
    setDragFrom(-1);
    setOverIndex(-1);
    setOffsetY(0);

    onReorder?.(normalized, { id, fromIndex: from, toIndex: to, changed });
  }, [dragId, dragFrom, overIndex, order, onReorder, withDerivedPlacement]);

  const onPointerMove = useCallback((e: PointerEvent) => {
    e.preventDefault();
    updateDrag(e.clientY);
  }, [updateDrag]);

  const onPointerUp = useCallback((e: PointerEvent) => {
    e.preventDefault();
    endDrag();
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    (document.activeElement as HTMLElement | null)?.blur?.();
  }, [endDrag, onPointerMove]);

  const handleHandlePointerDown = useCallback((e: React.PointerEvent, id: string) => {
    if (disabled) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    startDrag(id, e.clientY);
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp, { passive: false });
  }, [disabled, onPointerMove, onPointerUp, startDrag]);

  // keyboard support
  const handleKeyDown = useCallback((e: React.KeyboardEvent, id: string) => {
    if (disabled) return;
    const idx = indexById(id);
    if (idx < 0) return;

    if (!dragId && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setDragId(id);
      setDragFrom(idx);
      setOverIndex(idx);
      setOffsetY(0);
      return;
    }
    if (dragId) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setDragId(null); setDragFrom(-1); setOverIndex(-1); setOffsetY(0);
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const step = e.key === 'ArrowDown' ? 1 : -1;
        const nextOver = clamp((overIndex < 0 ? dragFrom : overIndex) + step, 0, order.length - 1);
        setOverIndex(nextOver);
        onDrag?.({ id, fromIndex: dragFrom, overIndex: nextOver, pointer: { x: 0, y: 0 } });
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        endDrag();
      }
    }
  }, [disabled, dragId, dragFrom, overIndex, indexById, onDrag, endDrag]);

  const getRowStyle = useCallback((i: number, id: string): React.CSSProperties => {
    if (!dragId) return {};
    if (id === dragId) {
      return {
        zIndex: 10,
        transform: `translateY(${offsetY}px)`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.20)',
      };
    }
    if (dragFrom < 0 || overIndex < 0) return {};
    if (i > dragFrom && i <= overIndex) {
      return { transform: `translateY(-${itemHeight}px)` };
    }
    if (i < dragFrom && i >= overIndex) {
      return { transform: `translateY(${itemHeight}px)` };
    }
    return {};
  }, [dragId, dragFrom, overIndex, offsetY, itemHeight]);

  const DefaultRow = useCallback((it: IUiRankItem) => (
    <div className="ui-rank__content">
      <div className="ui-rank__placement" aria-hidden="true">{it.placement}</div>
      <div className="ui-rank__main">
        <div className="ui-rank__name" title={it.name}>{it.name}</div>
        <div className="ui-rank__meta">Score: {it.score}</div>
      </div>
      {it.children && <div className="ui-rank__extra">{it.children}</div>}
    </div>
  ), []);

  return (
    <>
      <style jsx>{styles}</style>
      <div
        ref={listRef}
        className={`ui-rank ${disabled ? 'ui-rank--disabled' : ''}`}
        role="list"
        aria-label={ariaLabel}
        aria-disabled={disabled ? 'true' : 'false'}
        style={{ ['--ui-rank-item-h' as any]: `${itemHeight}px` }}
      >
        {order.map((it, i) => {
          const dragging = dragId === it.id;
          return (
            <div
              key={it.id}
              className={`ui-rank__row ${dragging ? 'is-dragging' : ''}`}
              role="listitem"
              aria-roledescription="draggable item"
              aria-grabbed={dragging ? 'true' : 'false'}
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, it.id)}
              style={getRowStyle(i, it.id)}
            >
              <button
                type="button"
                className="ui-rank__handle"
                aria-label="Drag to reorder"
                onPointerDown={(e) => handleHandlePointerDown(e, it.id)}
              >
                <UiIcon icon="fa-bars" />
              </button>

              {renderItem ? renderItem(it) : <DefaultRow {...it} />}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default UiRank;
