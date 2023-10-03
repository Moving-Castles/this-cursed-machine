<script lang="ts">
</script>

<div class="bouncing-suffer">
  <img
    class="animate__animated animate__bounce animate__infinite"
    src="/suffer.png"
    alt="loading"
  />
</div>

<style lang="scss">
  .bouncing-suffer {
    width: 200px;
    height: 200px;
    mix-blend-mode: lighten;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: bottom left;
    }
  }
</style>
