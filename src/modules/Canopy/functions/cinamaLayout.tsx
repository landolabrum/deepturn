// streamPageSetup.tsx
import { useHeader } from "@webstack/components/Containers/Header/controller/MainHeader";
import useLayout from "@webstack/layouts/default/hooks/useLayout";
import { useEffect } from "react";
const CinemaBackground="var(--gray-80)"
export const useCinemaLayout = (background?:any) => {
  const { layout, setLayout } = useLayout();
  const [_h, setHeader] = useHeader();
  const handlePageSetup = () => {
    if (layout.background || !background) return;
    setLayout({ background: background || CinemaBackground });
    setHeader({ hideNavbar: true });
  };
  useEffect(handlePageSetup, [handlePageSetup]);
  return;
};
