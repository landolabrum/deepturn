import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import styles from "./Loader.scss";
import { UiIcon } from "../UiIcon/UiIcon";
import environment from "~/src/core/environment";
import { TJSCube } from "../threeJs/TJSCube/controller/TJSCube";


type ILoader = {
  active: boolean;
  onClick?: any;
  body?: any;
  children?: any;
  animation?: true;
  persistence?: number; // New property for persistence
};

const LoaderContext =
  createContext<[ILoader, (Loader: ILoader) => any]>
    (
      [
        { active: false },
        () => { }
      ]
    );

export const useLoader = () => useContext(LoaderContext);
type LoaderProviderProps = {
  children: React.ReactNode;
};
export const LoaderProvider: React.FC<LoaderProviderProps> = ({
  children,
}) => {
  const LoaderState = useState<ILoader>({ active: false });

  return (
    <LoaderContext.Provider value={LoaderState}>
      <Loader />
      {children}
    </LoaderContext.Provider>
  );
};
const Loader: React.FC = () => {
  const [context, setContext] = useContext(LoaderContext);
  const [LoaderState, setLoaderState] = useState<ILoader | null>(null);
  const bevelOptions = {
    bevelEnabled: true,
    bevelThickness: 1, // Set the bevel thickness to 10px
    bevelSize: 2, // Adjust the bevel size as needed
    bevelSegments: 2, // Adjust the number of bevel segments as needed
  };
  
  const NoChildrenLoader = (context: ILoader) => {
    return <>
      <style jsx>{styles}</style>
      {context?.children === undefined && <div className='loader__content--icon'>
        <UiIcon icon={`${environment.merchant.name}-logo`} glow />
      </div>}
    </>
  }

  useEffect(() => {
    // if (context?.active !== LoaderState?.active) {
    setLoaderState(context);
    // Check if persistence is set and active is true
    if (context?.active && context.persistence) {
      // Set a timeout to automatically set active to false after the persistence duration
      const timer = setTimeout(() => {
        setContext({ ...context, active: false }); // Update context to set active to false
      }, context.persistence);
      return () => clearTimeout(timer); // Clear the timeout if the component unmounts or updates
    }
    // }
  }, [context, LoaderContext, setContext, LoaderState?.active]);

  if (LoaderState?.active) {
    return (
      <>
        <style jsx>{styles}</style>
        <div
          style={context?.animation === true?{width:"100vw", height:"100%"}:{}}
          className={`loader ${Boolean(context) && 'loader--fixed' || ''}`}
          onClick={context?.onClick}
        >
          <div className='loader__content' style={context?.animation === true?{width:"100%", height:"100%"}:{}}>
            {context?.animation === true ? (
              <TJSCube
                icon={{
                  bevel: {
                    bevelEnabled: true,
                    bevelThickness: 5,
                    bevelSegments: 15,
                    bevelSize: 2
                  },
                  // color:"#e0e0e0"/,
                  // backgroundColor:"#e0e0e0",
                  // metalness: 10,
                  // roughness: .51,
                  // opacity: opacity !== 0 && opacity * .1 || .1,
                  // opacity: .7,
                  icon: "deepturn-logo",
                  texture: "/assets/backgrounds/lava1.jpeg",
                  // bumpMap:"/assets/textures/texture-leaves.jpeg",
                  size: { x: 120, y: 120, z: 9 },
                  animate: { rotate: { y: -2, x: 1, speed: .001 } }
                }}
              // metalness={5}
              />
            ) : (
              <NoChildrenLoader {...context} />
            )}
            <div className='loader__content--body'>
              {context?.children}
              {LoaderState.body || !context?.children && 'loading'}
            </div>
          </div>
        </div>
      </>
    );
  }
  return <></>;
};

export default Loader;
