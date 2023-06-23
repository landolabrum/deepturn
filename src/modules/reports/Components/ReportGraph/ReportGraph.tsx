import { useEffect } from "react";
import styles from "./ReportGraph.scss";
const ReportGraph = ({ data }: any) => {
  if(!data || data === null)return <></>;
  const max = data.reduce((acc: number, curr: any) => {
    const value = curr.count;
    if (value > acc) {
      return value;
    } else {
      return acc;
    }
  }, -Infinity);
  // useEffect(()=>{},[data])
  return <>
    <style jsx>{styles}</style>
    <div className="graph">
        <div className="graph-content">
          {data.map((item: any, key: number) => {
            return <div key={key} className="graph-column" data-key={item.date}>
              <div className="graph-bar-container">
              <div className="graph-value">{item.count}</div>
              <div className={`graph-bar ${item.count > 0 ? "pos" : "neg"}`} style={{ height: `${(Math.abs(item.count) / max) * 100}%` }} />
              <div className={`graph-bar-mobile ${item.count > 0 ? "pos" : "neg"}`} style={{ width: `${(Math.abs(item.count) / max) * 100}%` }} />
              </div>
              <div className="graph-x">{item.date}</div>
            </div>
          })}
      </div>
    </div>
  </>
}
export default ReportGraph;
// git change 