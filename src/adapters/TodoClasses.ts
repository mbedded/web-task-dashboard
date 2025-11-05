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
  isAuthenticated: boolean;
  message: string;

  constructor(isReachable: boolean, isAuthenticated: boolean, message: string = "") {
    this.isReachable = isReachable;
    this.isAuthenticated = isAuthenticated;
    this.message = message;
  }

  public isOk(): boolean {
    return this.isReachable && this.isAuthenticated;
  }
}
