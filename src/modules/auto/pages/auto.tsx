import React, { useEffect, useState } from "react";
import styles from "./auto.scss";
import { useRouter } from "next/router";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import { getService } from "@webstack/common";
import PlaceGrid from "@webstack/components/PlaceGrid/PlaceGrid";
import UiBar from "@webstack/components/UiBar/UiBar";
import UiLoader from "@webstack/components/UiLoader/UiLoader";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { mock } from "./mock";
import underScoreLess from "@webstack/helpers/underScoreLess";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";


export default function Auto() {
  function Indicator({ text, backgroundColor, rotate }: any) {
    const txt = text? text:"unknown";
    const bg = backgroundColor?backgroundColor: txt.toLowerCase().includes("closed")?"#090":"#f30"
    return (
      <>
        <style jsx>{styles}</style>
        <div
          style={{ backgroundColor: bg, transform: `rotate(${rotate}deg)` }}
          className="auto__vehicle-indicator"
        >
          {txt}
        </div>
      </>
    );
  }
  const router = useRouter();
  const query = router.query?.id;
  const [resp, setResp] = useState<any>({ ...mock });
  const memberService = getService<IMemberService>("IMemberService");
  const body = resp?.access ? resp?.access : null;
  const status = resp.vehicles && Object.entries(resp.vehicles)?.length && resp.vehicles[0]?.vehiclestatus;

  async function fetchV() {
    const respv = await memberService.getVehicles(body);
    if (respv) setResp(respv);
  }
  useEffect(() => {
    // if (Object.entries(resp).length === 0) fetchV();
  }, [fetchV, setResp]);
  const props = {
    gridWidth: "100%",
    gridHeight: "500px",
    columns: 30,
    rows: 30,
    breakpoints: {
      xs: 500,
      md: 900,
      lg: 1100,
      xl: 1260,
    },
  };
  if (status)
    return (
      <>
        <style jsx>{styles}</style>
        <div className="auto">
          <div className="auto__status">
            <div className="auto__status-vin">
              <strong>{query}:</strong> {status?.vin}
            </div>
            <div><strong>Version:</strong> {resp.vehicles[0].version}</div>
            <div className="auto__status-lock"><strong>Lock Status:</strong> {status?.lockStatus?.value} {status?.lockStatus?.value === "LOCKED"?<UiIcon icon="fa-lock"/>:<UiIcon color="#f90" icon="fa-unlock"/>}</div>
          </div>
          <div className="auto__gauges">
            <div className="auto__remote-start">Start</div>

            <UiBar
              barCount={4}
              status={status?.oil?.oilLife}
              percentage={status?.oil?.oilLifeActual}
              icon="fa-oil-can-drip"
              timestamp={status?.oil?.timestamp}
            />
            <UiBar
              barCount={4}
              header={`${status?.fuel?.distanceToEmpty} MTE`}
              percentage={Number((status?.fuel?.fuelLevel).toFixed(2))}
              timestamp={status?.fuel?.timestamp}
              icon="fa-gas-pump"
            />
            <UiBar
              barCount={4}
              header={`${status?.battery.batteryStatusActual.value} / 14V`}
              percentage={Number(((status?.battery.batteryStatusActual.value * 100) / 14).toFixed(2))}
              timestamp={status?.fuel?.timestamp}
              icon="fa-battery-half"
            />
          </div>
          <div className="auto_vehicle">
            <div className="auto_vehicle-img">
              <div className="auto__place-grid">
                <PlaceGrid
                  backgroundImage="/assets/auto/top.png"
                  elements={[
                    {
                      element: (
                        <Indicator
                          rotate={-90}
                          text={`${status?.doorStatus?.hoodDoor?.value}`}
                        />
                      ),
                      locations: { row: 15, column: 1 },
                    },
                    {
                      element: <Indicator text={`${status?.TPMS?.rightFrontTirePressure}`}  />,
                      locations: { row: 2, column: 4 },
                    },
                    {
                      element: (
                        <Indicator text={`${status?.doorStatus?.passengerDoor?.value}`}  />
                      ),
                      locations: { row: 2, column: 11 },
                    },
                    {
                      element: (
                        <Indicator
                          text={`${underScoreLess(status?.windowPosition.passWindowPosition.value)}`}
                        />
                      ),
                      locations: { row: 5, column: 11 },
                    },
                    {
                      element: (
                        <Indicator text={`${status?.doorStatus?.rightRearDoor?.value}`}  />
                      ),
                      locations: { row: 2, column: 16 },
                    },
                    {
                      element: (
                        <Indicator
                          text={`${underScoreLess(status?.windowPosition?.rearPassWindowPos?.value)}`}
                        />
                      ),
                      locations: { row: 5, column: 16 },
                    },
                    {
                      element: <Indicator text={`${status?.TPMS.innerRightRearTirePressure}`} />,
                      locations: { row: 2, column: 24 },
                    },
                    {
                      element: (
                        <Indicator
                          text={`${status?.doorStatus?.tailgateDoor?.value}`}
                          rotate={-90}
                        />
                      ),
                      locations: { row: 15, column: 30 },
                    },
                    {
                      element: <Indicator text={`${status?.TPMS.leftFrontTirePressure}`}  />,
                      locations: { row: 29, column: 4 },
                    },
                    {
                      element: <Indicator text={`${status?.doorStatus?.driverDoor?.value}`}  />,
                      locations: { row: 29, column: 11 },
                    },
                    {
                      element: (
                        <Indicator
                          text={`${underScoreLess(status?.windowPosition?.driverWindowPosition?.value)}`}
                          
                        />
                      ),
                      locations: { row: 26, column: 11 },
                    },
                    {
                      element: <Indicator text={`${status?.doorStatus?.leftRearDoor?.value}`}  />,
                      locations: { row: 29, column: 16 },
                    },
                    {
                      element: (
                        <Indicator
                          text={`${underScoreLess(status?.windowPosition?.rearDriverWindowPos?.value)}`}
                          
                        />
                      ),
                      locations: { row: 26, column: 16 },
                    },
                    {
                      element: <Indicator text={status?.TPMS?.innerLeftRearTirePressure}  />,
                      locations: { row: 29, column: 24 },
                    },
                  ]}
                  {...props}
                />
              </div>
            </div>
          </div>
        </div>
        {/* {JSON.stringify(resp)} */}
        {/* <div>
          {status &&
            Object.entries(resp.vehicles[0].vehiclestatus).map(([k, v]) => {
              return (
                <>
                  <strong>{k}: </strong>
                  {JSON.stringify(v)},
                  <br />
                </>
              );
            })}
        </div> */}
      </>
    );
  return (
    <>
      <UiLoader fontSize={52} />
    </>
  );
}






{/* <iframe title="Ford F150 Raptor" style={{width: "100%", aspectRatio:"5/3"}} allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/7a96fa6484744fc9b0a99ad68f710a9a/embed" aria-controls="none"> </iframe>  */}