import React from 'react';
import styles from './OverlayL3.scss';
import UiMarkdown from '@webstack/components/UiMarkDown/UiMarkDown';

type TitleLike =
  | string
  | { text?: string; img?: any; alt?: string; width?: number; height?: number };

export interface OverlayL3Props {
  title?: TitleLike;
  description?: TitleLike;
  items?: any[];
  data?: any;
  variant?: 'default' | 'fullscreen' | 'image-left' | 'image-right';
  link_url?: string; // image url
}

const textOf = (v?: TitleLike) =>
  typeof v === 'string' ? v : (v?.text ?? '');

const OverlayL3: React.FC<OverlayL3Props> = ({
  title,
  description,
  items,
  data,
  variant = 'default',
  link_url,
}) => {
  // IMPORTANT: ensure variant class matches SCSS (&.l3--X)
  const cls = `l3 l3--${variant}`.trim();

  const hasContent =
    !!(
      (title && textOf(title)) ||
      (description && textOf(description)) ||
      link_url ||
      (Array.isArray(items) && items.length > 0)
    );

  return (
    <>
      <style jsx>{styles}</style>
      <div className={cls} data-variant={variant}>
        {!hasContent && <div className="l3__empty">lower thirds</div>}

        {hasContent && (
          <>
            {/* Image (optional) */}
            {link_url && (
              <div className="l3__image">
                <img
                  src={link_url}
                  alt={
                    typeof title === 'object' && title?.alt
                      ? title.alt
                      : 'Lower Thirds Image'
                  }
                />
              </div>
            )}

            {/* Text content column */}
            <div className="l3__content">
              {title && textOf(title) && (
                <div className="l3__title">
                  <UiMarkdown text={textOf(title)} />
                </div>
              )}

              {description && textOf(description) && (
                <div className="l3__desc">
                  <UiMarkdown text={textOf(description)} />
                </div>
              )}

              {Array.isArray(items) && items.length > 0 && (
                <div className="l3__items">
                  {items.map((it, i) => (
                    <div className="l3__item" key={i}>
                      <UiMarkdown text={textOf(it)} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OverlayL3;
