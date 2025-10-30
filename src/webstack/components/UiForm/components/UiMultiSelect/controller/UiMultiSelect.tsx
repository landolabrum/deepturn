import React, { useState } from 'react';
import styles from './UiMultiSelect.scss';
import UiInput from '../../UiInput/UiInput';
import { IInput } from '@webstack/models/input';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';

interface IUiMultiSelect extends IInput {
  value: string[];
  onChange: (e: { target: { name: string; value: string[] } }) => void;
  allowDuplicates?: boolean;
}

const UiMultiSelect: React.FC<IUiMultiSelect> = (props) => {
  const [input, setInput] = useState('');
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  // Use provided name or a safe default to avoid empty-name bugs
  const fieldName = props.name && props.name.length ? props.name : 'items';

  const emit = (next: string[]) =>
    props.onChange({ target: { name: fieldName, value: next } });

  /* ---------------- add or edit on Enter ---------------- */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = String(e.key).toLowerCase();
    if (key === 'enter') {
      e.preventDefault();
      const text = input.trim();
      if (editingIdx !== null) {
        // EDIT MODE
        if (!text) {
          // empty => delete this tag
          const next = props.value.filter((_, i) => i !== editingIdx);
          emit(next);
        } else {
          if (!props.allowDuplicates) {
            const dupAt = props.value.findIndex((v, i) => v === text && i !== editingIdx);
            if (dupAt !== -1) {
              // ignore duplicate edit
              setEditingIdx(null);
              setInput('');
              return;
            }
          }
          const next = props.value.slice();
          next[editingIdx] = text;
          emit(next);
        }
        setEditingIdx(null);
        setInput('');
        return;
      }

      // ADD MODE
      if (!text) return;
      if (!props.allowDuplicates && props.value.includes(text)) {
        setInput(''); // ignore dup
        return;
      }
      emit([...props.value, text]);
      setInput('');
    } else if (key === 'escape') {
      e.preventDefault();
      setEditingIdx(null);
      setInput('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleRemove = (idxOrItem: number | string) => {
    const idx = typeof idxOrItem === 'number'
      ? idxOrItem
      : props.value.findIndex(v => v === idxOrItem);
    if (idx < 0) return;
    const next = props.value.filter((_, i) => i !== idx);
    emit(next);
    if (editingIdx === idx) {
      setEditingIdx(null);
      setInput('');
    }
  };

  const startEdit = (idx: number) => {
    if (props.readonly) return; // respect IInput readonly
    setEditingIdx(idx);
    setInput(props.value[idx] ?? '');
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className="ui-multi-select">
        {/* Single input used for both adding and editing */}
        <UiInput
          {...props}
          name={`${fieldName}__editor`}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={
            editingIdx !== null ? 'Edit tag… (Enter to save)' : (props.placeholder ?? 'Type and press Enter…')
          }
        />

        <div className="ui-multi-select__tags">
          {props.value.map((tag, idx) => (
            <div key={`${tag}-${idx}`} data-tag={tag} className="ui-multi-select__tag">
              {/* Click = load into the top input for editing */}
              <div className="ui-multi-select__tag-label" onClick={() => startEdit(idx)} title="Click to edit">
                {tag}
              </div>
              <UiIcon icon="fa-xmark" onClick={() => handleRemove(idx)} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UiMultiSelect;
