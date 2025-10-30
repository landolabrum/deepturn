
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  Dispatch,
  SetStateAction,
  ReactNode,
} from 'react';

export interface ILayout {
  merchantStyleLoaded?: boolean;
  sidebarVisible?: boolean;
  compactMode?: boolean;
  background?: string;
  zIndex?: number;
  position?:string;
}

interface LayoutContextValue {
  layout: ILayout;
  setLayout: Dispatch<SetStateAction<ILayout>>;
}

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [layout, setLayout] = useState<ILayout>({
  });
  const value = useMemo(() => ({ layout, setLayout }), [layout]);

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (
  init?: Partial<ILayout>
): LayoutContextValue => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error('useLayout must be used inside LayoutProvider');
  const { layout, setLayout } = context;
  useEffect(() => {
    if (init) {
      setLayout(prev => ({ ...prev, ...init }));
    }
  }, [init, setLayout]);

  return { layout, setLayout };
};

export default useLayout;
