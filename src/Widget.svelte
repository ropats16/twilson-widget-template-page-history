<script>
  import Modal from "./components/modal.svelte";
  import { pageHistory } from "./lib/history";

  let historyDialog = false;
  let txId = window.transactionId;

  async function handleClick() {
    historyDialog = true;
  }
</script>

<button class="btn btn-primary w-full" on:click={handleClick}
  >Show page history
</button>
<Modal open={historyDialog} on:click={() => (historyDialog = false)}>
  <h2 class="text-xl mb-8">Permapage History</h2>
  {#await pageHistory(txId)}
    Loading...
  {:then hx}
    <table class="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Status</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        {#each hx as page}
          <tr>
            <td>{page.timestamp}</td>
            <td>{page.status}</td>
            <td>
              <a
                class="link"
                href="https://arweave.net/{page.webpage}"
                target="_blank"
              >
                LINK
              </a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:catch err}
    ERROR: {err.message}
  {/await}
</Modal>
