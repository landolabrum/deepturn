// Relative Path: ./UiCard.tsx
import React, { ReactElement, ReactNode, isValidElement } from 'react';
import styles from './UiCard.scss';

// NOTE: use the *existing* types/components from your design system
import { UiIcon, IUicon } from '../UiIcon/controller/UiIcon';
import UiSelect, { ISelect } from '../UiForm/components/UiSelect/UiSelect';

// ---------- Types ----------
export type ICardSection =
  | string
  | number
  | ReactElement
  | {
      text: string | number | ReactElement;
      link?: string | ReactElement;
      icon?: string | IUicon;
    };

export interface ICardHeader {
  title?: ICardSection;
  subTitle?: ICardSection;
  actions?: {
    /** Pass UiSelect props OR a ReactNode (custom action area) */
    select?: ISelect | ReactNode;
    right?: ReactNode; // extra right-aligned actions (icons/buttons/etc.)
  };
}

export interface ICardBody {
  /** Preferred: use children; kept "body" for convenience/back-compat */
  body?: ICardSection;
  children?: ReactNode;
}

export interface ICardFooter {
  footer?: ICardSection;
}

export interface ICard extends ICardBody, ICardFooter {
  header?: ICardHeader;
  /** Visual elevation */
  elevation?: 0 | 1 | 2 | 3;
  /** Clickable styling */
  clickable?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
  /** Compact density (tighter paddings) */
  dense?: boolean;
}

// ---------- Helpers ----------
const isIconConfig = (v: any): v is IUicon | string =>
  !!v && (typeof v === 'string' || typeof v === 'object');

function renderIcon(icon?: string | IUicon) {
  if (!icon) return null;
  if (typeof icon === 'string') return <UiIcon icon={icon} />;
  return <UiIcon {...icon} />;
}

function wrapLink(content: ReactNode, link?: string | ReactElement) {
  if (!link) return content;
  if (typeof link === 'string') {
    return (
      <a className="ui-card__link" href={link} onClick={(e) => e.stopPropagation()}>
        {content}
      </a>
    );
  }
  // if caller passes a <Link> or custom element
  return isValidElement(link) ? React.cloneElement(link as ReactElement, {}, content) : content;
}

function renderSection(section?: ICardSection, className?: string) {
  if (!section && section !== 0) return null;

  // string/number/element direct
  if (typeof section === 'string' || typeof section === 'number') {
    return <div className={className}>{section}</div>;
  }
  if (isValidElement(section)) return <div className={className}>{section}</div>;

  // object form { text, link?, icon? }
  const { text, link, icon } = section as Exclude<ICardSection, string | number | ReactElement>;
  const content = (
    <div className={className}>
      {isIconConfig(icon) && <span className="ui-card__icon">{renderIcon(icon)}</span>}
      <span className="ui-card__text">{text}</span>
    </div>
  );
  return wrapLink(content, link);
}

function renderActions(actions?: ICardHeader['actions']) {
  if (!actions) return null;

  const selectNode =
    actions.select && (isValidElement(actions.select) ? (
      actions.select
    ) : (
      // treat as UiSelect props
      <UiSelect {...(actions.select as ISelect)} />
    ));

  return (
    <div className="ui-card__actions" onClick={(e) => e.stopPropagation()}>
      {selectNode}
      {actions.right}
    </div>
  );
}

// ---------- Component ----------
const UiCard: React.FC<ICard> = ({
  header,
  body,
  children,
  footer,
  elevation = 1,
  clickable = false,
  className = '',
  onClick,
  style,
  dense = false,
}) => {
  const classes = [
    'ui-card',
    `ui-card--e${elevation}`,
    clickable ? 'ui-card--clickable' : '',
    dense ? 'ui-card--dense' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <style jsx>{styles}</style>
      <div className={classes} onClick={onClick} style={style}>
        {(header?.title || header?.subTitle || header?.actions) && (
          <div className="ui-card__header">
            <div className="ui-card__header-main">
              {renderSection(header?.title, 'ui-card__header--title')}
              {renderSection(header?.subTitle, 'ui-card__header--subtitle')}
            </div>
            {renderActions(header?.actions)}
          </div>
        )}

        {(children || body) && (
          <div className="ui-card__body">
            {children ?? renderSection(body, 'ui-card__body-content')}
          </div>
        )}

        {footer && <div className="ui-card__footer">{renderSection(footer, 'ui-card__footer-content')}</div>}
      </div>
    </>
  );
};

export default UiCard;
