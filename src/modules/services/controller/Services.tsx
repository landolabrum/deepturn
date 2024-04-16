// Relative Path: ./Services.tsx
import React, { useEffect, useState } from 'react';
import styles from './Services.scss';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';


const Services: React.FC = () => {
    const [currentView, setCurrentView]=useState('a');
    const views = {
        a:<div style={{height:'500px', aspectRatio:'1', background:"#0f0"}}>hello world a</div>,
        b:<div style={{height:'500px', aspectRatio:'1',background:"#f00"}}>hello world b</div>
    }
    
    useEffect(() => {}, [setCurrentView]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='services'>
        <AdaptGrid 
            xs={1}
            md={3}
            variant='card'
        >
            {Object.keys(views)}
        </AdaptGrid>
        <UiViewLayout
            // showActions={['a','b','c']}
            currentView={currentView}
            onViewChange={(newView)=>setCurrentView(newView)}
            views={views}
        />

      </div>
    </>
  );
};

export default Services;