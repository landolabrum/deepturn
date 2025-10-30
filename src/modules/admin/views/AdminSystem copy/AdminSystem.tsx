// Relative Path: ./AdminSystem.tsx
import React, { useEffect, useState } from 'react';
import styles from './AdminSystem.scss';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiBar from '@webstack/components/Graphs/UiBar/UiBar';
import { colorPercentage, dateFormat } from '@webstack/helpers/userExperienceFormats';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import { useLoader } from '@webstack/components/Loader/Loader';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';

const AdminSystem: React.FC = () => {
  const [systemData, setSystemData] = useState<any>();
  const [loader, setLoader] = useLoader();
  const adminService = getService<IAdminService>('IAdminService');

  const fetchSystemData = async () => {
    setLoader({ active: true });
    try {
      const systemResponse = await adminService.getSystemInfo();
      setSystemData(systemResponse);
    } catch (err: any) {
      setSystemData(err);
    } finally {
      setLoader({ active: false });
    }
  };

  const RenderTemp = ({ name, value, percent }: any) => {
    const color = colorPercentage(percent, true);
    const genIcon = () => {
      if (percent < 25) return 'fa-temperature-empty';
      if (percent < 50) return 'fa-temperature-quarter';
      if (percent < 75) return 'fa-temperature-half';
      if (percent < 100) return 'fa-temperature-three-quarters';
      return 'fa-temperature-full';
    };
    
    return (<>
    <style jsx>{styles}</style>
      <div className='admin-system__temp'>
        <div className='admin-system__temp--name'>
          {name && keyStringConverter(name) || 'Temp %'}
        </div>
        <div className='admin-system__temp--percent' style={{ color }}>
          <UiIcon icon={genIcon()} color={color} /> {value}°C / {percent}%
        </div>
      </div>
    </>
    );
  };

  const isPhysicalDisk = (disk: any) => {
    // Filter out non-physical disks and system mounts
    const excludedMountPoints = [
      '/etc/', '/usr/', '/dev/', '/proc/', '/sys/', '/run/', '/snap/',
      '/var/', '/tmp/', '/boot/', '/lib/', '/bin/', '/sbin/'
    ];
    
    return (
      disk.device?.startsWith('/dev/') && 
      !excludedMountPoints.some(mount => disk.mountpoint?.startsWith(mount)) &&
      !disk.mountpoint?.includes('docker') &&
      !disk.mountpoint?.includes('kubelet')
    );
  };

  const getUniquePhysicalDisks = (disks: any[]) => {
    const physicalDisks = disks?.filter(isPhysicalDisk) || [];
    const uniqueDevices = new Set();
    
    return physicalDisks.filter(disk => {
      const deviceBase = disk.device.replace(/[0-9]/g, ''); // Remove partition numbers
      if (!uniqueDevices.has(deviceBase)) {
        uniqueDevices.add(deviceBase);
        return true;
      }
      return false;
    });
  };

  const RenderDiskInfo = ({ disk }: { disk: any }) => {
    return (<>
        <style jsx>{styles}</style>

      <div className='admin-system__disk'>
        <div className='admin-system__disk--header'>
          <div className='admin-system__disk--name'>
            {disk.model || disk.device} ({disk.mountpoint})
          </div>
          {disk.serial && disk.serial !== 'Unknown' && (
            <div className='admin-system__disk--serial'>
              SN: {disk.serial}
            </div>
          )}
        </div>
        <div className='admin-system__disk--details'>
          <UiBar
            header={`${disk.used_human} / ${disk.total_human}`}
            percentage={disk.percent_used}
            barCount={4}
            status={disk.percent_used >= 90 ? 'high' : undefined}
          />
          <div className='admin-system__disk--specs'>
            <div>Filesystem: {disk.fstype}</div>
            {disk.opts && <div>Options: {disk.opts.split(',').join(', ')}</div>}
          </div>
        </div>
      </div>
            </>
    );
  };

  const systemItems = [
    {
      title: 'Graphics',
      icon: 'fa-microchip',
      content: [
        { label: 'GPU Info', value: systemData?.gpu_info },
        { component: <RenderTemp name='gpu temp' value={systemData?.gpu_temp} percent={systemData?.gpu_temp_percentage} /> }
      ]
    },
    {
      title: 'Processor',
      icon: 'fa-disc-drive',
      content: [
        { label: 'CPU Info', value: systemData?.cpu_info },
        { component: <RenderTemp name='cpu temp' value={systemData?.cpu_temp} percent={systemData?.cpu_temp_percentage} /> }
      ]
    },
    {
      title: 'Memory',
      icon: 'fa-memory',
      content: [
        { 
          component: (
            <UiBar
              header='Usage'
              percentage={systemData?.memory_percentage}
              barCount={4}
              status={systemData?.memory_percentage >= 90 ? 'high' : undefined}
            />
          )
        }
      ]
    },
    {
      title: 'Storage',
      icon: 'fa-hard-drive',
      content: [
        { 
          component: (
              <>
              <style jsx>{styles}</style>
                  <div className='admin-system__disks'>
                    Storage Devices <small>{getUniquePhysicalDisks(systemData?.disks)?.length || 0}</small>
                  {getUniquePhysicalDisks(systemData?.disks)?.map((disk: any, index: number) => (
                    <RenderDiskInfo key={index} disk={disk} />
                  ))}
                </div>
              </>
            // <UiCollapse
            
            //   label={`Storage Devices (${getUniquePhysicalDisks(systemData?.disks)?.length || 0})`}
            //   content={
          
            //   }
            // />
          )
        }
      ]
    }
  ];

  useEffect(() => {
    if (!systemData) fetchSystemData();
  }, []);

  if (!systemData?.timestamp) {
    return (
      <div className='admin-system'>
        <style jsx>{styles}</style>
        <div className='admin-system__header'>
          <div className='admin-system__title--container'>
            <div className='admin-system__title'>admin system</div>
            <h2>System data unavailable</h2>
            {JSON.stringify(systemData)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-system">
      <style jsx>{styles}</style>
      <div className="admin-system__header">
        <div className="admin-system__title--container">
          <div className="admin-system__title">admin system</div>
          <div className="admin-system__title--timestamp">
            {new Date(systemData.timestamp).toLocaleDateString()}
            {/* {dateFormat(systemData?.timestamp, { isTimestamp: true })} */}
          </div>
        </div>
        <div>
          <UiButton busy={loader?.active} variant="dark" onClick={fetchSystemData}>
            Refresh
          </UiButton>
        </div>
      </div>

      <div className="admin-system__overview">
        {systemItems.map((item, index) => (
          <div key={index} className="admin-system__overview--item">
            <div className="admin-system__overview--item--title">
              <UiIcon icon={loader?.active ? "spinner" : item.icon} /> {item.title}
            </div>
            <div className="admin-system__overview--item--content">
              {item.content.map((contentItem, contentIndex) => (
                <div key={contentIndex} className="admin-system__overview--item--content__info">
                  {contentItem.label && <div>{contentItem.value}</div>}
                  {contentItem.component}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSystem;