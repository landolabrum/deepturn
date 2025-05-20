// Relative Path: ./AdminStreamVisuals.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminStreamCompetitor.scss';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import UiInput from '@webstack/components/UiForm/components/UiInput/UiInput';
import UiPill from '@webstack/components/UiForm/components/UiPill/UiPill';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import validateField from '@webstack/components/UiForm/functions/validateField';
import { formFieldsToDict } from '@webstack/components/UiForm/functions/formFieldFunctions';
import { update } from 'lodash';


export type CompetitorData = {
  placement: number;
  [key: string]: string | number;
}
export type IRaceData = {
  competitors: CompetitorData[];
  event: {
    eventName: string;
    locationName: string;
    locationLatitude: number;
    locationLongitude: number;
    lapCount: number;
  };
};
export interface IAdminStreamCompetitorProps {
  raceData: IRaceData,
  setRaceData: React.Dispatch<React.SetStateAction<CompetitorData[]>>;
  setFirst: React.Dispatch<React.SetStateAction<number | boolean>>;
}
const defaultCompetitorData: IFormField[] = [
  {
    name: 'boatId',
    label: 'Boat ID',
    type: 'number',
    required: true,
    value: 0,
    placeholder: 'Enter Boat ID',
  },
  {
    name: 'placement',
    label: 'place',
    type: 'number',
    required: true,
    value: 1,
    placeholder: 'Enter Boat ID',
  },
  {
    name: 'teamName',
    label: 'Team Name',
    type: 'text',
    required: true,
    value: 'Team A',
    placeholder: 'Enter Team Name',
  },
  {
    name: 'throttleman',
    label: 'Throttleman',
    type: 'text',
    required: true,
    value: '',
    placeholder: 'Enter Throttleman',
  },
  {
    name: 'driver',
    label: 'Driver',
    type: 'text',
    required: true,
    value: '',
    placeholder: 'Enter Driver',
  },
  {
    name: 'class',
    label: 'Class',
    type: 'select',
    options: [
      { value: 'Pro Class 1', label: 'Pro Class 1' },
      { value: 'Super Cat', label: 'Super Cat' },
      { value: 'Factory Stock', label: 'Factory Stock' },
      { value: 'Super Stock', label: 'Super Stock' },
      { value: 'Super V', label: 'Super V' },
      { value: 'Mod V', label: 'Mod V' },
      { value: 'Bracket Class 200', label: 'Bracket Class 200' },
      { value: '', label: '' },
      { value: '', label: '' },
    ],
    required: true,
    value: '',
    placeholder: 'Enter Class',
  }
]
export const defaultRaceData: IRaceData = {
  event: {
    eventName: '',
    locationName: '',
    locationLatitude: 0,
    locationLongitude: 0,
    lapCount: 1,
  },
  competitors: [
    defaultCompetitorData.reduce((acc, field) => {
      acc[field.name] =
        typeof field.value === 'string' || typeof field.value === 'number'
          ? field.value
          : typeof field.value === 'boolean'
            ? String(field.value)
            : '';
      return acc;
    }, {} as CompetitorData)
  ]
};
export function getPlacementMapFromCompetitors(
  competitors: CompetitorData[]
): Record<string, number> {
  return competitors?.reduce((acc, comp) => {
    const team = comp.teamName;
    const placement = comp.placement;

    if (team && typeof placement === 'number') {
      acc[team] = placement;
    }

    return acc;
  }, {} as Record<string, number>);
}
const AdminStreamCompetitor: React.FC<IAdminStreamCompetitorProps> = ({ raceData, setRaceData }) => {
  const { openModal, closeModal } = useModal();



  const [formFields, setFormFields] = useState<IFormField[]>(defaultCompetitorData);
  const [showAdd, setShowAdd] = useState(true);
  const competitors: CompetitorData[] = raceData?.competitors || [];

  const handleRaceDataChange = (index: number, key: string, value: string | number) => {
    const newData = [...competitors];
    if (key === 'placement' && typeof value === 'number') {
      const newPlacement = Math.max(1, value);
      const conflictIndex = newData.findIndex((item, i) => item.placement === newPlacement && i !== index);

      if (conflictIndex !== -1) {
        const temp = newData[conflictIndex].placement;
        newData[conflictIndex].placement = newData[index].placement;
        newData[index].placement = temp;
      } else {
        newData[index].placement = newPlacement;
      }

      setRaceData(newData);
      return;
    }

    newData[index] = { ...newData[index], [key]: value };
    setRaceData(newData);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormFields((prevFields) =>
      prevFields.map((field) => {
        if (field.name !== name) return field;

        let updatedValue = field.type === 'number' ? Number(value) : value;
        let error: string | null = null;
        let label = field.label;

        if (['driver', 'throttleman'].includes(name)) {
          error = validateField('name', updatedValue);
          // if(error)alert('error')
          label = {
            ...(typeof label === 'string' ? { text: label } : label),
            text: error ? `* ${error}` : label?.text || name,
            color: error ? 'var(--orange-50)' : undefined,
          };
        }
        else if (field.name === 'boatId') {
          const existingBoatId = competitors.some((competitor: any) => Number(competitor.boatId) === Number(updatedValue));
          if (Number(updatedValue) < 0) {
            error = 'Boat ID must be a positive number';
          } else if (existingBoatId) {
            error = 'Boat ID must be unique';
          }

          label = {
            ...(typeof label === 'string' ? { text: label } : label),
            text: error ? `* ${error}` : field.label?.text || name,
            color: error ? 'var(--orange-50)' : undefined,
          };

        } else if (field.name === 'teamName' && String(updatedValue).length < 3) {
          error = 'Team Name must be at least 3 characters';
          label = {
            ...(typeof label === 'string' ? { text: label } : label),
            text: error ? `* ${error}` : label?.text || name,
            color: error ? 'var(--orange-50)' : undefined,
          };
        }else if (field?.options){
          field.options.forEach((option:any) => {
            if (option.value === Object(value)?.value) {
              updatedValue = option.value;
              console.log( {
                ...field,
                value: updatedValue,
                error: error || undefined,
                label,
              })
            }})
        }
        if (field.required && !updatedValue) {
          error = validateField('required', updatedValue);
          label = {
            ...(typeof label === 'string' ? { text: label } : label),
            text: error ? `* ${error}` : label?.text || name,
            color: error ? 'var(--orange-50)' : undefined,
          };
        }
   
        return {
          ...field,
          value: updatedValue,
          error: error || undefined,
          label,
        };
      })
    );
  };

  const extractFormData = (): Record<string, string | number> => {
    return competitors.reduce((acc, field) => {
      acc[field?.name] = field.value ?? '';
      return acc;
    }, {} as Record<string, string | number>);
  };

  const handleFormSubmit = () => {
    const data = extractFormData();
    setRaceData((prev: any) => [...prev, { ...data, placement: 0 }]);
    setFormFields(defaultCompetitorData);
    setShowAdd(false);
  };

  const toggleAddForm = () => {
    setFormFields(defaultCompetitorData);
    setShowAdd(true);
  };



  const validateFormFields = (fields: IFormField[]): IFormField[] => {
    return fields.map((field) => {
      let error = null;

      // Validate only driver and throttleman with "name" rules
      if (['driver', 'throttleman'].includes(field.name)) {
        // Ensure value is string | number | null | undefined
        let safeValue: string | number | null | undefined =
          typeof field.value === 'string' || typeof field.value === 'number'
            ? field.value
            : field.value === undefined || field.value === null
              ? field.value
              : typeof field.value === 'boolean'
                ? String(field.value)
                : null;
        error = validateField('name', safeValue);
      }

      return {
        ...field,
        error: error || undefined,
        label: {
          ...(typeof field.label === 'string' ? { text: field.label } : field.label),
          color: error ? 'var(--orange-50)' : undefined,
          text: error ? `* ${error}` : field.label?.text || field.label || field.name,
        },
      };
    });
  };


  // console.log('competitors', competitors);
  // const dictCompetitors = competitors&&formFieldsToDict(competitors, 'key', 'value');
  // console.log('toDict', dictCompetitors);

  useEffect(() => {
    const debug = extractFormData();
    // console.log('[formData]', debug);
  }, [formFields]);

  if (raceData) return (
    <>
      <style jsx>{styles}</style>
      <div className="admin-stream-event">


        {showAdd && (
          <UiForm
            fields={formFields}
            onChange={handleFormChange}
            onSubmit={handleFormSubmit}
          />
        )}

        <div className="admin-stream__table">
          <AdapTable
            data={raceData?.competitors}
            options={{
              hoverable: true,
              tableTitle: (
                <div className="d-flex gap-5 justify-between s-w-100">
                  <div>Race Data</div>
                  <div className="actions">
                    <UiButton onClick={toggleAddForm} traits={{ afterIcon: 'fa-user-plus' }}>
                      Add Competitor
                    </UiButton>
                  </div>
                </div>
              ),
              renderCell: (key: string, item: any, index: number) => {
                if (key === 'placement') {
                  return (
                    <UiPill
                      amount={item.placement}
                      setAmount={(val) => handleRaceDataChange(index, key, Math.max(1, val))}
                      variant="flat"
                    />
                  );
                }

                if (key === 'remove') {
                  return (
                    <div
                      onClick={() => {
                        const newData = [...competitors];
                        newData.splice(index, 1);
                        setRaceData(newData);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <UiIcon icon="fa-trash" />
                    </div>
                  );
                }

                return (
                  <UiInput
                    value={String(item[key])}
                    onChange={(e) => handleRaceDataChange(index, key, e.target.value)}
                    variant="flat"
                  />
                );
              },
              hide: 'footer',
            }}
          />
        </div>
      </div>
    </>
  )
  return "loading"
};

export default AdminStreamCompetitor;
