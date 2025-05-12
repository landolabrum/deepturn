import { IEvent } from "./IEvent";

export type IDate = {
    month: number;
    year: number;
    day: number;
    dow: number;
    events?: IEvent[]
}