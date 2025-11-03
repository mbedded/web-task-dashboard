import {Context, PingResult, TodoItem} from "./TodoClasses";
import {XMLParser} from 'fast-xml-parser';
import type { ITodoAdapter } from "./ITodoAdapter";

export class TracksAdapter implements ITodoAdapter {

  private readonly xmlParser = new XMLParser({
    ignoreDeclaration: true
  });

  constructor(private baseUrl: string,
              private basicToken: string) {
  }

  public async Ping(): Promise<PingResult> {
    const url = `${this.baseUrl}/todos/1.xml`;

    const request = new Request(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${this.basicToken}`
      }
    });

    try {
      const response = await fetch(request);

      if (response.status === 401) {
        return new PingResult(true, false);
      }

      // todo: how to handle server issues HTTP-5xx

      return new PingResult(true, true);
    } catch (e) {
      // todo: check obsidian docs how to log
      console.error(e);
      return new PingResult(false, false);
    }
  }

  public async GetContexts(): Promise<Context[]> {
    const url = `${this.baseUrl}/contexts.xml`;

    const request = new Request(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${this.basicToken}`
      }
    });

    let contextAsJson;
    try {
      const response = await fetch(request);
      const txt = await response.text();

      // todo: filter for active contexts
      contextAsJson = this.xmlParser.parse(txt);
    } catch (e) {
      // todo: handle error
      console.error(e);
      return [];
    }

    const items: Context[] = [];

    for (const item of contextAsJson.contexts.context) {
      const ctx = new Context(item.id, item.name);
      items.push(ctx);
    }

    return items;
  }


  public async GetTodos(): Promise<TodoItem[]> {
    const url = `${this.baseUrl}/todos.xml`;

    const request = new Request(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${this.basicToken}`
      }
    });

    let todosAsJson;
    try {
      const response = await fetch(request);
      const txt = await response.text();

      // todo: filter for active todos
      todosAsJson = this.xmlParser.parse(txt);
    } catch (e) {
      // todo: handle error
      console.error(e);
      return [];
    }

    const items: TodoItem[] = [];

    for (const item of todosAsJson.todos.todo) {
      const todo = new TodoItem(item.id, item.description);
      items.push(todo);
    }

    return items;
  }

}
