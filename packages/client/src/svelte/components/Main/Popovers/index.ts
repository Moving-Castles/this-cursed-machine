export function renderComponent(
    selectContainerElement: HTMLElement,
    Component: any
) {
    const component = new Component({ target: selectContainerElement, })
    // Listen to the custom event we're dispatching
    component.$on("requestDestroy", () => {
        component.$destroy() // Actually destroy the component
    })
}