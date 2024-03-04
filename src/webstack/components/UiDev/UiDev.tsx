import { useState, type FC } from "react";
import styles from "./UiDev.scss";
interface UiDevProps {
  data: any;
}

const UiDev: FC<UiDevProps> = ({ data }) => {
  
  const DevMap = ({parent,items}:{parent?: string, items:any}) =>
    Object.entries(items).map(
      ([key,value], index) => {
      if(typeof value === 'string' || typeof value === 'number' )return (<>
        <style jsx>{styles}</style>
        <div className="dev-item" key={index}>
          <div className="dev-key">{parent&&`${parent}>`}{key}:</div>
          <div className="dev-value">{value}</div>
        </div>
        </>
      )
      else if(typeof value === "object" && value !== null )return (<>
        <style jsx>{styles}</style>
        <div className="dev-item" key={index}>
          <div className="dev-key">{parent&&`${parent}>`}{key}:</div>
           <DevMap parent={key} items={value}/>
        </div>
        </>
      );
      else return (<>
        <style jsx>{styles}</style>
        <div className="dev-item" key={index}>
          <div className="dev-key">{parent&&`${parent}>`}{key}:</div>
              <div className="dev-value">{JSON.stringify(value)}</div>
        </div>
        </>
      );

    });
const [min,setMin]=useState(false);
  return (
    <>
      <style jsx>{styles}</style>
      <div className="dev" style={min?{maxHeight: '100px'}:{}} onClick={()=>setMin(!min)}>
        {data && <DevMap items={data}/>
       }
      </div>
    </>
  );
};
export default UiDev;
