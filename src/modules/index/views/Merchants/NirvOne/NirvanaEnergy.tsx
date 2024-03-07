// Relative Path: ./MbOne.tsx
import styles from "./NirvanaEnergy.scss";
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import HomeGridItem from '../../HomeGridItem/HomeGridItem';
import ProductRequestSurvey from '~/src/pages/configure';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import { useEffect } from 'react';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import Image from "next/image";


const Nirvo = () => {
  const nStyle = `.nirv{
      display: flex;
      color: var(--blue-10);
      --ui-icon-color: var(--blue-10);
      gap: var(--s-9);
      font-size: var(--s-5);
  }`;
  return <>
    <style jsx>{nStyle}</style>
    <div className='nirv'>
      <UiIcon icon={`nirvana-energy-logo`} />
      Nirvana Energy
    </div>
  </>
}
// Remember to create a sibling SCSS file with the same name as this component
const NirvanaEnergy = () => {

  const tableData = [
    { manufacturer: 'Tesla', 'capacity': 13, 'output': 5.5 },
    { manufacturer: 'LG', 'capacity': 15, 'output': 6.4 },
    { manufacturer: 'Enphase', 'capacity': 12, 'output': 5 },
    { manufacturer: 'Generack', 'capacity': 15.5, 'output': 4.5 },
    { manufacturer: 'GrowWatt', 'capacity': 10, 'output': 6 },
    { manufacturer: <Nirvo />, 'capacity': 15, 'output': 12 },
  ];
  return (
    < >
      <style jsx>{styles}</style>

      <Image
        // fill
        width={900}
        height={900}
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: 'auto',
          zIndex: '-1',
          height: '100%',
          // filter: 'brightness(.66)'
        }}
        objectFit="cover"
        // src="/merchant/nirv1/backgrounds/dirt-road.jpeg"
        src="/merchant/nirv1/backgrounds/redrock-wall.jpeg"
        alt="bg" />
      <div id='nirvana-index'
        className='nirvana-index'
      >
        <div className='nirvana-index__content'>
          <AdaptGrid xs={1} sm={2} gap={15}>
            <div className='d-flex-col align-start gap-9 s-w-100'>
              <h3>6 Key Questions to Enhance Your Solar System with Batteries</h3>
              <h4><UiIcon icon="fa-cube" />Can I add batteries to my exisiting solar system?</h4>
              <h4><UiIcon icon="fa-cube" />What determines that the battery will back up what I need?</h4>
              <h4><UiIcon icon="fa-cube" />Will this battery keep me backed up if the grid stays down?</h4>
              <h4><UiIcon icon="fa-cube" />What does this battery setup have that others dont?</h4>
              <h4><UiIcon icon="fa-cube" />Is there a limit to how much the batteries can power in my home at the same time?</h4>
              <h4><UiIcon icon="fa-cube" />Can I change what I want backed up in the future</h4>
            </div>
            <ProductRequestSurvey id='configure' startButton='configure your back up system' />
          </AdaptGrid>
        </div>
        <h2>
          Time to Create your Nirvana!
        </h2>
        <h4>
          On and Off-grid battery back up
          If you&apos;re thinking about going off grid or want to learn more about backup battery systems, it&apos;s time to create your
        </h4>
        {/* <div className='d-flex-col align-start gap-9'> */}
        <h2>
          The Importance of Backup Batteries
        </h2>
        <AdaptGrid sm={1} md={3} margin='0 0 45px' gapX={10} gapY={5}>
          <HomeGridItem icon='fal-cloud-bolt-sun' title='power outages' >
            With backup batteries, you can be sure your home will have
            power even during outages.
            Most batteries will only back up what is stored when the grid goes down. Be sure to get our system that refills the battery if the grid stays down.
          </HomeGridItem>
          <HomeGridItem icon='fa-globe' title='environmental concerns' >
            Using solar battery backup systems helps reduce your carbon footprint. The less you rely on the grid, the more you do for our planet.
          </HomeGridItem>
          <HomeGridItem icon='fal-circle-dollar' title='cost savings' >
            Solar battery backup systems can help you save money on electricity bills in the long run.
            The 30% Federal Tax credit applies to battery storage that is connected to a PV
          </HomeGridItem>
        </AdaptGrid>
      </div>
      {/* </div> */}

      On-grid vs Off-grid Solar Battery Backup
      Systems
      <AdaptGrid sm={1} md={2} margin='0 0' gapX={10}>
        <HomeGridItem title='on-grid'>
          On-grid systems are connected to the utility grid and can sell excess energy back to the power company or store excess energy depending on how the system is
        </HomeGridItem>
        <HomeGridItem title='environmental concerns' >
          Off-grid systems are not connected to the utility grid. These systems can be tailored to fit your needs no matter how big or small and using several different power sources.
        </HomeGridItem>
      </AdaptGrid>

      Don&apos;t be fooled by ( Name Brand ) Batteries
      <AdapTable
        // variant='mini'
        options={{ hide: ['header', 'footer'] }}
        data={tableData}
      />
    </>
  );
};

export default NirvanaEnergy;