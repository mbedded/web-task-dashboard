import { ContextItem, PingResult, TodoItem } from "./TodoClasses";
import { XMLParser } from 'fast-xml-parser';
import type { ITodoAdapter } from "./ITodoAdapter";
import { t } from "localizify";
import type { RequestUrlParam, RequestUrlResponsePromise } from "obsidian";

export class TracksAdapter implements ITodoAdapter {

  private readonly xmlParser = new XMLParser({
    ignoreDeclaration: true
  });

  /**
   * Creates a new instance.
   * @param baseUrl The base url to reach Tracks.
   * @param basicToken The basic token (base64) to access Tracks.
   * @param doRequest The method to execute the request. Passed as a parameter to be unit-testable.
   */
  constructor(private baseUrl: string,
              private basicToken: string,
              private doRequest: (request: RequestUrlParam | string) => RequestUrlResponsePromise) {
  }

  // public async Ping(): Promise<PingResult> {
  //   // const url = `${this.baseUrl}/todos/1.xml`;
  //   const url = `${this.baseUrl}/contexts.xml`;
  //
  //   const request = new Request(url, {
  //     mode: 'no-cors',
  //     method: "GET",
  //     headers: {
  //       Authorization: `Basic ${this.basicToken}`
  //     }
  //   });
  //
  //   try {
  //     await fetch(request);
  //     return new PingResult(true, true);
  //   } catch (ex) {
  //     // 401 = auth failed
  //     if (ex.status === 401) {
  //       return new PingResult(true, false);
  //     }
  //
  //     // 403 or 404 = auth ok but item not existing
  //     if (ex.status === 403 || ex.status === 404) {
  //       return new PingResult(true, false);
  //     }
  //
  //     // 5xx = server error
  //     if (ex.status >= 500 && ex.status <= 599) {
  //       return new PingResult(false, false, "server returned http-500");
  //     }
  //
  //     return new PingResult(false, false);
  //   }
  // }

  public async Ping(): Promise<PingResult> {
    try {
      let response = await this.doRequest({
        // url: `${this.baseUrl}/todos/1.xml`,
        url: `${this.baseUrl}/contexts.xml`,
        method: 'GET',
        headers: {
          'Authorization': `Basic ${this.basicToken}`
        }
      });

      return new PingResult(true, true);
    } catch (ex) {
      // 401 = auth failed
      if (ex.status === 401) {
        return new PingResult(true, false);
      }

      // 404 = (task) not found
      if (ex.status === 404) {
        return new PingResult(true, true);
      }

      // 5xx = server error
      if (ex.status >= 500 && ex.status <= 599) {
        const message = t("messages.server-http-error", {code: ex.status.toString()});
        return new PingResult(true, false, message);
      }

      return new PingResult(false, false);
    }
  }

  public async GetContexts(): Promise<ContextItem[]> {
    let contextAsJson;
    try {
      let response = await this.doRequest({
        url: `${this.baseUrl}/contexts.xml`,
        method: 'GET',
        headers: {
          'Authorization': `Basic ${this.basicToken}`
        }
      });

      // todo: filter for active contexts
      contextAsJson = this.xmlParser.parse(response.text);
    } catch (e) {
      // todo: handle error
      console.error(e);
      return [];
    }

    const items: ContextItem[] = [];

    for (const item of contextAsJson.contexts.context) {
      const ctx = new ContextItem(item.id, item.name);
      items.push(ctx);
    }

    return items;
  }


  public async GetTodos(): Promise<TodoItem[]> {
    let todosAsJson;
    try {
      let response = await this.doRequest({
        url: `${this.baseUrl}/todos.xml`,
        method: 'GET',
        headers: {
          'Authorization': `Basic ${this.basicToken}`
        }
      });

      // todo: filter for active todos
      todosAsJson = this.xmlParser.parse(response.text);
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
