<script>
  import Graph from "./Graph.svelte"
  import data from "./data.js"
</script>

<div class="chart">
  <Graph graph={data} />
</div>

<style>
  .chart {
    width: 100%;
    max-width: 640px;
    height: calc(100% - 4em);
    min-height: 280px;
    max-height: 480px;
    margin: 0 auto;
  }
</style>
