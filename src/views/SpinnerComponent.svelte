<script lang="ts">
  export let text: string;
</script>

<style>
  .container {
    display: flex;
    align-items: center;
    margin-top: 10px;

    span {
      margin-left: 10px;
    }
  }

  .spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: var(--background-modifier-border);
    border-top: 4px solid var(--interactive-accent);
    border-radius: 50%;
    animation: spin 1.5s linear infinite;
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

<div class='container'>
  <div class="spinner"></div>
  <span>{text}</span>
</div>
