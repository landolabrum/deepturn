import { IVariant } from "@webstack/components/AdapTable/models/IVariant";
import React from "react";

// Background Type for Adaptive Window

// Orientation Types for Adaptive Window Sizes
type AdaptOrient = 'portrait' | 'landscape';

// Sizes Interface for Adaptive Window

export type IAdaptWinBg = {
    url: string,
    type: string,
    sm?: AdaptOrient;
    md?: AdaptOrient;
    lg?: AdaptOrient;
};
// | React.ReactElement | undefined
interface IAdaptWinSizes{
    sm?: AdaptOrient;
    md?: AdaptOrient;
    lg?: AdaptOrient;
}
// Main Interface for Adaptive Window
export interface IAdaptToWindow {
    children?: React.ReactElement | Iterable<React.ReactNode>;
    variant?: IVariant;
    background: IAdaptWinBg;
    IAdaptWinSizes:[AdaptOrient]
}
