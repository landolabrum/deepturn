import { getService } from "@webstack/common";
import UiButton from "@webstack/components/UiButton/UiButton";
import UiToggle from "@webstack/components/UiToggle/UiToggle";
import type { NextComponentType, NextPageContext } from "next";
import { useEffect, useState } from "react";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import ColorChanger from "../components/Color/ColorChanger";
import BrightnessSlider from "../components/Brightness/Brightness";
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import styles from "./lights.scss";

interface Props {}
const Lights: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  const [lights, setLights] = useState<any>([]);
  const [ld, setLLd] = useState<boolean>(true);
  const [show, setShow] = useState<any>(false);
  const [allOn, setAllOn] = useState<boolean>(false);
  const memberService = getService<IMemberService>("IMemberService");
  async function toggleAll() {
    const response = allOn ? await memberService.lightsOff() : await memberService.lightsOn();
    if (response) cleaner(response);
  }
  async function toggleOne(id: string) {
    setLLd(true);
    const resp = await memberService.light({ id: id });
    if (resp) setLight(resp);
    setLLd(false);
  }
  function handleLight(l:any){
    console.log("[ HANDLE LIGHT ] ", l)
    // if (l.bri === 0)toggleOne(l.id);
    // setLight(l);
    // setShow(false);
  }
  function updateLight(r: any) {
    r.light = `${r.name} - ${r.id_}`
    r.status = <UiToggle value={r.is_on} onChange={() => toggleOne(r.id)} />;
    r.bri = Math.round((r.bri * 100) / 254);
    r.brightness = (
      <BrightnessSlider hex={r.hex} brite={r.bri} id={r.id_} onChange={handleLight} />
    );
    r.color = <ColorChanger hexCode={r.hex} id={r.id_} onChange={setLight} />;
    delete r.sdk;
    delete r.id_;
    delete r.hex;
    delete r.sat;
    delete r.hue;
    delete r.is_on;
    delete r.name;
    return r;
  }
  function setLight(light: any) {
    setLights((lights: any) => lights.map((l: any) => (l.id === light.id_ ? updateLight(light) : l)));
  }

  function cleaner(response: any) {
    function checkIsOnTrue(array: any) {
      for (var i = 0; i < array.length; i++) {
        var obj = array[i];
        if (!obj.hasOwnProperty("is_on") || obj.is_on !== true) {
          return false;
        }
      }
      return true;
    }

    if (response) {
      setAllOn(checkIsOnTrue(response));
      response.forEach((r: any) => updateLight(r));
      setLights(response);
    }
  }
  async function init() {
    setLLd(true);
    const response = await memberService.lights();
    cleaner(response);
    setLLd(false);
  }
  useEffect(() => {
    init();
  }, [setLLd, show === false]);
  return (
    <>
      <style jsx>{styles}</style>
      <h1>Lights</h1>
      <div className="all-lites">
        <UiButton traits={{ width: "100%" }} onClick={toggleAll}>
          {allOn ? "turn all off" : "turn all on"}
        </UiButton>
      </div>
      {show && (
        <div className="show">
          <div className="close">
            <UiIcon
              icon="fa-xmark"
              onClick={() => {
                setShow(false);
              }}
            />
          </div>
          {/* {show.light} */}
          {/* {show.status} */}
          {show.brightness}
          {/* {show.color} */}
        </div>
      )}

      {Object(lights).length && (
        <AdaptGrid variant="card" xs={1} md={3} gap={5}>
          {lights.map((l: any) => {
            return (
              <div
                className="light"
                key={l.light}
                onClick={() => {
                  setShow(l);
                }}
              >
                {l.light}
                {l.status}
                {l.bri}
                {l.color}
              </div>
            );
          })}
        </AdaptGrid>
      )}
    </>
  );
};

export default Lights;
