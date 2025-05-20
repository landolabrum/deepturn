import React, { useEffect, useState } from 'react';
import styles from "./AdminStream.scss";
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import UiInput from '@webstack/components/UiForm/components/UiInput/UiInput';
import UiPill from '@webstack/components/UiForm/components/UiPill/UiPill';
import AdaptGrid from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import AdminStreamSetup from '../views/AdminStreamSetup/controller/AdminStreamSetup';
import {
  getPlacementMapFromCompetitors,
  defaultRaceData,
  IRaceData
} from '../views/AdminStreamSetup/views/AdminStreamCompetitor/AdminStreamCompetitor';

import { formFieldsToDict } from '@webstack/components/UiForm/functions/formFieldFunctions';

const AdminStream = () => {
  const [first,setFirst] = useState<number| boolean>(false);
const toCompetitorData = (competitorFields: any): any => {
  const obj: any = {};

  // 🔐 Ensure competitorFields is an array
  const fieldsArray = Array.isArray(competitorFields)
    ? competitorFields
    : Object.entries(competitorFields).map(([name, value]) => ({ name, value }));

  fieldsArray.forEach((field: any) => {
    obj[field.name] = field.value;
  });

  if (typeof obj.placement !== 'number') {
    obj.placement = Number(obj.placement) || 0;
  }

  return obj;
};

  
  const initialRaceData: IRaceData = {
    ...defaultRaceData,
    competitors: Array.isArray(defaultRaceData.competitors)
      ? defaultRaceData.competitors.map((fields: any) => toCompetitorData(fields))
      : [],
  };
  console.log('initialRaceData:', initialRaceData);

  const [raceData, setRaceData] = useState<IRaceData>(initialRaceData);
  const raceProps:any = { raceData, setRaceData,setFirst };
  const places = () =>{
    let context={};
    return defaultRaceData?.competitors?.map((competitor) => {
      // Convert competitor fields to array if needed
      const competitorFields = Array.isArray(competitor) ? competitor : Object.entries(competitor).map(([name, value]) => ({ name, value }));
      const competitorPlacement = formFieldsToDict(competitorFields, 'teamName', 'placement');
      context = {
        ...context,
        ...competitorPlacement
      }
      return context;
    });
  }

console.log('placements:', places());
  return (
    <>
      <style jsx>{styles}</style>
      <div className="admin-stream">
        <div className="admin-stream__header" />
        <div className="admin-stream__body">
          <AdaptGrid xs={2} md={3} variant="card" gap={10}>
            <div className="admin-stream__card">
              <div className="admin-stream__card-header">Competitors</div>
              <div className="admin-stream__card-body">{String(raceData.competitors.length)}</div>
            </div>
            <div className="admin-stream__card">
              <div className="admin-stream__card-header">Current Lap</div>
              <div className="admin-stream__card-body">12 of 20</div>
            </div>
            <div className="admin-stream__card">
              <div className="admin-stream__card-header">First Place</div>
              {/* <div className="admin-stream__card-body">{firstPlace()}</div> */}
            </div>
          </AdaptGrid>
            <AdminStreamSetup {...raceProps} />
        </div>
      </div>
    </>
  );
};

export default AdminStream;
