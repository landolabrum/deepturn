// pages/overlay/index.tsx
import dynamic from 'next/dynamic';

// Render only in the browser – avoids localStorage during build/SSR
export default dynamic(() => import("@Canopy/views/CanopyMedia/page/CanopyPage").then(m => m.default), {
  ssr: false,
});
