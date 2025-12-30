<script lang="ts">
  import type { ITodoAdapter } from "../adapters/ITodoAdapter";
  import { t } from "localizify";
  import { ContextItem } from "../adapters/TodoClasses";
  import SpinnerComponent from "./SpinnerComponent.svelte";
  import ContextComponent from "./ContextComponent.svelte";
  import ErrorComponent from "./ErrorComponent.svelte";

  interface Props {
    adapter: ITodoAdapter;
  }

  let {
    adapter,
  }: Props = $props();

  let loading = $state(true);

  let hasError = $state(false);
  let errorHeader = $state("error-header");
  let errorMessage = $state("error-message");

  let contexts: ContextItem[] = $state([]);

  export async function initializeView() {
    loading = true;
    hasError = false;

    // Check if service is reachable
    var pingResult = await adapter.Ping();

    if (pingResult.isReachable == false) {
      errorHeader = t("messages.service-unreachable-header");
      errorMessage = t("messages.service-unreachable-description");
    }
    if (pingResult.isAuthenticated == false) {
      errorHeader = t("messages.service-authentication-failed-header");
      errorMessage = t("messages.service-authentication-failed-description");
    }
    if (pingResult.isOk() == false) {
      loading = false;
      hasError = true;

      return;
    }

    // Initialize view
    contexts = await adapter.GetActiveContexts();

    loading = false;
  }

</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    width: 100%;
  }

  .placeholder {
    /* todo: use text muted and obsidian css for border */
    border-top: 1px solid var(--color-base-20);
    margin-top: auto;
    align-content: center;
    color: var(--color-base-50);
    font-size: 0.7em;
  }
</style>

<!-- todo: localize view -->

{#if loading}
  <SpinnerComponent text="Loading contexts…"/>
{/if}


<!-- todo: localize view -->

<div class="container">
  {#if loading}
    <SpinnerComponent text="Loading contexts…"/>
  {/if}


  {#if !loading && !hasError}
    <!-- todo: show hint  when context == empty-->

    {#each contexts as context}
      <ContextComponent adapter={adapter} context={context}/>
    {/each}
  {/if}


  {#if hasError}
    <ErrorComponent header={errorHeader} message={errorMessage}/>
    <!-- todo: add reload button so user can press button instead of close/open tab -->
  {/if}

  <!-- General information for the user -->
  <div class="placeholder">
    <p>Backend: {adapter.GetDisplayInfo()}</p>
  </div>

</div>




