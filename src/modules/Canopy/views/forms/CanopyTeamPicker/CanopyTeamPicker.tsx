// TeamPicker.tsx
import React, { useMemo } from 'react';
import UiSelect from '@webstack/components/UiForm/components/UiSelect/UiSelect';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';

export type TeamOption = {
  id: string;
  label: string;
  vehicle: string;
  hasGps?: boolean;
};

export const CanopyTeamPicker: React.FC<{
  options: TeamOption[];
  selected: string[];                  // boat numbers as strings
  onToggle: (vehicle: string) => void; // toggle one
  onClear: () => void;
  onAll: () => void;
  /** If true, only show teams that have GPS in the dropdown */
  hideTeamsWithoutGps?: boolean;
}> = ({ options, selected, onToggle, onClear, onAll, hideTeamsWithoutGps = true }) => {

  // Build UiSelect options (filter out non-GPS teams if requested)
  const selectOptions = useMemo(() => {
    const base = hideTeamsWithoutGps ? options.filter(o => o.hasGps) : options;
    return base.map(o => ({
      label: `${o.label}  #${o.vehicle}`,
      value: o.vehicle,
      // (optional) could pass icon or secondary here if desired
    }));
  }, [options, hideTeamsWithoutGps]);

  // Display value in the control (so the HTML doesn't show an empty input)
  const controlValue = useMemo(() => {
    return selected.length ? `${selected.length} selected` : 'Select team';
  }, [selected.length]);

  return (
    <div className="map-team-picker">
      {/* Dropdown for adding/toggling one team at a time */}
      <UiSelect
        label="Teams on Map"
        options={selectOptions}
        onSelect={(opt: any) => onToggle(String(opt?.value ?? opt))}
        openDirection="down"
        search
        overlay
        value={controlValue}
        clearable={false}
        // no size prop used anywhere
      />

      {/* Selected teams as pills */}
      {selected.length > 0 && (
        <div className="map-team-picker__chips" style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {selected.map((veh) => {
            const meta = options.find(o => o.vehicle === veh);
            const label = meta ? `${meta.label} #${veh}` : `#${veh}`;
            return (
              <UiButton
                key={veh}
                variant="pill"
                traits={{ afterIcon: 'fa-xmark' }}
                onClick={() => onToggle(veh)}
              >
                {label}
              </UiButton>
            );
          })}
        </div>
      )}

      {/* Quick actions */}
      <div className="map-team-picker__actions" style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <UiButton variant="flat" onClick={onAll}>Select all (GPS)</UiButton>
        <UiButton variant="flat" onClick={onClear}>Clear</UiButton>
      </div>
    </div>
  );
};
