/*
 *  Functions to fetch data from Sanity
 * 
 */

import { createClient } from "@sanity/client"
import blocksToHtml from "@sanity/block-content-to-html"
import { get, has } from "lodash"
import imageUrlBuilder from "@sanity/image-url"

const SANITY_PROJECT_ID = "wy55ouyo"

export const client = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: "production",
    apiVersion: '2023-03-21', // use a UTC date string
    useCdn: true,
})

const h = blocksToHtml.h

const prepareTextElements = props => {
    let textElements = []
    if (has(props, "node.caption.content"))
        textElements.push(
            h(
                "figcaption",
                { className: "caption" },
                toPlainText(props.node.caption.content)
            )
        )
    if (has(props, "node.attribution"))
        textElements.push(
            h("figcaption", { className: "credits" }, props.node.attribution)
        )
    return textElements
}

export const renderBlockText = text =>
    blocksToHtml({
        blocks: text,
        serializers: serializers,
        projectId: SANITY_PROJECT_ID,
        dataset: "production",
    })

export const toPlainText = (blocks = []) => {
    return blocks
        .map(block => {
            if (block._type !== "block" || !block.children) {
                return ""
            }
            return block.children.map(child => child.text).join("")
        })
        .join("\n\n")
}

const builder = imageUrlBuilder(client)

export const urlFor = source => builder.image(source)

const serializers = {
    marks: {
        link: props => {
            const external = get(props, 'mark.href', '').includes('http')
            let linkOptions = external ? { target: "_blank", rel: "noreferrer", href: props.mark.href } : { href: props.mark.href }
            return h(
                "a",
                linkOptions,
                props.children
            )
        },
    },
    types: {
        block: props => {
            const style = props.node.style || "normal"
            if (style === "blockquote") return h("blockquote", {}, props.children)
            if (style === "h2") return h("h2", {}, props.children)
            if (style === "h3") return h("h3", {}, props.children)
            if (style === "h4") return h("h4", {}, props.children)
            return h("p", { className: style }, props.children)
        },
        image: props => {
            return h("figure", { className: "image" }, [
                h("img", {
                    src: urlFor(get(props, "node.asset", ""))
                        .width(1200)
                        .quality(100)
                        .auto("format")
                        .url(),
                }),
                ...prepareTextElements(props),
            ])
        },
    },
}

export const loadData = async (query, params) => {
    try {
        const res = await client.fetch(query, params)
        if (res === null) {
            return Promise.reject(new Error(404))
        }
        return res
    } catch (err) {
        return Promise.reject(new Error(404))
    }
}