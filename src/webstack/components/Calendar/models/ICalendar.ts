import { IEvent } from "./IEvent";

export interface ICalendar {
    title?: string;
    events?: IEvent[];
    month?: number;
    year?: number;
}
