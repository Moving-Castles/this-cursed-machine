<script lang="ts">
  export let action: string
  export let params: any[] = []
</script>

<span class="action">
  <slot />
</span>

<style lang="scss">
  .action {
    text-decoration: underline;
  }
</style>
