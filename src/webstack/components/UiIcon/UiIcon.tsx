// import { faI, IconDefinition } from "@fortawesome/pro-solid-svg-icons";
import IconHelper from "@webstack/helpers/IconHelper";
import { IconDefinition, UiIconDefinition } from "@webstack/types/icons";
import React, { MouseEventHandler } from "react";
import styles from "./UiIcon.scss";


interface Props {
  src?: string | undefined;
  glow?: boolean | string;
  icon?: string | undefined;
  spin?: boolean | undefined;
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
  faIcon?: IconDefinition | undefined;
  color?: string | undefined;
  width?: number | string | undefined;
  height?: number | string | undefined;
  size?: number | string | undefined;
}

interface State {
  innerHtml: string;
  iconStyles: { [key: string]: string };
}

export class UiIcon extends React.Component<Props, State> {

  private currentIcon: string | undefined;
  private currentSrc: string | undefined;
  private currentFaIcon: IconDefinition | undefined;
  private currentColor: string | undefined;

  private _innerHtml = '';
  // public renderedIconHTML: string | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { innerHtml: '', iconStyles: {} }
  }

  componentDidMount() {
    this.updateIcon(this.props.icon, this.props.src, this.props.faIcon);
  }

  componentDidUpdate() {
    this.updateIcon(this.props.icon, this.props.src, this.props.faIcon);
  }

  private async updateIcon(
    iconId: string | undefined,
    src: string | undefined,
    faIcon: IconDefinition | undefined,
  ) {
    const props = this.props;

    if (this.currentColor !== props.color) {
      this.currentColor = props.color;
      const styles: { [key: string]: string } = {};
      if (props.color) { styles.color = props.color; }
      if (props.width || props.size) {
        const width = props.width ?? props.size;
        styles.width = (typeof width == 'number') ? `${width}px` : (width as string);
      }
      if (props.height || props.size) {
        const height = props.height ?? props.size;
        styles.height = (typeof height == 'number') ? `${height}px` : (height as string);
      }
      this.setState({ iconStyles: styles });
    }

    if (iconId) {
      if (this.currentIcon === iconId) return;
      this.currentIcon = iconId;
      if (await this.updateIconId(iconId)) return; // success
      this.clearIcon();
      return;
    }

    if (props.src) {
      if (this.currentSrc === src) return;
      this.currentSrc = src;
      if (await this.loadSvgFromFile(src)) return; // success
      this.clearIcon();
      return;
    }

    if (faIcon) {
      if (this.currentFaIcon === faIcon) return;
      this.currentFaIcon = faIcon;
      this.buildFromFaIcon(faIcon);
      return; // success
    }

    this.clearIcon();
  }


  private async updateIconId(iconId: string): Promise<boolean> {

    if (iconId == null) {
      return false;
    }

    // const icon = this.uiService.findIcon(iconId);
    const icon = IconHelper.getIcon(iconId);
    if (!icon) {
      return false;
    }

    if (icon.src) {
      return await this.loadSvgFromFile(icon.src);
    }

    if (icon.path) {
      this.buildSvgFromPath(icon);
      return true;
    }

    if (icon.html) {
      this.buildSvgFromHtml(icon);
      return true;
    }

    return false;
  }

  private updateHtml(html: string) {
    if (this._innerHtml == html) { return; }
    this.setState({ innerHtml: html });
  }

  private clearIcon() {
    // this.renderedIconHTML = this.sanitizer.bypassSecurityTrustHtml('');
    this.updateHtml('');
  }

  private buildSvgFromHtml(icon: UiIconDefinition) {
    if (!icon.html) {
      throw new Error('Missing Icon HTML');
    }
    // this.renderedIconHTML = this.sanitizer.bypassSecurityTrustHtml(icon.html);
    this.updateHtml(icon.html);
  }

  private async loadSvgFromFile(src: string | undefined): Promise<boolean> {
    // TODO: Cache loaded files

    if (!src) return false;
    const response = await fetch(src);
    if (response.ok) {
      const html = await response.text();
      // TODO: Sanitize content. Verify this is an SVG.
      if (html.includes('<svg')) {
        // this.renderedIconHTML = this.sanitizer.bypassSecurityTrustHtml(html);
        this.updateHtml(html);
      } else {
        // this.renderedIconHTML = this.sanitizer.bypassSecurityTrustHtml('');
        this.updateHtml('');
      }

      return true;
    }
    return false;
  }

  private buildFromFaIcon(icon: IconDefinition) {
    const [width, height, ligatures, unicode, pathData] = icon.icon;

    if (!pathData) {
      throw new Error('Missing Icon Path');
    }
    if (!width) {
      throw new Error('Missing Icon Width');
    }
    if (!height) {
      throw new Error('Missing Icon Height');
    }

    if (typeof pathData !== 'string') {
      throw new TypeError(
        'Expected a single string path. Array of paths not implemented.',
      );
    }

    const html =
      '<svg class="jsx-' + styles.__hash + '" xmlns="http://www.w3.org/2000/svg" width="' +
      width +
      '" height="' +
      height +
      '" viewBox="0 0 ' +
      width +
      ' ' +
      height +
      '" fill="currentColor"' +
      '>' +
      this.getSvgPathElementFromString(pathData) +
      '</svg>';

    // this.renderedIconHTML = this.sanitizer.bypassSecurityTrustHtml(html);

    this.updateHtml(html);
  }


  private buildSvgFromPath(icon: UiIconDefinition) {
    if (!icon.path) {
      throw new Error('Missing Icon Path');
    }
    if (!icon.width) {
      throw new Error('Missing Icon Width');
    }
    if (!icon.height) {
      throw new Error('Missing Icon Height');
    }

    if (typeof icon.path !== 'string') {
      throw new TypeError(
        'Expected a single string path. Array of paths not implemented.',
      );
    }

    const isStroke = icon.stroke != null;

    const html =
      '<svg class="jsx-' + styles.__hash + '" xmlns="http://www.w3.org/2000/svg" width="' +
      icon.width +
      '" height="' +
      icon.height +
      '" viewBox="0 0 ' +
      icon.width +
      ' ' +
      icon.height +
      '" ' +
      (isStroke ? 'fill="none" stroke="currentColor"' : 'fill="currentColor"') +
      '>' +
      this.getSvgPathElement(icon) +
      '</svg>';

    // this.renderedIconHTML = this.sanitizer.bypassSecurityTrustHtml(html);

    this.updateHtml(html);
  }

  private getSvgPathElement(icon: UiIconDefinition) {
    const props: { [key: string]: string | number } = {};
    if (Array.isArray(icon.path)) {
      throw new TypeError('Expecting a single path');
    }

    if (icon.stroke != null) {
      if (icon.stroke.lineCap) {
        props['stroke-linecap'] = icon.stroke.lineCap;
      }
      if (icon.stroke.lineJoin) {
        props['stroke-linejoin'] = icon.stroke.lineJoin;
      }
      props['stroke-width'] = icon.stroke.width;
    }

    props.d = icon.path ?? '';

    const list: string[] = [];
    for (const key in props) {
      list.push(key + '="' + props[key] + '"');
    }

    return `<path ${list.join(' ')}/>`;
  }

  private getSvgPathElementFromString(pathString: string) {
    const props: { [key: string]: string | number } = {};
    if (Array.isArray(pathString)) {
      throw new TypeError('Expecting a single path');
    }

    props.d = pathString ?? '';

    const list: string[] = [];
    for (const key in props) {
      list.push(key + '="' + props[key] + '"');
    }
    return `<path ${list.join(' ')}/>`;
  }

  private getDataTestId() {
    if (this.props.icon) {
      return `${this.props.icon}-icon`;
    } else if (this.props.faIcon) {
      return `${this.props.faIcon.prefix}-${this.props.faIcon.iconName}`
    }
  }


  buttonClicked(event: React.MouseEvent<HTMLDivElement>) {
    if (this.props.onClick) {
      this.props.onClick(event);
    }
  }

  render() {
    let glowClass = '';

    // Check if the 'glow' property is set
    if (this.props.glow === true) {
      glowClass = 'iconGlow';  // this is the class name for the default glow effect
    } else if (typeof this.props.glow === 'string') {
      // Parse string for custom glow, this is just a placeholder.
      // You would need to parse and set the glow as inline style.
      const [offsetX, offsetY, blurRadius, color] = this.props.glow.split(' ');
      //...
    }

    // Merge iconStyles with glow styles, if any
    const combinedStyles = {
      ...this.state.iconStyles,
      ...(glowClass ? { textShadow: `0 0 5px ${this.state.iconStyles.color || 'currentColor'}` } : {})
    };

    return (
      <>
        <style jsx>{styles}</style>
        <div 
          className={glowClass} // Adding the glow class conditionally
          onClick={e => this.buttonClicked(e)}
          dangerouslySetInnerHTML={{ __html: this.state?.innerHtml }}
          style={combinedStyles}
          data-testid={this.getDataTestId()}
        />
      </>
    );
  }
}