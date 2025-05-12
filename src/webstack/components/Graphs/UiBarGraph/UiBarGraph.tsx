import { useEffect } from "react";
import styles from "./UiBarGraph.scss";
import useWindow from "@webstack/hooks/window/useWindow";
interface IUiBarGraphData {
    count: number;
    date: string;
}
interface IUiBarGraph {
    data?: IUiBarGraphData;
    title?: string;
    height?: number | string;
}

const UiBarGraph = ({ data, title, height }: IUiBarGraph) => {
    const {width}=useWindow();
    if (!data || data === null) return <></>;
    const dataObject = Object.values(data);
    const max = dataObject && dataObject.reduce((acc: number, curr: any) => {
        const value = curr.count;
        if (value > acc) {
            return value;
        } else {
            return acc;
        }
    }, -Infinity);
    const itemPercent = (item:any)=>(Math.abs(item.count) / max) * 100||0;

    
    return <>
        <style jsx>{styles}</style>
        <div className="bar-graph" 
            style={
                height?{height: typeof height === 'string' ? height:`${height}px`
            }:{

            }}
        > 
            {title && <div className="bar-graph__header">
                <div className="bar-graph__header--title">{title}</div>
            </div>}
            <div className="bar-graph__container">
            <div className="bar-graph__container--content">
                {dataObject?.length && dataObject.map((item: any, key: number) => {
                    if(item?.date?.length>1)return <div key={key} className="bar-graph__content--column" data-key={item.date}>
                        <div className="column-container">
                            <div className="column-container__value">{item.count}</div>
                            {/* <div className={`graph-bar ${item.count > 0 ? "pos" : "neg"}`} style={{ height: `${(Math.abs(item.count) / max) * 100}%` }} /> */}
                            <div className={`graph-bar ${item.count > 0 ? "pos" : "neg"}`} style={{ width: `${itemPercent(item)}%` }} />
                            <div className={`graph-bar-mobile ${item.count > 0 ? "pos" : "neg"}`} style={{ width: `${itemPercent(item)}%` }} />
                        </div>
                        <div className="bar-graph__content--row">{item.date}</div>
                    </div>
                })}
            </div>
            </div>
        </div>
    </>
}
export default UiBarGraph;
// git change 