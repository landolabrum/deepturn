import React from "react";
import styles from "./vehicle.scss";

interface VehicleProps {
  foreGround: string;
  backGround: string;
}

const vehicle = () => {
  return (
    <>
      <style jsx>{styles}</style>
    </>
  );
};

export default vehicle;

