// Relative Path: ./MbOne.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from "./NirvanaEnergy.scss";
import AdaptGrid from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import HomeGridItem from '../../../HomeGridItem/HomeGridItem';
import { upperCase } from 'lodash';
import UiMedia from '@webstack/components/UiMedia/controller/UiMedia';
import useScroll from '@webstack/hooks/useScroll';
import useWindow from '@webstack/hooks/window/useWindow';
import { useRouter } from 'next/router';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { getService } from '@webstack/common';
import FullPageBackground from '@webstack/components/Text/FullPageBackground/FullPageBackground';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import ServicesPage from '~/src/pages/services';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import ContactUs from '@shared/components/Contact/forms/ContactUs/ContactUs';

const NirvanaEnergy = () => {
  const { width } = useWindow();
  const { push } = useRouter();
  const [currentScrollYPosition] = useScroll();
  const [view] = useState<'start' | 'other'>('start');

  const firstContentRef = useRef<HTMLDivElement | null>(null);
  const [isSnapping, setIsSnapping] = useState(false);
  const { openModal } = useModal();

  const outputValue = (powerInKW: number) => {
    const volts = 240;
    const ampStr = String((powerInKW * 1000) / volts).split('.');
    const addAmp = Number(String(ampStr[1])[0]) > 5;
    const amps = addAmp ? Number(ampStr[0]) + 2 : ampStr[0];
    return `${powerInKW} kW = ${amps} Amps`;
  };

  const handleModal = (cmd: 'terms' | 'privacy' | 'contact') => {
    if (cmd === 'terms') push('/terms-and-conditions');
    else if (cmd === 'privacy') push('/privacy-policy');
    else if (cmd === 'contact') openModal({ children: <ContactUs /> });
    else push('/');
  };

  const CompetitorBrand = ({ competitor }: { competitor: string }) => (
    <>
      <style jsx>{styles}</style>
      <div className='nirvana-energy__competitor'>{upperCase(competitor)}</div>
    </>
  );

  const tableData = [
    { "Solar Panels": "High-efficiency panels designed for durability and maximum sunlight capture" },
    { "Battery-Backup": "Maintain uninterrupted power with intelligent, 24/7 battery storage" },
    { "Generators": "Rugged and dependable backup power for emergencies and off-grid use" },
    { "Solar Farm": "Scale your energy production with a custom-designed commercial solar array" },
    { "DIY Consulting": "Expert guidance to help you design and install your own solar system" },
  ];

  const scrollFadeMatrix = -currentScrollYPosition * 0.002 + 1;
  const isScrolled = scrollFadeMatrix < 0;
  const baseBgStyle: React.CSSProperties = isScrolled
    ? { opacity: 0, visibility: 'hidden' }
    : currentScrollYPosition > 10
      ? { opacity: scrollFadeMatrix, visibility: 'visible' }
      : {};

  const mergedBgStyle: React.CSSProperties = {
    ...baseBgStyle,
    opacity: Math.min(
      baseBgStyle.opacity === undefined ? 1 : Number(baseBgStyle.opacity),
      isSnapping ? 0.15 : 1
    ),
  };

  useEffect(() => {
    const service: any = getService("IAdminService");
    service?.listThreats?.().catch(console.error);
  }, []);

  const isDesktop = width > 1100;

  const snapToFirst = useCallback(() => {
    const el = firstContentRef.current;
    if (!el) return;
    setIsSnapping(true);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const t = setTimeout(() => setIsSnapping(false), 750);
    return () => clearTimeout(t);
  }, []);
  const gridProps = {
    sm: 2,
    md: 2,
    size: 50,
    gap: 10,
    icons: ['fa-solar-panel', 'fa-plug', 'fa-car-batttery', 'fa-truck-fast']
  }
  return (
    <>
      <style jsx>{styles}</style>
      <div id="nirvana-index" className="nirvana-energy">
        {/* Hero background (click to snap down) */}
        <div
          className={`nirvana-energy__bg-overlay ${isSnapping ? "is-snapping" : ""}`}
          onClick={snapToFirst}
          style={mergedBgStyle}
          role="button"
          aria-label="Scroll to content"
        >
          <FullPageBackground
            btn={{
              text: (<div
                className='nirvana-energy__bg-overlay--content'
              // style={{fontSize:"3.4rem", fontWeight:700, lineHeight:1.2, textAlign:"center", textTransform:"uppercase"}}
              >
                Build your Nirvana
                <div>
                  <AdaptGrid xs={gridProps.sm} md={gridProps.md} gap={gridProps.gap} >

                    {gridProps.icons.map((icon, index) => (
                      <div key={index} className="nirvana-energy__bg-overlay-grid-item">
                        <UiIcon icon={icon}   />
                      </div>
                    ))}
                  </AdaptGrid>
                </div>
                <div
                  className="start-btn"
                  onClick={(e) => {
                    e.stopPropagation();

                    push("/build");
                  }}
                >
                  <div className="start-btn--text">start here</div>

                </div>
              </div>
              ),
            }}
            media={{
              url: "https://tiktok.soy/files/srv/nirv1/broll/nirv1-home.webp",
              type: "image",
              // playbackSpeed: 0.8,
            }}
          // text={{
          //   content: "",
          //   // textAlign: "center",
          //   // textTransform: "uppercase",
          // }}
          />

          {width > 1100 && (

            <div className="nirvana-energy__content--cta">
              <UiButton variant="glow" traits={{ afterIcon: "fa-chevron-down" }}>
                more
              </UiButton>
            </div>

          )}


        </div>
        {/* Main content */}
        <div className="nirvana-energy__content">
          <div ref={firstContentRef} className="nirvana-energy__content--first">
            <div className="nirvana-energy__content--title">Protect your future, create your Nirvana.</div>
            <div className="nirvana-energy__content--label">
              On and Off-grid battery back up If you&apos;re thinking about going off grid or want to learn more about
              backup battery systems, it&apos;s time to create your Nirvana.
            </div>

            <UiMedia
              type="video"
              controls
              muted={isDesktop}
              autoplay={isDesktop}
              poster={<img alt="nirv1-home" className="d-flex s-w-100" src="/merchant/nirv1/videos/nirv1_index1-poster.png" />}
              src="/merchant/nirv1/videos/nirv1_index1.mp4"
            />

            {view === "start" && (
              <>
                <div id="Nirvana Energy Services" className='nirvana-energy__content--services'>
                  <ServicesPage variant="view" />
                </div>
                <div className="nirvana-energy__content--title">The Importance of Backup Batteries</div>
                <AdaptGrid sm={1} md={3} margin={isDesktop ? `0 0 45px` : undefined} gap={15}>
                  <HomeGridItem icon="fal-cloud-bolt-sun" title="power outages">
                    With backup batteries, you can be sure your home will have power even during outages...
                  </HomeGridItem>
                  <HomeGridItem icon="fa-globe" title="environmental concerns">
                    Using solar battery backup systems helps reduce your carbon footprint...
                  </HomeGridItem>
                  <HomeGridItem icon="fal-circle-dollar" title="cost savings">
                    Solar battery backup systems can help you save money in the long run...
                  </HomeGridItem>
                </AdaptGrid>

                <h3>On-grid vs Off-grid Solar Battery Backup Systems</h3>
                <AdaptGrid sm={1} md={2} margin="0 0" gapX={10}>
                  <HomeGridItem title="on-grid">
                    On-grid systems are connected to the utility grid...
                  </HomeGridItem>
                  <HomeGridItem title="environmental concerns">
                    Off-grid systems are not connected to the utility grid...
                  </HomeGridItem>
                </AdaptGrid>
                <div className="d-flex-col s-1">
                  ROC: 357597
                  <div className="s-w-100 d-flex  s-w-9 g-9">
                    <UiButton variant="link" onClick={() => handleModal("terms")}>Terms & Conditions</UiButton>
                    {`  |  `}
                    <UiButton variant="link" onClick={() => handleModal("privacy")}>Privacy Policy</UiButton>
                    {`  |  `}
                    <UiButton variant="link" onClick={() => handleModal("contact")}>Contact Us</UiButton>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NirvanaEnergy;
