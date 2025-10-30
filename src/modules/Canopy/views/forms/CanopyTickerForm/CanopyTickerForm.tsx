import React, { useMemo } from 'react';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { CanonOverlay, overlayFieldsFor } from '@Canopy/models/canopyOverlayTypes';

type Props = {
  overlay: CanonOverlay;
  size?: 'sm' | 'md' | 'lg';
  onChange: (e: any) => void;
  onAddField?: (e: any) => void;
};

const CanopyTickerForm: React.FC<Props> = ({ overlay, size, onChange, onAddField }) => {
  const fields = useMemo(() => overlayFieldsFor('ticker', overlay), [overlay]);

  return (
    <UiForm
      title="Ticker"
      size={size}
      fields={fields}
      onChange={onChange}
      onAddField={onAddField}
    />
  );
};

export default CanopyTickerForm;
