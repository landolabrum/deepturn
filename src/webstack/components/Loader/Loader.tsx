import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import styles from "./Loader.scss";
import { UiIcon } from "../UiIcon/UiIcon";
import environment from "~/src/environment";


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
  }, [context, setContext, LoaderState?.active]);

  if (LoaderState?.active) {
    return (
      <>
        <style jsx>{styles}</style>
        <div
          className={`loader ${Boolean(context) && 'loader--fixed' || ''}`}
          onClick={context?.onClick}
        >
          <div className='loader__content'>
            <div className='loader__content--icon'>
            <UiIcon icon={`${environment.merchant.name}-logo`} glow />

              {/* {context?.animation ? (
                <TJSCube
                  color={"#ff3300"}
                  metalness={1}
                  svgOptions={bevelOptions} // Pass the bevelOptions object as a 
                  
                  animate={{
                    rotate: {
                      x: 0,
                      y: 1, // Specify the desired rotation angles in radians
                      z: 0, // Specify the desired rotation angles in radians
                      speed: 5000,
                      duration: 'infinite'
                    },
                  }}
                  svg={<UiIcon icon={`${environment.merchant.name}-logo`} />}
                  size={{ x: 100, y: 100, z: 20 }}
                />
              ) : (
                <UiIcon icon={`${environment.merchant.name}-logo`} glow />
              )} */}
            </div>
            <div className='loader__content--body'>
              {LoaderState.body || 'loading'}
            </div>
          </div>
        </div>
        {context?.children}
      </>
    );
  }
  return <></>;
};

export default Loader;
