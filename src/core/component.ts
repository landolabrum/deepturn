
// Replaces a component member with a property (getter and setter)
// getter reads from state, setState called automatically by setter
export function StateProperty() {
  return function (target: any, propName: string) {
    if (target._stateVars == null) { target._stateVars = []; }
    target._stateVars.push(propName);
  }
}

// Binds a member function to component. replaces need for: this.method = this.method.bind(this);
export function Bind() {
  return function (target: any, methodName: string) {
    if (target._bindMethods == null) { target._bindMethods = []; }
    target._bindMethods.push(methodName);
  }
}

export function Component() {
  return function <T extends { new(...args: any[]): {} }>(ctor: T) {
    return class extends ctor {
      constructor(...args: any[]) {
        super(...args);
        defineStateProperties(this);
        autoBind(this);
      }
    };
  }
}

function autoBind(target: any) {
  if (target._bindMethods == null) { return; }
  for (const methodName of target._bindMethods) {
    target[methodName] = target[methodName].bind(target);
  }
}

function defineStateProperties(target: any) {
  if (target._stateVars == null) { return; }
  for (const stateVar of target._stateVars) {
    defineStateProperty(target, stateVar, target[stateVar]);
  }
}

function defineStateProperty<T>(target: any, propName: string, value: T) {
  if (target.state == null) { target.state = {}; }
  Object.defineProperty(target, propName, {
    get: function () {
      return target.state?.[propName];
    },
    set: function (value) {
      // Change state directly so getter returns new value immediately
      // Changing state directly is discouraged, but seems to work without side-effects. May need additional validation.
      target.state[propName] = value;
      target.setState({ [propName]: value });
    },
    configurable: true,
  });
  target.state[propName] = value;
}

export function allowDeepStyles(css: CompiledCss): CompiledCss {
  const style: CompiledCss = new String(css.toString().replace(/.jsx-[0-9]+:deep\(([^\)]*)\)/g,'$1'));
  style.__hash = css.__hash;
  return style;
}