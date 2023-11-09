import { CSSProperties } from 'react';

export function classNames(obj: {[key: string]: (boolean | string)}): string {
  const classes: string[] = [];
  for (let key in obj) {
    const value = obj[key];
    if (typeof value == 'string') { if (value != null) { classes.push(key); } }
    else { if (value) { classes.push(key); } }
  }
  return classes.join(' ');
}

export function customStyles(obj: {[key: string]: (number | string)}): CSSProperties | undefined {
  const classes: string[] = [];
  for (let key in obj) {
    const value = obj[key];
    if (typeof value == 'string') { if (value != null) { classes.push(key); } }
    else { if (value) { classes.push(key); } }
  }
  return obj;
}



