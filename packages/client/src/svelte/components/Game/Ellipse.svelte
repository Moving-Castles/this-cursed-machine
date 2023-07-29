<script>
  let dots = ["·", "··", "···", "····", "·····"]
  let current = 0
  setInterval(() => {
    current = (current + 1) % dots.length
  }, 100)
</script>

{dots[current]}
