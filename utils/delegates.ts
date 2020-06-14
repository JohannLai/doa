export function delegates(proto: any, target: string): Delegator {
  return new Delegator(proto, target);
}

export class Delegator {
  private proto: any;
  private target: string;

  private methods: string[] = [];
  private getters: string[] = [];
  private setters: string[] = [];

  constructor(proto: any, target: string) {
    this.proto = proto;
    this.target = target;
  }

  method(name: string): Delegator {
    const proto = this.proto as any;
    const target = this.target;
    this.methods.push(name);

    proto[name] = function (...argv: any) {
      return this[target][name].apply(this[target], argv);
    };

    return this;
  }

  access(name: string) {
    return this.getter(name).setter(name);
  }

  getter(name: string): Delegator {
    const proto = this.proto as any;
    const target = this.target;
    this.getters.push(name);

    // https://github.com/Microsoft/TypeScript/issues/16016
    proto.__defineGetter__(name, function (this: any) {
      return this[target][name];
    });

    return this;
  }

  setter(name: string): Delegator {
    const proto = this.proto as any;
    const target = this.target;
    this.setters.push(name);

    proto.__defineSetter__(name, function (this: any, val: any) {
      return this[target][name] = val;
    });

    return this;
  }
}
