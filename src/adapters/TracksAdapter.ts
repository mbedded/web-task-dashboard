import { ContextItem, PingResult, TodoItem } from "./TodoClasses";
import { XMLParser } from "fast-xml-parser";
import type { ITodoAdapter } from "./ITodoAdapter";
import { t } from "../localizer/localizer";
import type { RequestUrlParam, RequestUrlResponsePromise } from "obsidian";

/**
 * This adapter implements the ITodoAdapter interface for Tracks.
 */
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

  public getDisplayInfo(): string {
    return `Tracks (${this.baseUrl})`;
  }

  public async ping(): Promise<PingResult> {
    try {
      const response = await this.doRequest({
        url: `${this.baseUrl}/contexts.xml`,
        method: "GET",
        headers: {
          "Authorization": `Basic ${this.basicToken}`
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

  public async getActiveContexts(): Promise<ContextItem[]> {
    let contextAsJson;
    try {
      const response = await this.doRequest({
        url: `${this.baseUrl}/contexts.xml`,
        method: "GET",
        headers: {
          "Authorization": `Basic ${this.basicToken}`
        }
      });

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


  public async getActiveTodos(contextId: number): Promise<TodoItem[]> {
    let todosAsJson;
    try {
      const response = await this.doRequest({
        url: `${this.baseUrl}/contexts/${contextId}/todos.xml?limit_to_active_todos=1`,
        method: "GET",
        headers: {
          "Authorization": `Basic ${this.basicToken}`
        }
      });

      todosAsJson = this.xmlParser.parse(response.text);
    } catch (e) {
      // todo: handle error
      console.error("error getting todos" + e);
      return [];
    }

    // Array of a single object is returned as a single object
    // instead of using an array. So we need 2 checks: Empty and array.
    let todos = todosAsJson?.todos?.todo;
    if (!todos) {
      return [];
    }
    if (!Array.isArray(todos)) {
      todos = [todos];
    }

    return todos.map((x: any) => new TodoItem(x.id, x.description));
  }

  public async toggleTodoState(todoId: number): Promise<boolean> {
    try {
      await this.doRequest({
        // We can use this shortcut to toggle the state between active and completed.
        url: `${this.baseUrl}/todos/${todoId}/toggle_check.xml`,
        method: "PUT",
        headers: {
          "Authorization": `Basic ${this.basicToken}`,
          "Content-Type": "text/xml"
        }
      });

    } catch (e) {
      console.error("error toggle todo" + e);
      return false;
    }
    return true;
  }

  public async createTodo(contextId: number, text: string): Promise<TodoItem> {
    try {
      const xmlBody = `<todo>
    <description>${text}</description>
    <context-id>${contextId}</context-id>
  </todo>`;

      const response = await this.doRequest({
        url: `${this.baseUrl}/todos.xml`,
        method: "POST",
        body: xmlBody,
        headers: {
          "Authorization": `Basic ${this.basicToken}`,
          "Content-Type": "text/xml"
        }
      });

      const location = response.headers.location;
      const parts = location.split("/");
      const newId = parseInt(parts[parts.length - 1], 10);

      return new TodoItem(newId, text);
    } catch (e) {
      // todo: handle error
      console.error("error creating todo: " + e);
      throw e;
    }
  }

  public async deleteTodo(todoId: number): Promise<boolean> {
    try {
      await this.doRequest({
        url: `${this.baseUrl}/todos/${todoId}.xml`,
        method: "DELETE",
        headers: {
          "Authorization": `Basic ${this.basicToken}`,
        }
      });
      return true;
    } catch (e) {
      console.error("error deleting todo: " + e);
      return false;
    }
  }
  
}
