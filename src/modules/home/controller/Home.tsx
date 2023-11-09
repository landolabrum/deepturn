// Relative Path: ./Home.tsx
import React, { useCallback, useEffect, useState } from 'react';
import styles from './Home.scss';
import BannerProduct from '../../ecommerce/products/views/BannerProduct/BannerProduct';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import HomeGridItem from '../views/HomeGridItem/HomeGridItem';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import { applianceArray } from '../../ecommerce/products/ProductRequest/data/applianceArray';
import { capitalizeAll } from '@webstack/helpers/Capitalize';
import UiLoader from '@webstack/components/UiLoader/UiLoader';
import ProductRequest from '../../ecommerce/products/ProductRequest/controller/ProductRequest';

// Remember to create a sibling SCSS file with the same name as this component

const Home = () => {
    const volts = 240;
    const [loaded, setLoaded]=useState<boolean>(false);
    const kWAmpsCell = (kw: number): any => {
        const amps = (kw * 1000 / volts).toFixed(2); // Convert kW to W by multiplying by 1000
        return <>
            {kw} (kW) = {amps} (Amps)<br /><i style={{ color: '#f90' }}>*continuous output</i>
        </>;
    }
    const exCell = (kw: number): JSX.Element => {
        const targetAmps = kw * 1000 / volts; // Convert kW to W by multiplying by 1000 and then to Amps
        let currentSum = 0;
        let selectedAppliances: JSX.Element[] = [];
        for (let appliance of applianceArray) {
            if (currentSum + appliance.value <= targetAmps) {
                currentSum += appliance.value;
                selectedAppliances.push(
                    <li key={appliance.name} style={{ lineHeight: '1.5' }}>
                        {capitalizeAll(appliance.name)} {appliance.value} (Amps)
                    </li>
                );
            }
        }
        return <ol>{selectedAppliances}</ol>;
    };


    const comparisonData = [
        { manufacturer: 'Tesla', 'capacity': 13, 'output': 5.5 },
        { manufacturer: 'LG', 'capacity': 15, 'output': 6.4 },
        { manufacturer: 'Enphase', 'capacity': 12, 'output': 5 },
        { manufacturer: 'Generack', 'capacity': 0, 'output': 7.6 },
        { manufacturer: 'GrowWatt', 'capacity': 0, 'output': 6 },
    ];
    const [tableData, setTableData] = useState<any>(comparisonData);
    const handleTableData = () => {
        const completed = comparisonData.map((f: any) => {
            f["value-to-your-home"] = kWAmpsCell(f.output);
            f["example-usage"] = exCell(f.output);
            f["capacity"] = `${f.capacity} (kW) `;
            f["output"] = `${f.output} (kW)`;
            return f;
        });
        setTableData(completed);
        setLoaded(true);
    };
    useEffect(() => {
        handleTableData();
    }, [loaded]);

    if(loaded)return (
        <>
            <style jsx>{styles}</style>
            <div className='home'>
                <ProductRequest/>
                {/* <BannerProduct /> */}
                <div className='home__full'>
                    <div className='home--title'>
                        Time to Create your Nirvana!
                        On and Off-grid battery back up
                    </div>
                    <div className='home__sub-title'>
                        If you&apos;re thinking about going off grid or want to learn more about backup battery systems, it&apos;s time to create your
                    </div>
                </div>
                <div className='home__full'>
                    <div className='home__full--title'>
                        The Importance of Backup Batteries
                    </div>
                </div>
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
                <div className='home__full'>
                    <div className='home--title'>
                        On-grid vs Off-grid Solar Battery Backup
                        Systems
                    </div>
                </div>
                <AdaptGrid sm={1} md={2} margin='0 0' gapX={10}>
                    <HomeGridItem title='on-grid'>
                        On-grid systems are connected to the utility grid and can sell excess energy back to the power company or store excess energy depending on how the system is
                    </HomeGridItem>
                    <HomeGridItem title='environmental concerns' >
                        Off-grid systems are not connected to the utility grid. These systems can be tailored to fit your needs no matter how big or small and using several different power sources.
                    </HomeGridItem>
                </AdaptGrid>
                <div className='home__full'>
                    <div className='home--title'>
                        Don&apos;t be fooled by ( Name Brand ) Batteries
                    </div>
                </div>
                <br />
                <AdapTable
                    // variant='mini'
                    options={{ hide: ['header', 'footer'] }}
                    data={tableData}
                />
                {/* <h1>Appliance Amp List</h1> */}
            </div>
        </>
    );
    return <UiLoader/>;
};

export default Home;