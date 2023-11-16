import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import styles from "./Loader.scss";
import { UiIcon } from "../UiIcon/UiIcon";


type ILoader = {
  isLoading: boolean;
  onClick?: any;
  body?: any;
  children?: any
};

const LoaderContext =
  createContext<[ILoader, (Loader: ILoader) => any]>
    (
      [
        { isLoading: false },
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
  const LoaderState = useState<ILoader>({ isLoading: false });

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

  useEffect(() => {
    setLoaderState(context);
  }, []);

  if (LoaderState?.isLoading) {
    return (
      <>
        <style jsx>{styles}</style>
        <div 
          className={`loader ${Boolean(context) && 'loader--fixed' || ''}`}
          onClick={context?.onClick}
        >
        <div className='loader__content'>
          <div className='loader__content--icon'>
            <UiIcon icon='deepturn-logo' glow/>
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
