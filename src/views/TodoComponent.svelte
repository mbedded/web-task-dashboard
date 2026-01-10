<script lang="ts">
  import { TodoItem } from "../adapters/TodoClasses";

  interface Props {
    // The entry to display and interact with.
    todo: TodoItem;
    // Function (callback to parent) to mark an entry as done.
    markTodoAsDone: (x: TodoItem) => Promise<void>
    // Function (callback to parent) to delete entry.
    deleteTodo: (x: TodoItem) => Promise<void>
  }

  let {
    todo,
    markTodoAsDone,
    deleteTodo
  }: Props = $props();

  let doneRunning = $state(false);
  let deleteRunning = $state(false);

  async function OnClickDone() {
    doneRunning = true;
    await markTodoAsDone(todo);
    doneRunning = false;
  }

  async function OnClickDelete() {
    deleteRunning = true;
    await deleteTodo(todo);
    deleteRunning = false;
  }
</script>

<style>
  .container {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    position: relative;

    &:hover {
      background-color: var(--color-base-30);

      .btn-delete {
        opacity: 1;
      }
    }
  }

  .btn-done {
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
  }

  .btn-delete {
    background-color: var(--background-modifier-error);
    color: var(--text-on-accent);
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .description {
    flex: 1;
    margin-left: 5px;
    margin-right: 10px;
  }

  .spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid var(--text-on-accent);
    border-top: 2px transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>

<div class="container">
  <button type="button" class="btn-done" onclick={OnClickDone}>
    {#if !doneRunning}
      ✓
    {:else}
      <div class="spinner"></div>
    {/if}
  </button>
  <span class="description">{todo.description}</span>
  <button type="button" class="btn-delete" onclick={OnClickDelete}>
    {#if !deleteRunning}
      Delete
    {:else}
      <div class="spinner"></div>
    {/if}
  </button>
</div>

