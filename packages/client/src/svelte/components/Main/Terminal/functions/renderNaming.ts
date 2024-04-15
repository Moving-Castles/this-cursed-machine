import Naming from "@components/Main/Terminal/Naming.svelte"

export async function renderNaming(containerElement: HTMLDivElement): Promise<string | null> {
    return new Promise(resolve => {
        const component = new Naming({
            target: containerElement,
            props: {
                returnFunction: (value: string | null) => {
                    resolve(value)
                },
            },
        })
        // Listen to the custom event we're dispatching
        component.$on("requestDestroy", () => {
            component.$destroy() // Actually destroy the component
        })
    })
}