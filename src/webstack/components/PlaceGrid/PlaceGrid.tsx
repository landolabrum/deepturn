import React from "react";
import PropTypes from "prop-types";
import styles from "./PlaceGrid.scss";
import useWindow from "@webstack/hooks/useWindow";

type BreakPointProps = {
  xs: number;
  md: number;
  lg: number;
  xl: number;
};
type LocationProps = any;
interface PlaceGridProps {
  gridWidth?: string;
  gridHeight?: string;
  columns?: number;
  rows?: number;
  breakpoints?: any;
  elements?: any;
  backgroundImage?: string;
}
const PlaceGrid = ({
  gridWidth = "100%",
  gridHeight = "auto",
  columns = 5,
  rows = 6,
  breakpoints = {
    xs: 500,
    md: 900,
    lg: 1100,
    xl: 1260,
  },
  elements,
  backgroundImage,
}: PlaceGridProps) => {
  const width = useWindow().width;
  const getColumnStart = (location: LocationProps, breakpoint: any) => {
    if (breakpoint && location[breakpoint]) {
      return location[breakpoint].column;
    }
    return location.column;
  };

  const getRowStart = (location: LocationProps, breakpoint: any) => {
    if (breakpoint && location[breakpoint]) {
      return location[breakpoint].row;
    }
    return location.row;
  };

  const renderElements = () => {
    return elements.map((element: any, index: number) => {
      const { element: ElementComponent, locations } = element;
      return Object.keys(breakpoints).map((breakpoint) => (
        <React.Fragment key={`${index}_${breakpoint}`}>
          {breakpoint && breakpoints[breakpoint] <= width && (
            <>
              <style jsx>{styles}</style>
              <div
                key={`${index}_${breakpoint}`}
                className="grid-element"
                style={{
                  gridColumnStart: getColumnStart(locations, breakpoint),
                  gridRowStart: getRowStart(locations, breakpoint),
                }}
              >
                {ElementComponent}
              </div>
            </>
          )}
        </React.Fragment>
      ));
    });
  };

  const gridContainerStyle = backgroundImage
    ? {
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        // width: gridWidth,
        // height: gridHeight,
        backgroundImage: `url(${backgroundImage})`,
        // backgroundSize: "cover",
        // backgroundPosition: "center",
      }
    : {
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        // width: gridWidth,
        // height: gridHeight,
      };

  return (
    <>
      <style jsx>{styles}</style>
      <div className="grid-container" style={gridContainerStyle}>
        {renderElements()}
      </div>
    </>
  );
};

PlaceGrid.propTypes = {
  gridWidth: PropTypes.string,
  gridHeight: PropTypes.string,
  columns: PropTypes.number,
  rows: PropTypes.number,
  breakpoints: PropTypes.object,
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      element: PropTypes.element.isRequired,
      locations: PropTypes.object.isRequired,
    })
  ).isRequired,
  backgroundImage: PropTypes.string,
};

export default PlaceGrid;
