import { IEvent } from "./IEvent";

export interface ICalendar {
    events?: IEvent[];
    month?: number;
    year?: number;
}
