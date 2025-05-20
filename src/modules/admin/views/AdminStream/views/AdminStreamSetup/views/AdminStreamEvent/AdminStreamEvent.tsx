import React, { useEffect, useState } from 'react';
import styles from './AdminStreamEvent.scss';
import AdaptGrid from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';

interface IEventData {
  eventName: string;
  locationName: string;
  locationLatitude: number;
  locationLongitude: number;
  lapCount: number;
  [key: string]: string | number;
}

const defaultEventData: IEventData = {
  eventName: '',
  locationName: '',
  locationLatitude: 0,
  locationLongitude: 0,
  lapCount: 1,
};

const AdminStreamEvent: React.FC<{ event: IEventData, setEvent: React.Dispatch<React.SetStateAction<IEventData>> }> = ({ event, setEvent }) => {
  const { openModal, closeModal } = useModal();
  const [formData, setFormData] = useState<IEventData>(event || defaultEventData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['lapCount', 'locationLatitude', 'locationLongitude'].includes(name) ? Number(value) : value
    }));
  };

  const handleSubmit = () => {
    setEvent(formData);
    openModal({ children: 'Event data updated!' });
  };

  useEffect(() => {
    setFormData(event);
  }, [event]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-stream-event'>
          <UiForm
            fields={Object.keys(formData).map(key => ({
              name: key,
              label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
              value: formData[key],
              type: typeof formData[key] === 'number' ? 'number' : 'text',
              required: true,
              placeholder: `Enter ${key}`,
            }))}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitText='Save Event'
          />
      </div>
    </>
  );
};

export default AdminStreamEvent;