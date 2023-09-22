import { writable } from "svelte/store";
import { loadData } from "./sanity"

// --- TYPES ------------------------------------------------------------

export type StaticContent = {
    loading: {
        content: {
            content: any[]
        }
    };
}

// --- STORES -----------------------------------------------------------

export const staticContent = writable({} as StaticContent);

// --- API --------------------------------------------------------------

export async function initStaticContent() {
    const loadingDoc = await loadData("*[_type == 'loading' && slug.current == 'loading'][0]", {})

    const tempStaticContent: StaticContent = {
        loading: loadingDoc
    }

    staticContent.set(tempStaticContent);
}