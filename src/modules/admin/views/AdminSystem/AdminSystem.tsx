// Relative Path: ./AdminSystem.tsx
import React, { useEffect, useMemo, useState } from 'react';
import styles from './AdminSystem.scss';
import { getService } from '@webstack/common';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiBar from '@webstack/components/Graphs/UiBar/UiBar';
import { colorPercentage } from '@webstack/helpers/userExperienceFormats';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import { useLoader } from '@webstack/components/Loader/Loader';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import IDataBaseService from '~/src/core/services/DataBaseService/IDataBaseService';

const TABLE_METRICS = 'system_metrics_v'; // or 'system_metrics_24h'
const HOST_KEY = 'mindburn-host';         // set to your MB_HOST_KEY

type MetricRow = {
  ts: string;
  host_key?: string;
  container_name?: string | null;
  cpu_pct?: number | null;
  mem_pct?: number | null;
  gpu_util_pct?: number | null;
  gpu_mem_used_mb?: number | null;
  gpu_mem_total_mb?: number | null;
  disk_root_used_bytes?: number | null;
  disk_root_total_bytes?: number | null;
  net_rx_bytes?: number | null;
  net_tx_bytes?: number | null;
  temps_c?: Record<string, number> | null;
  extra?: Record<string, any> | null;
};

type Point = { x: number; y: number };
type Series = { key: string; points: Point[] };

const TimelineChart: React.FC<{
  series: Series[];
  width?: number;
  height?: number;
  yMax?: number;   // defaults to 100 for percentages
}> = ({ series, width = 640, height = 160, yMax = 100 }) => {
  const m = { t: 10, r: 10, b: 18, l: 30 };
  const iw = width - m.l - m.r;
  const ih = height - m.t - m.b;

  const toPath = (pts: Point[]) =>
    pts
      .map((p, i) => `${i ? "L" : "M"} ${m.l + p.x * iw} ${m.t + (1 - p.y / yMax) * ih}`)
      .join(" ");

  const axisY = Array.from({ length: 5 }, (_, i) => (i * yMax) / 4);

  return (
    <svg width={width} height={height} style={{ display: "block", maxWidth: "100%" }}>
      {/* grid + axes */}
      {axisY.map((v, i) => {
        const y = m.t + (1 - v / yMax) * ih;
        return (
          <g key={i}>
            <line x1={m.l} y1={y} x2={m.l + iw} y2={y} strokeOpacity={0.15} />
            <text x={4} y={y + 4} fontSize={10}>{Math.round(v)}</text>
          </g>
        );
      })}
      {/* series paths (browser default colors) */}
      {series.map(s => (
        <path key={s.key} d={toPath(s.points)} fill="none" strokeWidth={2} />
      ))}
      <line x1={m.l} y1={m.t + ih} x2={m.l + iw} y2={m.t + ih} strokeOpacity={0.25} />
    </svg>
  );
};

type RangeKey = 'hour' | 'day';

