// Relative Path: ./GodDataBaseCreateTable.tsx
import React, { useState } from 'react';
import styles from './GodDataBaseCreateTable.scss';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { getService } from '@webstack/common';
import IDataBaseService from '~/src/core/services/DataBaseService/IDataBaseService';
import UiForm from '@webstack/components/UiForm/controller/UiForm';

interface Props {
  schema?: string | null;
  onCreated?: () => void;
}

const GodDataBaseCreateTable: React.FC<Props> = ({ schema, onCreated }) => {
  const db = getService<IDataBaseService>('IDataBaseService');
  const [loading, setLoading] = useState(false);

  const [fields, setFields] = useState<IFormField[]>([
    { name: 'tableName', label: 'Table Name', type: 'text', required: true, value: '' },
    { name: 'columns', label: 'Columns (JSON)', type: 'text', required: true, value: '' },
  ]);

  const handleChange = (e: any) => {
    setFields(prev =>
      prev.map(f => (f.name === e.target.name ? { ...f, value: e.target.value } : f))
    );
  };

  const handleSubmit = async (formFields: IFormField[]) => {
    setLoading(true);
    const data = Object.fromEntries(formFields.map(f => [f.name, f.value]));
    try {
      await db.createTable({
        schema: schema ?? undefined,
        tableName: data.tableName,
        if_not_exists: true,
        // columns expected as array, parse JSON
        columns: typeof data.columns === 'string' ? JSON.parse(data.columns) : [],
      } as any);
      if (onCreated) onCreated();
      alert(`Table ${data.tableName} created`);
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className="gdb-create-table">
        <UiForm
          title="Create New Table"
          fields={fields}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitText="Create"
          loading={loading}
        />
      </div>
    </>
  );
};

export default GodDataBaseCreateTable;
