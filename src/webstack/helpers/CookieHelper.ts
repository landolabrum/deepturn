export default class CookieHelper {

  public static getCookies(): {[key: string]: string} {
    if (typeof window !== 'object') { return {}; }
    const cookieString = document.cookie;
    if (cookieString == null || cookieString.length === 0) { return {}; }
    const cookies: {[key: string]: string} = {};
    const cookieArray = cookieString.split(';')
    for (let cookie of cookieArray) {
      const eq = cookie.indexOf('=');
      if (eq > 0) {
        cookies[cookie.substring(0, eq).trim()] = cookie.substring(eq + 1).trim();
      }
    }
    return cookies;
  }

  public static getCookie(name: string): string | undefined {
    const cookies = this.getCookies();
    return cookies[name];
  }
  public static setCookie(name: string, value: string, props:{[key: string]:string}) {
    const propArray: string[] = [];
    propArray.push(`${name}=${value}`);
  
    for (let key in props) {
      propArray.push(`${key}=${props[key]}`);
    }
    document.cookie = propArray.join(';');
    
    // Dispatch a custom event when a cookie is set
    const event = new CustomEvent('cookieChange', { detail: { cookieName: name } });
    window.dispatchEvent(event);
  }
  public static deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
    // Dispatch a custom event when a cookie is deleted
    const event = new CustomEvent('cookieChange', { detail: { cookieName: name } });
    window.dispatchEvent(event);
  }
  // public static setCookie(name: string, value: string, props:{[key: string]:string}) {
  //   const propArray: string[] = [];
  //   propArray.push(`${name}=${value}`);

  //   for (let key in props) {
  //     propArray.push(`${key}=${props[key]}`);
  //   }
  //   document.cookie = propArray.join(';');
  // }

}