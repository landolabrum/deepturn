interface IDependencyConfig {
}

class DependencyContainer {

  constructor(private config: IDependencyConfig) {
  }

  private serviceTypes: { [key: string]: new () => any } = {};

  private serviceInstances: { [key: string]: any } = {};

  public registerService(key: string, type: new () => any) {
    this.serviceTypes[key] = type;
  }

  public registerInstance(key: string, instance: any) {
    this.serviceInstances[key] = instance;
  }

  public getService<T>(key: string): T {
    if (this.serviceInstances[key] != null) { return this.serviceInstances[key]; }
    const type = this.serviceTypes[key];
    if (type == null) { throw new Error('Type Not Registered: ' + key); }
    const svc = new type();
    this.serviceInstances[key] = svc;
    return svc;
  }
}

export const serviceProvider = new DependencyContainer({});

export function getService<T>(key: string): T {
  return serviceProvider.getService<T>(key);
}