import React, { useEffect, useState } from 'react';
import styles from "./AdminStream.scss";
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import UiInput from '@webstack/components/UiForm/components/UiInput/UiInput';
import UiPill from '@webstack/components/UiForm/components/UiPill/UiPill';
import AdaptGrid from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';

type RaceRow = {
  placement: number;
  boatId: number;
  teamName: string;
  throttleman: string;
  driver: string;
  class: string;
  [key: string]: string | number;
};

const AdminStream = () => {
  const initialRaceData: RaceRow[] = [
    {
      placement: 1,
      boatId: 10,
      teamName: 'Team A',
      throttleman: 'Joe Throttleman A',
      driver: 'Joe Driver A',
      class: 'Pro',
    },
    {
      placement: 2,
      boatId: 11,
      teamName: 'Team B',
      throttleman: 'Joe Throttleman B',
      driver: 'Joe Driver B',
      class: 'Amateur',
    },
  ];
  const defaultFormData: Partial<RaceRow> = {
    placement: 0,
    boatId: 0,
    teamName: '',
    throttleman: '',
    driver: '',
    class: '',
  };
  const { openModal, closeModal } = useModal();
  const [raceData, setRaceData] = useState(initialRaceData);
  const [showAdd, setShowAdd] = useState(false);

  const [formData, setFormData] = useState<Partial<RaceRow>>(defaultFormData);

  const handleRaceDataChange = (
    index: number,
    key: keyof RaceRow,
    value: string | number
  ) => {
    const newData = [...raceData];
    console.log('newData', newData);
    if (key === 'placement' && typeof value === 'number') {
      const newPlacement = Math.max(1, value);

      const conflictingIndex = newData.findIndex(
        (row, i) => row.placement === newPlacement && i !== index
      );

      if (conflictingIndex !== -1) {
        const temp = newData[conflictingIndex].placement;
        newData[conflictingIndex].placement = newData[index].placement;
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



  const firstPlace = () => {
    const first = raceData.find((item) => item.placement === 1);
    return first ? first.teamName : 'N/A';
  };
  const toggleAddForm = () => {
    setFormData(defaultFormData);
    setShowAdd(true);
  };
const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: name === 'placement' || name === 'boatId' ? Number(value) : value,
  }));
};
  useEffect(() => { console.log({ formData }) }, [handleAdd]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className="admin-stream">
        <div className="admin-stream__header"></div>
        <div className="admin-stream__body">
          <AdaptGrid xs={2} md={3} variant="card" gap={10}>
            <div className="admin-stream__card">
              <div className="admin-stream__card-header">Competitors</div>
              <div className="admin-stream__card-body">{raceData.length}</div>
            </div>
            <div className="admin-stream__card">
              <div className="admin-stream__card-header">Current Lap</div>
              <div className="admin-stream__card-body">12 of 20</div>
            </div>
            <div className="admin-stream__card">
              <div className="admin-stream__card-header">First Place</div>
              <div className="admin-stream__card-body">{firstPlace()}</div>
            </div>
          </AdaptGrid>
          {JSON.stringify(formData)}
          {!showAdd &&
            <UiForm
              fields={Object.keys(formData).map((key) => ({
                name: key,
                label: key[0]?.toUpperCase() + key.slice(1) || '',
              }))}
              onChange={handleAdd}
              onSubmit={() => {
                setRaceData((prev) => [
                  ...prev,
                  {
                    ...formData,
                    placement: prev.length + 1,
                    boatId: Number(formData.boatId),
                  } as RaceRow,
                ]);
                setFormData(defaultFormData);
                setShowAdd(false);
              }}
            />

          }
          <div className="admin-stream__table">
            <AdapTable
              data={raceData}

              options={{
                tableTitle: (
                  <div className="d-flex gap-5 justify-between s-w-100">
                    <div>race data</div>
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
                        setAmount={(val) =>
                          handleRaceDataChange(index, key, Math.max(1, val))
                        }
                        variant="flat"
                      />
                    );
                  }

                  if (key === 'remove') {
                    return (
                      <div
                        onClick={() => {
                          const newData = [...raceData];
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
      </div>
    </>
  );
};

export default AdminStream;
