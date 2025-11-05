<script lang="ts">
  import TodoContext from "./TodoContext.svelte";
  import Spinner from "./Spinner.svelte";
  import type { ITodoAdapter } from "../adapters/ITodoAdapter";
  import Error from "./Error.svelte";
  import { t } from "localizify";

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

  let components: string[] = $state([]);

  export async function initializeView() {
    loading = true;
    hasError = false;

    debugger

    // Check if service is reachable
    var pingResult = await adapter.Ping();

    console.log("result ping");
    console.log(pingResult);

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

    hasError = true;
    errorHeader = "alles ok!";
    // Initialize view


  }

</script>

{#if loading}
  <Spinner text="Loading tasks…"/>
{/if}


{#if !loading}
  COMPONENTS
{/if}


<!--{#each components as item}-->
<!--  <TodoContext text={item}/>-->
<!--{/each}-->
{#if hasError}
  <Error header={errorHeader} message={errorMessage}/>
{/if}



