import IconHelper from "@webstack/helpers/IconHelper";
import { UiIconDefinition } from "@webstack/types/icons";
import React, { MouseEventHandler } from "react";
import styles from "./UiIcon.scss";
import UiToolTip from "@webstack/components/UiToolTip/UiToolTip";

export interface IUicon {
  glow?: boolean | string;
  icon?: string | undefined;
  spin?: boolean | undefined;
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
  color?: string | undefined;
  width?: number | string | undefined;
  height?: number | string | undefined;
  size?: number | string | undefined;
  badge?: string | number;
  /** Tooltip content */
  alt?: string | React.ReactElement;
  tooltipVariant?: "dark" | "light" | "info" | "warning" | "success";
}

interface State {
  innerHtml: string;
  iconStyles: { [key: string]: string };
}

export class UiIcon extends React.Component<IUicon, State> {
  private currentIcon: string | undefined;
  private currentColor: string | undefined;
  private anchorRef = React.createRef<HTMLDivElement>();

  constructor(props: IUicon) {
    super(props);
    this.state = { innerHtml: "", iconStyles: {} };
  }

  componentDidMount() {
    this.updateIcon(this.props.icon);
  }

  componentDidUpdate(prevProps: IUicon) {
    if (
      this.props.icon !== prevProps.icon ||
      this.props.color !== prevProps.color ||
      this.props.onClick !== prevProps.onClick
    ) {
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
    const { color, width, height, size, onClick } = this.props;
    const stylesMap: { [key: string]: string } = {};

    if (color) stylesMap.color = color;

    const dimensionWidth = width ?? size;
    const dimensionHeight = height ?? size;

    if (dimensionWidth) {
      stylesMap.width =
        typeof dimensionWidth === "number" ? `${dimensionWidth}px` : dimensionWidth;
    }
    if (dimensionHeight) {
      stylesMap.height =
        typeof dimensionHeight === "number" ? `${dimensionHeight}px` : dimensionHeight;
    }

    if (onClick) stylesMap.cursor = "pointer";

    this.setState({ iconStyles: stylesMap });
  }

  private buildIconContent(icon: UiIconDefinition) {
    if (icon.html) {
      this.setState({ innerHtml: icon.html });
      return;
    }

    if (icon.path) {
      const isStroke = icon.stroke != null;
      // 🛑 Don’t hard-code width/height here, let CSS control it
      const html = `<svg class="jsx-${styles.__hash}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${icon.width} ${icon.height}" ${
        isStroke ? 'fill="none" stroke="currentColor"' : 'fill="currentColor"'
      }>${this.getSvgPathElement(icon)}</svg>`;

      this.setState({ innerHtml: html });
    }
  }

  private clearIcon() {
    this.setState({ innerHtml: "" });
  }

  public getSvgPathElement(icon: UiIconDefinition) {
    const pathProps = icon.stroke
      ? {
          "stroke-linecap": icon.stroke.lineCap,
          "stroke-linejoin": icon.stroke.lineJoin,
          "stroke-width": icon.stroke.width,
          d: icon.path,
        }
      : { d: icon.path };

    const pathAttributes = Object.entries(pathProps)
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ");
    return `<path ${pathAttributes}/>`;
  }

  render() {
    const { glow, spin, badge, onClick, alt, tooltipVariant } = this.props;
    const { innerHtml, iconStyles } = this.state;

    let classes = "ui-icon";
    if (glow) classes += typeof glow === "boolean" ? " iconGlow" : ` ${glow}`;
    if (spin) classes += " spinner";

    const combinedStyles = {
      ...iconStyles,
      ...(glow ? { textShadow: `0 0 5px ${iconStyles.color || "currentColor"}` } : {}),
    };

    const iconNode = (<>
    <style jsx>{styles}</style>
      <div
        ref={this.anchorRef}
        className={classes}
        onClick={onClick}
        style={combinedStyles}
        dangerouslySetInnerHTML={{ __html: innerHtml }}
        data-icon={this.props.icon}
        aria-label={typeof alt === "string" ? alt : undefined}
        />
        </>
    );

    // no badge
    if (!badge) {
      return (
        <>
          <style jsx>{styles}</style>
          {iconNode}
          {alt ? (
            <UiToolTip elRef={this.anchorRef} variant={tooltipVariant ?? "dark"}>
              {typeof alt === "string" ? <span>{alt}</span> : alt}
            </UiToolTip>
          ) : null}
        </>
      );
    }

    // with badge
    return (
      <>
        <style jsx>{styles}</style>
        <div
          className={classes}
          data-icon={this.props.icon}
          style={{ position: "relative", display: "inline-block" }}
        >
          <div
            ref={this.anchorRef}
            onClick={onClick}
            style={combinedStyles}
            dangerouslySetInnerHTML={{ __html: innerHtml }}
          />
          {alt ? (
            <UiToolTip elRef={this.anchorRef} variant={tooltipVariant ?? "dark"}>
              {typeof alt === "string" ? <span>{alt}</span> : alt}
            </UiToolTip>
          ) : null}
          <div className="ui-icon__badge">{badge}</div>
        </div>
      </>
    );
  }
}
