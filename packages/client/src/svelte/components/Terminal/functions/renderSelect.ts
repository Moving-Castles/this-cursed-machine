
import { MachineType } from "../../../modules/state/enums"
import { SelectOption } from "../types"

/**
 * Renders a select component and resolves a promise when a value is selected.
 * @param {SelectOption[]} selectOptions - Array of options for the select component.
 * @param {HTMLDivElement} selectContainerElement - The container element for the select component.
 * @param {any} Select - The select component to render.
 * @returns {Promise<string | MachineType | null>} Resolves to the selected value which can be a string, a MachineType or null
 */
export async function renderSelect(
    selectContainerElement: HTMLDivElement,
    Select: any,
    selectOptions: SelectOption[]
): Promise<string | MachineType | null> {
    return new Promise(resolve => {
        const component = new Select({
            target: selectContainerElement,
            props: {
                selectOptions,
                returnFunction: (value: string | MachineType | null) => {
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