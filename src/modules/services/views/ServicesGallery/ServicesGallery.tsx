import React from 'react';
import styles from './ServicesGallery.scss';

const serviceImages = [
  {
    src: '/merchant/nirv1/services/61525/IMG_1070.png',
    alt: 'Solar-ready WallBox install in cabinet housing',
    description: 'Rugged, weather-resistant WallBox installation mounted for off-grid setup.'
  },
  {
    src: '/merchant/nirv1/services/61525/IMG_2180.png',
    alt: 'WallBox Custom Inverter Mounted',
    description: 'WallBox custom inverter system with thermal protection and smart controls.'
  },
  {
    src: '/merchant/nirv1/services/61525/IMG_3368.png',
    alt: 'Technician on solar install',
    description: 'Field technician wiring roof-mounted solar panels for hybrid system.'
  },
  {
    src: '/merchant/nirv1/services/61525/IMG_3386.png',
    alt: 'Fleet of tiny homes equipped with Nirvana Energy',
    description: 'Compact tiny home installations powered by Nirvana CustomBoxes.'
  },
  {
    src: '/merchant/nirv1/services/61525/IMG_3405.png',
    alt: 'Inverter box being serviced',
    description: 'Service check on an indoor inverter unit, tailored to garage installs.'
  },
  {
    src: '/merchant/nirv1/services/61525/IMG_4182.png',
    alt: 'WallBox XL product photo',
    description: 'Our premium WallBox XL enclosure with reinforced housing and cooling.'
  },
  {
    src: '/merchant/nirv1/services/61525/IMG_5153.png',
    alt: 'Internal inverter wiring with Nirvana Energy branding',
    description: 'Close-up showing Nirvana branding on our high-efficiency hybrid system.'
  },
  {
    src: '/merchant/nirv1/services/61525/IMG_5154.png',
    alt: 'Custom garage box and smart battery setup',
    description: 'Smart hybrid box with inverter and battery system, tailored for smart garages.'
  },
  {
    src: '/merchant/nirv1/services/61525/IMG_5866.png',
    alt: 'Solar rooftop array',
    description: 'Rooftop solar array set up with perfect alignment and optimized angle.'
  },
  {
    src: '/merchant/nirv1/services/61525/IMG_8713.png',
    alt: 'Sunset over solar install',
    description: 'Sunset highlighting the clean design of Nirvana’s latest solar panel setup.'
  }
];

const ServicesGallery: React.FC = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <section className="services-gallery">
        <h2 className="services-gallery__title">Our Recent Installs</h2>
        <div className="services-gallery__grid">
          {serviceImages.map(({ src, alt, description }, idx) => (
            <div key={idx} className="services-gallery__card">
              <img src={src} alt={alt} className="services-gallery__image" />
              <p className="services-gallery__description">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ServicesGallery;
