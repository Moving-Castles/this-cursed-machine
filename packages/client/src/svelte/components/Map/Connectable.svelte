<script lang="ts">
  export let available = false
  export let active = false

  let padding = "8px"

  const onMouseEnter = () => available = true

  const onMouseLeave = () => available = false
</script>

<div class="connectable" style="--padding: {padding}" on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave}>
  <div class:available class:active class="port top" />
  <div class:available class:active class="port bottom" />
  <div class:available class:active class="port left" />
  <div class:available class:active class="port right" />
  <slot />
</div>

<style lang="scss">
  .connectable {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .port {
    position: absolute;
    width: 20px;
    height: 8px;
    z-index: 9;;
    background: white;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease;
  }
  
  @mixin portInActiveTransform ($deg) {
    transform: translate(-50%, -50%) rotate($deg);
  }
  
  @mixin portAvailableTransform ($deg) {
    transform: translate(-50%, -50%) rotate($deg) translate(0, calc(var(--tilesize) / 2)) translateY(calc(var(--padding) * -1));
  }


  /* States:          */
  /* Inactive:        */
  /*                  */
  /* Available        */
  /*                  */
  /* Active           */
  /*                  */
  .port.bottom {
    @include portInActiveTransform(0deg);

    &.available {
      @include portAvailableTransform(0deg);
    }
  }
  .port.left {
    @include portInActiveTransform(90deg);

    &.available {
      @include portAvailableTransform(90deg);
    }
  }
  .port.top {
    @include portInActiveTransform(180deg);

    &.available {
      @include portAvailableTransform(180deg);
    }
  }
  .port.right {
    @include portInActiveTransform(270deg);

    &.available {
      @include portAvailableTransform(270deg);
    }
  }

</style>