export class TodoItem {
  public readonly id: number;
  public readonly description: string;

  constructor(id: number, description: string) {
    this.id = id;
    this.description = description;
  }
}

export class Context {
  public readonly id: number;
  public readonly name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class PingResult {
  isReachable: boolean;
  isAuthenticationWorking: boolean;

  constructor(isReachable: boolean, isAuthenticationWorking: boolean) {
    this.isReachable = isReachable;
    this.isAuthenticationWorking = isAuthenticationWorking;
  }

  public isValid(): boolean {
    return this.isReachable && this.isAuthenticationWorking;
  }
}
