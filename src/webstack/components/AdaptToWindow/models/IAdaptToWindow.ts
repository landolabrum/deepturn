import { IVariant } from "@webstack/components/AdapTable/models/IVariant";
import React from "react";

export type IAdaptToWindowBackground = {
    url: string,
    type: string
} | React.ReactElement | undefined;

export interface IAdaptToWindow {
    children?: React.ReactElement | Iterable<React.ReactNode>;
    variant?: IVariant;
    sm?: string;
    md?: string;
    lg?: string;
    background: IAdaptToWindowBackground
}

