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

  public async Ping(): Promise<PingResult> {
    try {
      let response = await this.doRequest({
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

  public async GetActiveContexts(): Promise<ContextItem[]> {
    let contextAsJson;
    try {
      let response = await this.doRequest({
        url: `${this.baseUrl}/contexts.xml?limit_to_active_todos=1`,
        method: 'GET',
        headers: {
          'Authorization': `Basic ${this.basicToken}`
        }
      });

      // todo: filter for active contexts
      contextAsJson = this.xmlParser.parse(response.text);
    } catch (e) {
      // todo: handle error
      console.error("error getting contexts - " + e);
      return [];
    }

    return contextAsJson.contexts.context
      .filter((x: any) => x.state === "active")
      .map((x: any) => new ContextItem(x.id, x.name))
      .sort((a: any, b: any) => a.name.localeCompare(b.name));
  }


  public async GetActiveTodos(contextId: number): Promise<TodoItem[]> {
    let todosAsJson;
    try {
      let response = await this.doRequest({
        url: `${this.baseUrl}/contexts/${contextId}/todos.xml?limit_to_active_todos=1`,
        method: 'GET',
        headers: {
          'Authorization': `Basic ${this.basicToken}`
        }
      });

      // todo: filter for active todos
      todosAsJson = this.xmlParser.parse(response.text);
    } catch (e) {
      // todo: handle error
      console.error("error getting todos" + e);
      return [];
    }

    if (Array.isArray(todosAsJson?.todos?.todo) == false){
      return [];
    }

    return todosAsJson.todos.todo
      .map((x: any) => new TodoItem(x.id, x.description));
  }

}
