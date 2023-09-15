import { IVariant } from "@webstack/components/AdapTable/models/IVariant";
import React from "react";

// Background Type for Adaptive Window

// Orientation Types for Adaptive Window Sizes
export type IAdaptElLocation = 
    'top' | 
    'right' | 
    'bottom' | 
    'left' | 
    'top right' | 
    'top left' | 
    'bottom right' | 
    'bottom left' |
    'right top' |
    'right bottom' |
    'left top' |
    'left bottom';

export type AdaptOrient = 'portrait' | 'landscape' | undefined;

// Sizes Interface for Adaptive Window

export type IAdaptWinBg = {
    url: string,
    type: string,
    sm?: AdaptOrient;
    md?: AdaptOrient;
    lg?: AdaptOrient;
}
// | React.ReactElement | undefined
export interface IAdaptWinSizes{
    sm?: AdaptOrient;
    md?: AdaptOrient;
    lg?: AdaptOrient;
}
// Main Interface for Adaptive Window
export type windowLoc = IAdaptElLocation | {value: IAdaptElLocation, style: React.CSSProperties };
export interface IAdaptToWindow {
    children?: React.ReactElement | Iterable<React.ReactNode>;
    variant?: IVariant;
    background: IAdaptWinBg;
    sm?: windowLoc;
    md?: windowLoc;
    lg?: windowLoc;
}

