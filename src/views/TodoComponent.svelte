<script lang="ts">
  import { TodoItem } from "../adapters/TodoClasses";

  interface Props {
    // The entry to display and interact with.
    todo: TodoItem;
    // Function (callback to parent) to mark an entry as done.
    markTodoAsDone: (x: TodoItem) => Promise<boolean>
  }

  let {
    todo,
    markTodoAsDone
  }: Props = $props();

  let actionRunning = $state(false);

  async function OnClickDone() {
    actionRunning = true;
    await markTodoAsDone(todo);
    actionRunning = false;
  }
</script>

<style>
  .container {
    margin-bottom: 5px;
  }

  .btn-done {
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
    /* todo: check or delete style */
    /*background-color: var(--interactive-normal);*/
    /*color: var(--text-normal);*/
  }

  .description {
    margin-left: 5px;
    vertical-align: center;
  }

  .spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid var(--background-modifier-border);
    border-top: 2px solid var(--interactive-accent);
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
    {#if !actionRunning}
      ✓
    {:else}
      <div class="spinner"></div>
    {/if}
  </button>
  <span class="description">{todo.description}</span>
</div>

