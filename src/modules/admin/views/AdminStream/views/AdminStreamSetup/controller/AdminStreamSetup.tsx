// Relative Path: ./AdminStreamVisuals.tsx
import React, { useState } from 'react';
import styles from './AdminStreamSetup.scss';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import AdminStreamEvent from '../views/AdminStreamEvent/AdminStreamEvent';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import AdminStreamCompetitor, { defaultRaceData, IAdminStreamCompetitorProps } from '../views/AdminStreamCompetitor/AdminStreamCompetitor';
import AdaptGrid from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import UiMap from '@webstack/components/ThreeComponents/UiMap/controller/UiMap';
interface IAdminStreamTools {
  props?: any;
}
const AdminStreamSetup: React.FC<IAdminStreamCompetitorProps> = (props) => {
  const raceProps = { raceData: props?.raceData, setRaceData: props?.setRaceData, setFirst: props.setFirst };
  const [open, setOpen] = useState('Event Info');
  const Section = ({ icon, text, component }: any) => {
    return (<>
      <style jsx>{styles}</style>
      <div className='admin-stream-tools__section'>
        <UiCollapse open={open == text}
          label={<><UiIcon icon={icon} /> {text}</>}
          onToggle={(e: any) => {
            setOpen(open == text ? '' : text);
          }}
        >
          {component}
        </UiCollapse>
      </div>
    </>
    );
  };
  
  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-stream-tools d-flex-col s-9 g-9'>
        <AdaptGrid xs={1} md={2} >
          <div className='d-flex-col  s-9 g-9'>
            <div>
              <Section
                icon="fa-checker-flag"
                text="Event Info"
                component={<AdminStreamEvent event={defaultRaceData.event} setEvent={(updatedEvent) => props.setRaceData(prev => ({ ...prev, event: updatedEvent }))} />
                }
              />
            </div>
            <div>
              <Section
                icon="fa-circle-user"
                text="Competitors"
                component={<AdminStreamCompetitor {...raceProps} />}
              />
            </div>
          </div>
            <div style={{position:'relative'}}>
              <UiMap variant="embedded" />
            </div>
        </AdaptGrid>
      </div>
    </>
  );
};

export default AdminStreamSetup;