const AdminSystem: React.FC = () => {
  const [systemData, setSystemData] = useState<any>();
  const [timeline, setTimeline] = useState<MetricRow[]>([]);
  const [range, setRange] = useState<RangeKey>('hour');
  const [loader, setLoader] = useLoader();
  const db = getService<IDataBaseService>("IDataBaseService");

  const rangeToMs = (r: RangeKey) => (r === 'hour' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000);

  const fetchSystemData = async (r = range) => {
    setLoader({ active: true });
    try {
      const sinceIso = new Date(Date.now() - rangeToMs(r)).toISOString();

      // Fetch rows for the timeline (small column set)
      const timelineRes = await db.selectData({
        tableName: TABLE_METRICS,
        rows: [
          { name: 'ts' },
          { name: 'cpu_pct' },
          { name: 'mem_pct' },
          { name: 'gpu_util_pct' },
          { name: 'host_key' },
          { name: 'disk_root_used_bytes' },
          { name: 'disk_root_total_bytes' },
          { name: 'temps_c' },
        ],
        where: {
          exact: { host_key: HOST_KEY },
        },
      });

      let rows = (timelineRes?.data as MetricRow[]) ?? [];
      // client-side guard: filter/sort by ts ascending
      rows = rows
        .filter(rw => rw?.ts && new Date(rw.ts).getTime() >= new Date(sinceIso).getTime())
        .sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());

      setTimeline(rows);

      // latest snapshot for the summary cards
      const latest = [...rows].reverse()[0];
      if (!latest) {
        setSystemData({ error: 'no metrics yet' });
        return;
      }

      const cpuInfo = `CPU ${Number(latest.cpu_pct ?? 0).toFixed(1)}%`;
      const gpuInfo =
        typeof latest.gpu_util_pct === 'number'
          ? `GPU ${latest.gpu_util_pct.toFixed(1)}%` +
            (latest.gpu_mem_total_mb ? ` • ${latest.gpu_mem_used_mb ?? 0}/${latest.gpu_mem_total_mb}MB` : '')
          : 'GPU n/a';

      const temps = (latest.temps_c ?? {}) as Record<string, number>;
      const cpuTemp = typeof temps['cpu'] === 'number' ? temps['cpu'] : undefined;
      const gpuTemp = typeof temps['gpu'] === 'number' ? temps['gpu'] : undefined;

      const clampPct = (n?: number | null) =>
        Math.max(0, Math.min(100, Number(n ?? 0)));

      const diskUsed = Number(latest.disk_root_used_bytes ?? 0);
      const diskTotal = Number(latest.disk_root_total_bytes ?? 0);
      const diskPct = diskTotal > 0 ? Math.round((diskUsed / diskTotal) * 100) : 0;

      const humanBytes = (n: number) => {
        if (!n) return '0 B';
        const u = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const i = Math.floor(Math.log(n) / Math.log(1024));
        return `${(n / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${u[i]}`;
      };
      const rootDisk = {
        device: '/',
        mountpoint: '/',
        model: 'rootfs',
        serial: undefined,
        fstype: 'ext4',
        opts: '',
        total_human: humanBytes(diskTotal),
        used_human: humanBytes(diskUsed),
        percent_used: diskPct,
      };

      setSystemData({
        timestamp: latest.ts,
        cpu_info: cpuInfo,
        gpu_info: gpuInfo,
        cpu_temp: cpuTemp,
        cpu_temp_percentage: typeof cpuTemp === 'number' ? clampPct(cpuTemp) : undefined,
        gpu_temp: gpuTemp,
        gpu_temp_percentage: typeof gpuTemp === 'number' ? clampPct(gpuTemp) : undefined,
        memory_percentage: clampPct(latest.mem_pct),
        disks: [rootDisk],
      });
    } catch (err: any) {
      setSystemData({ error: err?.message || 'fetch failed' });
      setTimeline([]);
    } finally {
      setLoader({ active: false });
    }
  };

  const chartSeries = useMemo(() => {
    if (!timeline.length) return [];
    const t0 = new Date(timeline[0].ts).getTime();
    const tN = new Date(timeline[timeline.length - 1].ts).getTime();
    const span = Math.max(1, tN - t0);

    const mapLine = (key: 'cpu_pct' | 'mem_pct' | 'gpu_util_pct'): Series => ({
      key,
      points: timeline.map(row => ({
        x: (new Date(row.ts).getTime() - t0) / span,             // 0..1
        y: Math.max(0, Math.min(100, Number(row[key] ?? 0))),    // 0..100
      })),
    });

    return [mapLine('cpu_pct'), mapLine('mem_pct'), mapLine('gpu_util_pct')];
  }, [timeline]);

  const RenderTemp = ({ name, value, percent }: any) => {
    const color = colorPercentage(percent, true);
    const genIcon = () => {
      if (percent < 25) return 'fa-temperature-empty';
      if (percent < 50) return 'fa-temperature-quarter';
      if (percent < 75) return 'fa-temperature-half';
      if (percent < 100) return 'fa-temperature-three-quarters';
      return 'fa-temperature-full';
    };

    return (
      <>
        <style jsx>{styles}</style>
        <div className='admin-system__temp'>
          <div className='admin-system__temp--name'>
            {(name && keyStringConverter(name)) || 'Temp %'}
          </div>
          <div className='admin-system__temp--percent' style={{ color }}>
            <UiIcon icon={genIcon()} color={color} /> {value}°C / {percent}%
          </div>
        </div>
      </>
    );
  };

  const isPhysicalDisk = (disk: any) => {
     if (disk?.device === '/') return true; // allow synthetic rootfs
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
      const deviceBase = (disk.device || '').replace(/[0-9]/g, ''); // Remove partition numbers
      if (!uniqueDevices.has(deviceBase)) {
        uniqueDevices.add(deviceBase);
        return true;
      }
      return false;
    });
  };

  const RenderDiskInfo = ({ disk }: { disk: any }) => {
    return (
      <>
        <style jsx>{styles}</style>
        <div className='admin-system__disk'>
          <div className='admin-system__disk--header'>
            <div className='admin-system__disk--name'>
              {disk.model || disk.device} ({disk.mountpoint})
            </div>
            {disk.serial && disk.serial !== 'Unknown' && (
              <div className='admin-system__disk--serial'>SN: {disk.serial}</div>
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
          )
        }
      ]
    }
  ];

  useEffect(() => { fetchSystemData(range); }, [range]);
  useEffect(() => { if (!systemData) fetchSystemData(range); }, []); // initial

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
          <div>
            <UiButton
              variant={range === 'hour' ? 'dark' : 'light'}
              onClick={() => setRange('hour')}
              disabled={loader?.active}
            >
              Last Hour
            </UiButton>
            <UiButton
              variant={range === 'day' ? 'dark' : 'light'}
              onClick={() => setRange('day')}
              disabled={loader?.active}
            >
              Last Day
            </UiButton>
            <UiButton busy={loader?.active} variant="dark" onClick={() => fetchSystemData()}>
              Refresh
            </UiButton>
          </div>
        </div>
      </div>
    );
  }

  return (<>
      <style jsx>{styles}</style>
    <div className="admin-system">

      <div className="admin-system__header">
        <div className="admin-system__title--container">
          <div className="admin-system__title">admin system</div>
          <div className="admin-system__title--timestamp">
            {new Date(systemData.timestamp).toLocaleString()}
          </div>
        </div>
        <div>
          <UiButton
            variant={range === 'hour' ? 'dark' : 'light'}
            onClick={() => setRange('hour')}
            disabled={loader?.active}
          >
            Last Hour
          </UiButton>
          <UiButton
            variant={range === 'day' ? 'dark' : 'light'}
            onClick={() => setRange('day')}
            disabled={loader?.active}
          >
            Last Day
          </UiButton>
          <UiButton busy={loader?.active} variant="dark" onClick={() => fetchSystemData()}>
            Refresh
          </UiButton>
        </div>
      </div>

      {/* Timeline */}
      <div className="admin-system__timeline" style={{ marginTop: 16 }}>
        <div className="admin-system__overview--item">
          <div className="admin-system__overview--item--title">
            <UiIcon icon={loader?.active ? "spinner" : "fa-chart-line"} /> timeline ({range})
          </div>
          <div className="admin-system__overview--item--content">
            <TimelineChart series={chartSeries} width={640} height={160} yMax={100} />
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
              Lines: CPU% • MEM% • GPU%
            </div>
          </div>
        </div>
      </div>

      {/* Overview cards */}
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

    </>
  );
};

export default AdminSystem;
