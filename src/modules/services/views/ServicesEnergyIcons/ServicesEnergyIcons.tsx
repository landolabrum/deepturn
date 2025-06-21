import React from 'react';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import styles from './ServicesEnergyIcons.scss';

const ServicesEnergyIcons: React.FC = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className="energy-icons">
        <div className="energy-icons__item">
          <UiIcon icon="solar-panel" />
            <h3>Solar Panel Array</h3>
            <div className="energy-icons__body">
              Harness the sun with cutting-edge solar panel arrays. Built for efficiency and engineered for rooftops, our photovoltaic solutions reduce grid dependency while increasing energy independence.
          </div>
        </div>

        <div className="energy-icons__item">
          <UiIcon icon="diesel-generator" />
            <h3>Diesel Generator</h3>
            <div className="energy-icons__body">
              Power on demand with rugged diesel generators. Engineered for reliability in remote setups, these systems provide a resilient fallback whenever solar energy or grid power is unavailable.
            </div>
        </div>

        <div className="energy-icons__item">
          <UiIcon icon="battery-box" />
            <h3>Battery Backup Box</h3>
            <div className="energy-icons__body">
              Store energy smartly with our compact battery backup units—perfect for garages, cabins, or mobile setups. Offers rapid charging, safe discharge, and seamless system integration.
            </div>
        </div>
      </div>
    </>
  );
};

export default ServicesEnergyIcons;
