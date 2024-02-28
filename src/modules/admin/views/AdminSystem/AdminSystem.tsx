// Relative Path: ./AdminSystem.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminSystem.scss';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiBar from '@webstack/components/Graphs/UiBar/UiBar';
import { colorPercentage, dateFormat } from '@webstack/helpers/userExperienceFormats';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { useLoader } from '@webstack/components/Loader/Loader';
import UiButton from '@webstack/components/UiButton/UiButton';

// Remember to create a sibling SCSS file with the same name as this component

const AdminSystem: React.FC = () => {
  const [systemData, setSystemData] = useState<any>();
  const [loader, setLoader] = useLoader();
  const adminService = getService<IAdminService>('IAdminService');
  const fetchSystemData = async () => {
    setLoader({ active: true });
    try {
      const systemResponse = await adminService.getSystemInfo();
      setSystemData(systemResponse)
    } catch (err: any) {
      setSystemData(err);
    }
  };
  const RenderTemp = ({ name, value, percent }: any) => {
    const color = colorPercentage(percent, true);
    const genIcon = () => {
      if (percent < 25) {
        return 'fa-temperature-empty'; // Assuming you want 'fa-temperature-empty' for less than 25%
      } else if (percent >= 25 && percent < 50) {
        return 'fa-temperature-quarter'; // Replace with the desired icon for 25% to 50%
      } else if (percent >= 50 && percent < 75) {
        return 'fa-temperature-half'; // Replace with the desired icon for 50% to 75%
      } else if (percent >= 75 && percent < 100) {
        return 'fa-temperature-three-quarters'; // Replace with the desired icon for 75% to 100%
      } else {
        return 'fa-temperature-full'; // Replace with the desired icon for 100%
      }
    };
    return <>
      <style jsx> {styles}</style>
      <div className='admin-system__temp'>
        <div className='admin-system__temp--name'>
          {name && keyStringConverter(name) || 'Temp %'}
        </div>
        <div className='admin-system__temp--percent' style={{ color: color }}>
          <UiIcon icon={genIcon()} color={color} /> {value}°C / {percent}%
        </div>
      </div>
    </>
  }
  const lActive = loader?.active;
  const getData = async () => {
    fetchSystemData().then(() => {
      setLoader({ active: false });
    });
  }
  function bytesToGigabytes(bytes: number) {
    return (bytes / (1024 ** 3)).toFixed(2);  // Convert to GB and round to 2 decimal places
  }

  useEffect(() => {
    if (!systemData) getData()
  }, [setSystemData]);
  if (Object(systemData)?.length) return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-system'>
        <div className='admin-system__header'>
          <div className='admin-system__title--container'>
            <div className='admin-system__title'>
              admin system
            </div>
            <div className='admin-system__title--timestamp'>
              {dateFormat(systemData?.timestamp, { isTimestamp: true })}
            </div>
          </div>

          <div >
            <UiButton busy={loader?.active} variant='dark' onClick={getData}>Refresh</UiButton>
          </div>
        </div>
        <div className='admin-system__overview'>
          <div className='admin-system__overview--item'>
            <div className='admin-system__overview--item--title'>
              <UiIcon icon='fa-microchip' /> Graphics
            </div>
            <div className='admin-system__overview--item--content'>
              <div className='admin-system__overview--item--content__info'>{systemData?.gpu_info}</div>
              <RenderTemp name='gpu temp' value={systemData?.gpu_temp} percent={systemData?.gpu_temp_percentage} />
            </div>
          </div>
          <div className='admin-system__overview--item'>
            <div className='admin-system__overview--item--title'>
              <UiIcon icon={lActive ? 'spinner' : 'fa-disc-drive'} /> Processor
            </div>
            <div className='admin-system__overview--item--content'>
              <div className='admin-system__overview--item--content__info'>{systemData?.cpu_info}</div>
              <RenderTemp name='cpu temp' value={systemData?.cpu_temp} percent={systemData?.cpu_temp_percentage} />
            </div>
          </div>
          <div className='admin-system__overview--item'>
            <div className='admin-system__overview--item--title'>
              <UiIcon icon={lActive ? 'spinner' : 'fa-memory'} /> Memory
            </div>
            <div className='admin-system__overview--item--content'>
              <div className='admin-system__overview--item--content__info'>
                <div className='d-flex' style={{ flexDirection: 'column' }}>
                  <UiBar
                    header='Usage'
                    percentage={systemData?.memory_percentage}
                    barCount={4}
                    status={systemData?.memory_percentage >= 90 && 'high' || undefined}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='admin-system__overview--item'>
            <div className='admin-system__overview--item--title'>
              <UiIcon icon='fa-microchip' /> Storage
            </div>
            <div className='admin-system__overview--item--content'>
              <div className='d-flex' style={{ flexDirection: 'column' }}>
                <UiBar
                  header={systemData?.storage_info?.drive}
                  percentage={systemData?.storage_info?.percent_used}
                  barCount={4}
                  status={systemData?.storage_info?.percent_used >= 90 && 'high' || undefined}
                />
                {/* <div>{bytesToGigabytes(systemData?.storage_info?.available)}</div> */}
                {/* <div>{bytesToGigabytes(systemData?.storage_info?.total)}</div> */}
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
  return <>
    <style jsx>{styles}</style>
    <div className='admin-system'>
      <div className='admin-system__header'>
        <div className='admin-system__title--container'>
          <div className='admin-system__title'>
            admin system
          </div>
          <h2>System data unavailable</h2>
        </div>
      </div>
    </div>
  </>
};

export default AdminSystem;