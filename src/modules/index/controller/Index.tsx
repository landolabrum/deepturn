// Relative Path: ./Home.tsx
import React, { useCallback, useEffect, useState } from 'react';
import styles from './Index.scss';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import HomeGridItem from '../views/HomeGridItem/HomeGridItem';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import { applianceArray } from '../../ecommerce/products/ProductRequest/data/applianceArray';
import { capitalizeAll } from '@webstack/helpers/Capitalize';
import UiLoader from '@webstack/components/UiLoader/UiLoader';
import ProductRequest from '../../ecommerce/products/ProductRequest/controller/ProductRequest';

// Remember to create a sibling SCSS file with the same name as this component

const Index = () => {
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

            </div>
        </>
    );
    return <UiLoader/>;
};

export default Index;