import React, { useEffect, useState } from "react";
import styles from "./auto.scss";
import { useRouter } from "next/router";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import { getService } from "@webstack/common";
import PlaceGrid from "@webstack/components/PlaceGrid/PlaceGrid";
import UiBar from "@webstack/components/Graphs/UiBar/UiBar";
import UiLoader from "@webstack/components/UiLoader/UiLoader";
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
  const [resp, setResp] = useState<any>({});
  const [start, setStart] = useState<any>({ });
  const memberService = getService<IMemberService>("IMemberService");
  const body = resp?.access ? resp?.access : null;
  const status = resp.vehicles && Object.entries(resp.vehicles)?.length && resp.vehicles[0]?.vehiclestatus;

  async function getVehicles() {
    // const respv = await memberService.getVehicles(body);
    // if (respv) setResp(respv);
  }
  async function startVehicle() {
    body.vin = status?.vin
    console.log(body)
    const respv = await memberService.startVehicle(body);
    if (respv) setStart(respv);
  }
  useEffect(() => {
    if (Object.entries(resp).length === 0) getVehicles();
  }, [getVehicles, setResp]);
  const props = {
    columns: 15,
    rows: 15,
    breakpoints: {
      xs: 500,
      md: 900,
      lg: 1100,
      xl: 1260,
    },
  };
  if (!status)
    return (
      <>
        <style jsx>{styles}</style>
        start: {JSON.stringify(start)}
        <div className="auto">
          <div className="auto__status">
            <div className="auto__status-vin">
              <strong>{query}:</strong> {status?.vin}
            </div>
            {/* <div><strong>Version:</strong> {Array(resp?.vehicles).length >2 && resp?.vehicles[0].version}</div> */}
            <div className="auto__status-lock"><strong>Lock Status:</strong> {status?.lockStatus?.value} {status?.lockStatus?.value === "LOCKED"?<UiIcon icon="fa-lock"/>:<UiIcon color="#f90" icon="fa-unlock"/>}</div>
          </div>
          <div className="auto__gauges">
            {/* <div onClick={startVehicle} className="auto__remote-start">{status.ignitionStatus.value === "Off"?"start":"stop"}</div> */}

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
              percentage={99}
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
          <div className="auto__vehicle">
                <PlaceGrid
                  backgroundImage="/assets/auto/top.png"
                  elements={[
                    {
                      element: (
                        <Indicator
                          rotate={-90}
                          text={`hood ${status?.doorStatus?.hoodDoor?.value}`}
                        />
                      ),
                      locations: { row: 8, column: 1 },
                    },
                    {
                      element: <Indicator text={`RFT ${status?.TPMS?.rightFrontTirePressure}`}  />,
                      locations: { row: 5, column: 3 },
                    },
                    {
                      element: (
                        <Indicator text={`PD ${status?.doorStatus?.passengerDoor?.value}`}  />
                      ),
                      locations: { row: 5, column: 6 },
                    },
                    {
                      element: (
                        <Indicator
                          text={`${underScoreLess(status?.windowPosition.passWindowPosition.value)}`}
                        />
                      ),
                      locations: { row: 6, column: 6 },
                    },
                    {
                      element: (
                        <Indicator text={`${status?.doorStatus?.rightRearDoor?.value}`}  />
                      ),
                      locations: { row: 5, column: 9 },
                    },
                    {
                      element: (
                        <Indicator
                          text={`${underScoreLess(status?.windowPosition?.rearPassWindowPos?.value)}`}
                        />
                      ),
                      locations: { row: 6, column: 9 },
                    },
                    {
                      element: <Indicator text={`${status?.TPMS.innerRightRearTirePressure}`} />,
                      locations: { row: 5, column: 13 },
                    },
                    {
                      element: (
                        <Indicator
                          text={`${status?.doorStatus?.tailgateDoor?.value}`}
                          rotate={-90}
                        />
                      ),
                      locations: { row: 8, column: 16 },
                    },
                    {
                      element: <Indicator text={`${status?.TPMS.leftFrontTirePressure}`}  />,
                      locations: { row: 11, column: 3 },
                    },
                    {
                      element: (
                        <Indicator
                          text={`${underScoreLess(status?.windowPosition?.driverWindowPosition?.value)}`}
                          
                        />
                      ),
                      locations: { row: 10, column: 6 },
                    },
                    {
                      element: <Indicator text={`${status?.doorStatus?.driverDoor?.value}`}  />,
                      locations: { row: 11, column: 6 },
                    },
                    {
                      element: (
                        <Indicator
                          text={`${underScoreLess(status?.windowPosition?.rearDriverWindowPos?.value)}`}
                          
                        />
                      ),
                        locations: { row: 10, column: 9 },
                      },
                    {
                      element: <Indicator text={`${status?.doorStatus?.leftRearDoor?.value}`}  />,
                      locations: { row: 11, column: 9 },
                    },
                    {
                      element: <Indicator text={status?.TPMS?.innerLeftRearTirePressure}  />,
                      locations: { row: 11, column: 13 },
                    },
                  ]}
                  {...props}
                />
              </div>
        </div>
        {/* {JSON.stringify(resp)} */}
        <div>
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
        </div>
      </>
    );
  return (
    <>
      <UiLoader fontSize={52} />
    </>
  );
}






{/* <iframe title="Ford F150 Raptor" style={{width: "100%", aspectRatio:"5/3"}} allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/7a96fa6484744fc9b0a99ad68f710a9a/embed" aria-controls="none"> </iframe>  */}