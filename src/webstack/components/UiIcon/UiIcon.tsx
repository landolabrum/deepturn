import IconHelper from "@webstack/helpers/IconHelper";
import { UiIconDefinition } from "@webstack/types/icons";
import React, { MouseEventHandler } from "react";
import styles from "./UiIcon.scss";

interface Props {
  glow?: boolean | string;
  icon?: string | undefined;
  spin?: boolean | undefined;
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
  color?: string | undefined;
  width?: number | string | undefined;
  height?: number | string | undefined;
  size?: number | string | undefined;
  badge?: string | number;
}

interface State {
  innerHtml: string;
  iconStyles: { [key: string]: string };
}

export class UiIcon extends React.Component<Props, State> {
  private currentIcon: string | undefined;
  private currentColor: string | undefined;

  constructor(props: Props) {
    super(props);
    this.state = { innerHtml: '', iconStyles: {} };
  }

  componentDidMount() {
    this.updateIcon(this.props.icon);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.icon !== prevProps.icon || this.props.color !== prevProps.color) {
      this.updateIcon(this.props.icon);
    }
  }

  private async updateIcon(iconId: string | undefined) {
    if (iconId && this.currentIcon !== iconId) {
      this.currentIcon = iconId;
      const icon = IconHelper.getIcon(iconId);
      if (!icon) {
        this.clearIcon();
        return;
      }
      if (icon.path || icon.html) {
        this.buildIconContent(icon);
      }
    }

    this.updateStyles();
  }

  private updateStyles() {
    const { color, width, height, size } = this.props;
    const styles: { [key: string]: string } = {};

    if (this.currentColor !== color && color) {
      this.currentColor = color;
      styles.color = color;
    }

    const dimensionWidth = width ?? size;
    const dimensionHeight = height ?? size;

    if (dimensionWidth) {
      styles.width = typeof dimensionWidth === 'number' ? `${dimensionWidth}px` : dimensionWidth;
    }

    if (dimensionHeight) {
      styles.height = typeof dimensionHeight === 'number' ? `${dimensionHeight}px` : dimensionHeight;
    }

    this.setState({ iconStyles: styles });
  }

  private buildIconContent(icon: UiIconDefinition) {
    let html = '';
    if (icon.html) {
      html = icon.html;
    } else if (icon.path) {
      const isStroke = icon.stroke != null;
      html = `<svg class="jsx-${styles.__hash}" xmlns="http://www.w3.org/2000/svg" width="${icon.width}" height="${icon.height}" viewBox="0 0 ${icon.width} ${icon.height}" ${isStroke ? 'fill="none" stroke="currentColor"' : 'fill="currentColor"'}>${this.getSvgPathElement(icon)}</svg>`;
    }

    this.setState({ innerHtml: html });
  }

  private clearIcon() {
    this.setState({ innerHtml: '' });
  }

  public getSvgPathElement(icon: UiIconDefinition) {
    const pathProps = icon.stroke ? {
      'stroke-linecap': icon.stroke.lineCap,
      'stroke-linejoin': icon.stroke.lineJoin,
      'stroke-width': icon.stroke.width,
      d: icon.path
    } : { d: icon.path };

    const pathAttributes = Object.entries(pathProps).map(([key, value]) => `${key}="${value}"`).join(' ');
    return `<path ${pathAttributes}/>`;
  }

  render() {
    const { glow, spin, badge, onClick } = this.props;
    const { innerHtml, iconStyles } = this.state;

    let classes = 'ui-icon';
    if (glow) classes += typeof glow === 'boolean' ? ' iconGlow' : ` ${glow}`;
    if (spin) classes += ' spinner';

    const combinedStyles = { ...iconStyles, ...(glow ? { textShadow: `0 0 5px ${iconStyles.color || 'currentColor'}` } : {}) };
    const badgeElement = badge && (<><style jsx>{styles}</style><div className="ui-icon__badge">{badge}</div></>);

    return (
      <>
        <style jsx>{styles}</style>
        <div
          className={classes}
          onClick={onClick}
          style={combinedStyles} 
          dangerouslySetInnerHTML={{ __html: innerHtml }} 
        />
      </>
    );
  }
}
