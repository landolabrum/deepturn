import React, { useState, useRef, useEffect } from 'react';
import styles from './UiUpload.scss';
import UiButton from '../../../views/UiButton/UiButton';
import UiInput from '../../UiInput/UiInput';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import ProductImage from '~/src/modules/ecommerce/Services/views/ServiceDescription/views/ProductImage/ProductImage';

type UploadRow = {
  id: string;           // stable id for deletes
  url: string;          // object URL or preloaded URL
  name: string;
  size: string;
  extension: string;
  dimensions?: string;
};

interface UiUploadProps {
  title: string;
  onFileUpload: (file: File, previewUrl: string) => void;
  onFileRemove?: (idOrIndex: number | string) => void;
  multiple?: boolean;
  maxFiles?: number;
  value?: Array<{ src: string; alt?: string; name?: string; type?: string }>;
}

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const UiUpload: React.FC<UiUploadProps> = ({
  title,
  onFileUpload,
  multiple = false,
  maxFiles = 5,
  onFileRemove,
  value = [],
}) => {
  const [rows, setRows] = useState<UploadRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hydrated = useRef(false);

  // For duplicate detection in-session
  const pickedKeysRef = useRef<Set<string>>(new Set());
  const makeKey = (f: File) => `${f.name}__${f.size}`;

  // Hydrate from preloaded `value` once
  useEffect(() => {
    if (hydrated.current || !value?.length) return;
    const seen = new Set<string>();
    const initial: UploadRow[] = [];
    for (const v of value) {
      if (!v?.src || seen.has(v.src)) continue;
      seen.add(v.src);
      initial.push({
        id: uid(),
        url: v.src,
        name: v.name?.split('/').pop() ?? 'File',
        size: 'N/A',
        extension: v.type || 'image',
      });
    }
    setRows(initial);
    hydrated.current = true;
  }, [value]);

  const openFileDialog = () => fileInputRef.current?.click();

  // Remove by id (stable, never stale)
  const handleRemoveById = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
    onFileRemove?.(id); // pass back the id; parent can ignore or use it
  };

  const remainingSlots = (currentLen: number) => Math.max(0, maxFiles - currentLen);

  const ingestFiles = (filesList: FileList) => {
    const curLen = rows.length;
    const remaining = remainingSlots(curLen);
    if (remaining <= 0) {
      alert(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    const incoming = Array.from(filesList);
    const toUse = multiple ? incoming.slice(0, remaining) : incoming.slice(0, 1);

    toUse.forEach((file) => {
      const dupKey = makeKey(file);
      if (pickedKeysRef.current.has(dupKey)) return;
      pickedKeysRef.current.add(dupKey);

      const objectUrl = URL.createObjectURL(file);
      const extension = file.name.split('.').pop()?.toLowerCase() || 'unknown';
      const size = `${(file.size / 1024).toFixed(1)} KB`;
      const id = uid();

      // Optimistically add a row; dimensions update when image loads
      setRows(prev => [...prev, { id, url: objectUrl, name: file.name, size, extension }]);

      const img = new Image();
      img.onload = () => {
        setRows(prev =>
          prev.map(r => (r.id === id ? { ...r, dimensions: `${img.width}×${img.height}px` } : r))
        );
      };
      img.src = objectUrl;

      onFileUpload(file, objectUrl);
    });

    // reset input so same file name can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    ingestFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    ingestFiles(e.dataTransfer.files);
  };

  // Build table rows for AdapTable at render-time so delete handlers are always fresh
  const tableData = rows.map((r) => ({
    src: <ProductImage image={r.url} options={{ alt: r.name, variant: 'upload' }} />,
    name: r.name,
    size: r.size,
    extension: r.extension,
    dimensions: r.dimensions ?? '',
    delete: (<div      onKeyDown={(e: any) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleRemoveById(r.id);
          }
        }}>
      <UiIcon
        color="red"
        icon="fa-trash-can"
        onClick={() => handleRemoveById(r.id)}
      />

      </div>
    ),
  }));

  const placeholder =
    rows.length > 0
      ? `Add another image (${rows.length}/${maxFiles})`
      : 'Upload image';

  return (
    <>
      <style jsx>{styles}</style>
      <div
        className="ui-upload d-flex"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        aria-label={`${title} - drag & drop files here or use the button to browse`}
      >
        {rows.length > 0 && (
          <AdapTable
            data={tableData}
            variant="mini"
            options={{ hide: ['footer', 'header'], hideColumns: [], title: 'Files' }}
            filters={[]}
          />
        )}

        <div className="ui-upload--actions">
          {/* hidden native input */}
          <UiInput
            innerRef={fileInputRef}
            type="file"
            accept="image/*"
            variant="inherit"
            placeholder={placeholder}
            multiple={multiple}
            onChange={handleFileChange}
            aria-hidden="true"
          />

          {/* Clickable drop zone */}
          <div
            className="fake"
            role="button"
            tabIndex={0}
            onClick={openFileDialog}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openFileDialog();
              }
            }}
            title="Click to browse files or drag & drop here"
          >
            <div>{placeholder}</div>
            <UiIcon icon="fas-plus" />
          </div>

          <div className="ui-upload--btn">
            <UiButton variant="glow" onClick={openFileDialog}>
              {rows.length ? 'Browse for more' : 'Browse files'}
            </UiButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default UiUpload;
