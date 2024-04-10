<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import { interpolateRgb, interpolateNumber } from "d3-interpolate"
  import { range } from "d3-array"
  import { tweened } from "svelte/motion"
  import * as easing from "svelte/easing"

  export let d: string
  export let productive = false
  export let carrying = false

  // @todo: Map different materials to different easings
  const easingMap = {
    0: easing.bounceInOut,
  }

  let offset = tweened(0, { duration: 1000, easing: easingMap[0] })
  let interval: ReturnType<typeof setInterval>
  let pathNode: SVGPathElement
  let inverse: ReturnType<typeof interpolateNumber>
  let parts = []
  let fillColor = "grey"

  function mod(n, m) {
    return ((n % m) + m) % m
  }

  const tick = () => {
    let fromColor = "#fff"
    if (carrying) fromColor = "#a4fa3b"
    if (productive) fromColor = "#00e5ff"

    console.log(fromColor)
    let toColor = "#ffff"
    let color = interpolateRgb(fromColor, toColor)

    parts = quads(samples(pathNode, 2)).map(q => {
      const num = q.t
      const c = color(mod(num - $offset, 1))
      return {
        fill: c,
        stroke: c,
        d: lineJoin(q[0], q[1], q[2], q[3], 4),
      }
    })
  }

  // Sample the SVG path uniformly with the specified precision.
  function samples(path: SVGPathElement, precision: number) {
    let n = path.getTotalLength(),
      t = [0],
      i = 0,
      dt = precision
    while ((i += dt) < n) t.push(i)
    t.push(n)
    return t.map(function (t) {
      let p = path.getPointAtLength(t),
        a = [p.x, p.y]

      a.t = t / n
      return a
    })
  }

  // Compute quads of adjacent points [p0, p1, p2, p3].
  function quads(points: number[]) {
    return range(points.length - 1).map(function (i) {
      let a = [points[i - 1], points[i], points[i + 1], points[i + 2]]
      a.t = (points[i].t + points[i + 1].t) / 2
      return a
    })
  }

  // Compute stroke outline for segment p12.
  function lineJoin(p0, p1, p2, p3, width) {
    let u12 = perp(p1, p2),
      r = width / 2,
      a = [p1[0] + u12[0] * r, p1[1] + u12[1] * r],
      b = [p2[0] + u12[0] * r, p2[1] + u12[1] * r],
      c = [p2[0] - u12[0] * r, p2[1] - u12[1] * r],
      d = [p1[0] - u12[0] * r, p1[1] - u12[1] * r]

    if (p0) {
      // clip ad and dc using average of u01 and u12
      let u01 = perp(p0, p1),
        e = [p1[0] + u01[0] + u12[0], p1[1] + u01[1] + u12[1]]
      a = lineIntersect(p1, e, a, b)
      d = lineIntersect(p1, e, d, c)
    }

    if (p3) {
      // clip ab and dc using average of u12 and u23
      let u23 = perp(p2, p3),
        e = [p2[0] + u23[0] + u12[0], p2[1] + u23[1] + u12[1]]
      b = lineIntersect(p2, e, a, b)
      c = lineIntersect(p2, e, d, c)
    }

    return "M" + a + "L" + b + " " + c + " " + d + "Z"
  }

  // Compute intersection of two infticke lines ab and cd.
  function lineIntersect(a, b, c, d) {
    let x1 = c[0],
      x3 = a[0],
      x21 = d[0] - x1,
      x43 = b[0] - x3,
      y1 = c[1],
      y3 = a[1],
      y21 = d[1] - y1,
      y43 = b[1] - y3,
      ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21)
    return [x1 + ua * x21, y1 + ua * y21]
  }

  // Compute unit vector perpendicular to p01.
  function perp(p0, p1) {
    let u01x = p0[1] - p1[1],
      u01y = p1[0] - p0[0],
      u01d = Math.sqrt(u01x * u01x + u01y * u01y)
    return [u01x / u01d, u01y / u01d]
  }

  $: if ($offset) tick()

  onMount(() => {
    inverse = interpolateNumber(1, 0)
    tick()
    interval = setInterval(() => {
      $offset++
    }, 1000)
  })
  onDestroy(() => {
    clearInterval(interval)
  })
</script>

<path bind:this={pathNode} {d} fill="none" stroke="none" />

<!-- The clip path for this element is defined in the parent container -->
{#if parts.length > 0}
  {#each parts as part}
    <path class="segment" d={part.d} stroke={part.stroke} fill={part.fill} />
  {/each}
{/if}

<style>
  .segment {
    /* mix-blend-mode: screen; */
  }
</style>
