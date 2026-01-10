import { ContextItem, PingResult, TaskItem } from "./TodoClasses";

/**
 * This interface defines the general interfaces for adapters, so any
 * task-list-endpoint could be added in the future.
 */
export interface ITaskAdapter {

  /**
   * Returns a human-readable name for the adapter.
   */
  getDisplayInfo(): string;

  /**
   * Sends a ping request to verify connectivity or the responsiveness of a service.
   *
   * @return {Promise<PingResult>} A promise that resolves with the result of the ping operation, containing details
   * about the response such as the status and latency, or rejects if the operation fails.
   */
  ping(): Promise<PingResult>;

  /**
   * Retrieves a list of active contexts asynchronously.
   *
   * @return {Promise<Context[]>} A promise that resolves to an array of context objects.
   */
  getActiveContexts(): Promise<ContextItem[]>;

  /**
   * Retrieves a list of todo items for a given context.
   *
   * @return {Promise<TaskItem[]>} A promise that resolves to an array of Todo objects.
   */
  getActiveTasks(contextId: number): Promise<TaskItem[]>

  /**
   * Toggles the state of a specific todo item between active and completed.
   *
   * @param {number} todoId - The unique identifier of the todo item to toggle..
   * @return {Promise<boolean>} A promise that resolves to a boolean indicating whether the operation was successful.
   */
  toggleTaskState(todoId: number): Promise<boolean>

  /**
   * Creates a new todo item in the specified context.
   *
   * @param {number} contextId - The ID of the context to add the todo to.
   * @param {string} text - The text/content of the new todo.
   * @return {Promise<TaskItem>} A promise that resolves to the newly created TodoItem.
   */
  createTask(contextId: number, text: string): Promise<TaskItem>

  /**
   * Deletes a specific todo item.
   *
   * @param {number} todoId - The unique identifier of the todo item to delete.
   * @return {Promise<boolean>} A promise that resolves to a boolean indicating whether the operation was successful.
   */
  deleteTask(todoId: number): Promise<boolean>

}
