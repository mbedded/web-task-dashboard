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

  let loading = $state(false);
  let todos: TodoItem[] = $state([]);

  onMount(async () => {
    await initialize()
  });

  async function initialize() {
    loading = true;
    todos = await adapter.GetActiveTodos(context.id);
    loading = false;
  }

  async function markTodoAsDone(todo: TodoItem): Promise<boolean> {
    let result = await adapter.ToggleTodoState(todo.id);

    if (result) {
      todos = todos.filter(x => x.id !== todo.id);
    }

    return result;
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
</style>

<!-- todo: localize view -->
<div class="container">
  <p class="header">{context.name} <span>({todos.length})</span></p>

  {#if loading}
    <SpinnerComponent text="Loading todos…"/>
  {/if}

  {#if !!todos && todos.length }
    {#each todos as todo (todo.id)}
      <TodoComponent todo={todo} markTodoAsDone={markTodoAsDone}/>
    {/each}

  {:else}
    <p class="no-todos-existing">No todos existing</p>
  {/if}

  <!-- todo: add textbox to add/create new todo -->

</div>
