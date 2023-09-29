import tippy, {followCursor} from 'tippy.js';
import type { SingleTarget } from "tippy.js"

export const makeOptions = (content: any) => ({
  content,
  allowHTML: true,
  inertia: true,
  interactive: true,
  trigger: 'click',
  followCursor: 'initial',
  plugins: [followCursor]
})

type Params = {
  enable: boolean
}

export const t = function (element: SingleTarget, params?: Params) {
  function init (p?: Params) {
    const d = element.querySelector('.dialog')

    if (d) {
      tippy(element, makeOptions(d))
    }
  }

  init(params)

  return {
    update (newParams: Params) {
      // element?._tippy?.destroy()
      init(newParams)
    },
    destroy () {
      element._tippy.destroy()
    }
  }
}