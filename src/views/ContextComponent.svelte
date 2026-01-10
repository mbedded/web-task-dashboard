<script lang="ts">
  import { type ContextItem, TodoItem } from "../adapters/TodoClasses";
  import type { ITodoAdapter } from "../adapters/ITodoAdapter";
  import { onMount } from "svelte";
  import SpinnerComponent from "./SpinnerComponent.svelte";
  import TodoComponent from "./TodoComponent.svelte";

  interface Props {
    adapter: ITodoAdapter;
    context: ContextItem;
  }

  let {
    context,
    adapter,
  }: Props = $props();

  let isLoading = $state(false);
  let isSaving = $state(false);
  let todos: TodoItem[] = $state([]);
  let newTodoText = $state("");

  onMount(async () => {
    await initialize()
  });

  async function initialize() {
    isLoading = true;
    todos = await adapter.getActiveTodos(context.id);
    isLoading = false;
  }

  async function markTodoAsDone(todo: TodoItem): Promise<void> {
    let result = await adapter.toggleTodoState(todo.id);

    if (result) {
      todos = todos.filter(x => x.id !== todo.id);
    }
  }

  async function deleteTodo(todo: TodoItem): Promise<void> {
    let result = await adapter.deleteTodo(todo.id);

    if (result) {
      todos = todos.filter(x => x.id !== todo.id);
    }
  }

  async function onTxtNewTodoKeyDown(e: KeyboardEvent) {
    if (e.key !== "Enter") {
      return;
    }

    if (!newTodoText.trim()) {
      return;
    }

    isSaving = true;
    try {
      let newTodo = await adapter.createTodo(context.id, newTodoText);

      if (newTodo) {
        todos = [...todos, newTodo];
        newTodoText = "";
      }
    } finally {
      isSaving = false;
    }
  }
</script>

<style>
  .container {
    border: 1px solid var(--background-modifier-border);
    padding: 5px 10px;
    margin: 5px;
  }

  .header {
    margin: 0 0 10px 0;
    font-weight: var(--bold-weight);
    color: var(--text-normal);
    font-size: var(--font-ui-large);
    line-height: var(--line-height-normal);

    span {
      color: var(--text-faint);
    }
  }

  .no-todos-existing {
    color: var(--text-muted);
  }

  .txt-new-todo {
    width: 100%;
  }
</style>

<!-- todo: localize view -->
<div class="container">
  <p class="header">{context.name} <span>({todos.length})</span></p>

  {#if isLoading}
    <SpinnerComponent text="Loading todos…"/>
  {/if}

  {#if !!todos && todos.length }
    {#each todos as todo (todo.id)}
      <TodoComponent todo={todo}
                     markTodoAsDone={markTodoAsDone}
                     deleteTodo={deleteTodo}/>
    {/each}

  {:else}
    <p class="no-todos-existing">No todos existing</p>
  {/if}

  <input class="txt-new-todo"
         type="text"
         bind:value={newTodoText}
         onkeydown={onTxtNewTodoKeyDown}
         placeholder="Add new todo. Confirm with RETURN…"
         readonly={isSaving}/>

  {#if isSaving}
    <SpinnerComponent text="Saving..."/>
  {/if}

</div>
