import { writable, derived } from "svelte/store";
import { loadData, urlFor } from "./sanity"

type Asset = {
    label: string;
    images: any[];
}

export type StaticContent = {
    cores: any[];
    organs: any[];
    bodies: any[];
    tiles: Asset[];
}

export const staticContent = writable({} as StaticContent);

export async function initStaticContent() {

    const coresDoc = await loadData("*[_id == 'cores'][0]", {})
    const bodiesDoc = await loadData("*[_id == 'bodies'][0]", {})
    const organsDoc = await loadData("*[_id == 'organs'][0]", {})
    const tilesDoc = await loadData("*[_id == 'tiles'][0]", {})

    let tempStaticContent: StaticContent = {
        cores: [],
        bodies: [],
        organs: [],
        tiles: [],
    }

    console.log(tilesDoc, tilesDoc.tiles)

    // CORES
    for (let i = 0; i < coresDoc.cores.length; i++) {
        tempStaticContent.cores.push(
            {
                label: "core-" + i,
                "w100": urlFor(coresDoc.cores[i].image).width(100).auto("format").url(),
                "w400": urlFor(coresDoc.cores[i].image).width(400).auto("format").url(),
                "w800": urlFor(coresDoc.cores[i].image).width(800).auto("format").url()
            }
        )
    }

    // BODIES
    for (let i = 0; i < bodiesDoc.bodies.length; i++) {
        tempStaticContent.bodies.push(
            {
                size: bodiesDoc.bodies[i].size,
                "w100": urlFor(bodiesDoc.bodies[i].image).width(100).auto("format").url(),
                "w400": urlFor(bodiesDoc.bodies[i].image).width(400).auto("format").url(),
                "w800": urlFor(bodiesDoc.bodies[i].image).width(800).auto("format").url()
            }
        )
    }

    // ORGANS
    for (let i = 0; i < organsDoc.organs.length; i++) {
        tempStaticContent.organs.push(
            {
                name: organsDoc.organs[i].name,
                type: organsDoc.organs[i].type,
                "w100": urlFor(organsDoc.organs[i].image).width(100).auto("format").url(),
                "w400": urlFor(organsDoc.organs[i].image).width(400).auto("format").url(),
                "w800": urlFor(organsDoc.organs[i].image).width(800).auto("format").url()
            }
        )
    }

    // TILES
    for (let i = 0; i < tilesDoc.assets.length; i++) {
        tempStaticContent.organs.push(
            {
                type: tilesDoc.assets[i].type,
                "w100": urlFor(tilesDoc.assets[i].image).width(100).auto("format").url(),
                "w400": urlFor(tilesDoc.assets[i].image).width(400).auto("format").url(),
                "w800": urlFor(tilesDoc.assets[i].image).width(800).auto("format").url()
            }
        )
    }

    staticContent.set(tempStaticContent);
}

// export const allOrganIcons = derived(staticContent, $staticContent => {
//     if (!$staticContent.organs || $staticContent.organs.length === 0) return [];
//     return $staticContent.organs.flatMap(o => o.images);
// });