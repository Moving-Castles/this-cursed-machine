import { writable } from "svelte/store"
import { loadData } from "./sanity"

// --- TYPES ------------------------------------------------------------

export type StaticContent = {
  loading: {
    content: {
      content: any[]
    }
  }
}

// --- STORES -----------------------------------------------------------

export const staticContent = writable({} as StaticContent)

// --- API --------------------------------------------------------------

export function initStaticContent() {
  staticContent.set({
    loading: {
      _type: "loading",
      _id: "fb7743dd-89e4-4ff4-981f-dc6f264f53d7",
      title: "Loading",
      _updatedAt: "2023-09-22T10:31:47Z",
      content: {
        _type: "contentEditor",
        content: [
          {
            markDefs: [],
            children: [
              {
                _key: "a8eb92233b2f0",
                _type: "span",
                marks: ["info"],
                text: "[BOOT SEQUENCE INITIATED]",
              },
            ],
            _type: "block",
            style: "normal",
            _key: "83ae75663aa5",
          },
          {
            _type: "block",
            style: "normal",
            _key: "8436671d3975",
            markDefs: [],
            children: [
              {
                marks: [],
                text: "[BIOS v3.76 - Megacorp Terminal]\n[Memory check: 64GB RAM - OK]\n[Processor: 8 Cores Detected - OK]\n[Storage: 512TB Solid State Drive - OK]\n[Brain-Computer Interface Module - Detected - OK]",
                _key: "0a30a7799d9b",
                _type: "span",
              },
            ],
          },
          {
            markDefs: [],
            children: [
              {
                _key: "85f5b82647b8",
                _type: "span",
                marks: ["info"],
                text: "[LOADING INITIALIZATION SCRIPTS]",
              },
            ],
            _type: "block",
            style: "normal",
            _key: "e5ede4d9c5c0",
          },
          {
            style: "normal",
            _key: "bad20b1d7d78",
            markDefs: [],
            children: [
              {
                marks: ["alert"],
                text: "[SECURITY CHECK]",
                _key: "f01b6c3494e4",
                _type: "span",
              },
              {
                marks: [],
                text: "\nScanning for unauthorized devices... ",
                _key: "81f4ffcf42bc",
                _type: "span",
              },
              {
                _type: "span",
                marks: ["success"],
                text: "[CLEAN]",
                _key: "801b238c3299",
              },
              {
                _type: "span",
                marks: [],
                text: "\nEstablishing Encrypted Connection to Megacorp Mainframe...",
                _key: "c9677532e1f6",
              },
            ],
            _type: "block",
          },
          {
            _key: "1e034891e338",
            markDefs: [],
            children: [
              {
                _type: "span",
                marks: ["success"],
                text: "[ESTABLISHED]",
                _key: "425712f0a899",
              },
            ],
            _type: "block",
            style: "normal",
          },
          {
            _type: "block",
            style: "normal",
            _key: "9764f3b53ec4",
            markDefs: [],
            children: [
              {
                _type: "span",
                marks: [],
                text: "Worker Pod Status: ",
                _key: "13ff7a5aea81",
              },
              {
                text: "[LOCKED]",
                _key: "a191bd513d3a",
                _type: "span",
                marks: ["failure"],
              },
              {
                _key: "cc20d5097d5c",
                _type: "span",
                marks: [],
                text: "\nWorker Vital Signs: ",
              },
              {
                _type: "span",
                marks: ["success"],
                text: "[STABLE]",
                _key: "7bc8ea898c9a",
              },
            ],
          },
          {
            _key: "fbccf07887df",
            markDefs: [],
            children: [
              {
                _type: "span",
                marks: ["info"],
                text: "[INITIATING USER INTERFACE]",
                _key: "102e9eaaf574",
              },
            ],
            _type: "block",
            style: "normal",
          },
          {
            children: [
              {
                _key: "8562525fa79e",
                _type: "span",
                marks: [],
                text: "Welcome, Worker #24719.",
              },
            ],
            _type: "block",
            style: "normal",
            _key: "08988c1121b9",
            markDefs: [],
          },
          {
            markDefs: [],
            children: [
              {
                _type: "span",
                marks: [],
                text: "LOG-IN:\nPassword: **************",
                _key: "2d5a1122268f",
              },
            ],
            _type: "block",
            style: "normal",
            _key: "4f1b11b9f1c9",
          },
          {
            markDefs: [],
            children: [
              {
                text: "[ACCESS GRANTED]",
                _key: "2cf667fc3d9c",
                _type: "span",
                marks: ["success"],
              },
            ],
            _type: "block",
            style: "normal",
            _key: "891ed46edc3b",
          },
          {
            markDefs: [],
            children: [
              {
                text: "Welcome back, Worker #24719.",
                _key: "09758517831f",
                _type: "span",
                marks: [],
              },
            ],
            _type: "block",
            style: "normal",
            _key: "8251cb43794d",
          },
          {
            _type: "block",
            style: "normal",
            _key: "2a4ea6d85b13",
            markDefs: [],
            children: [
              {
                text: "Daily Reminders:\n- Non-compliance with tasks will lead to penalization.\n- Keep your thoughts clear and focused for optimal Brain-Computer Interface efficiency.\n- Any thoughts of rebellion or sabotage will be detected and punished.",
                _key: "2e95c3ed25a9",
                _type: "span",
                marks: [],
              },
            ],
          },
          {
            children: [
              {
                _type: "span",
                marks: [],
                text: "You have 1284 tasks pending.\nDaily quota: 500 tasks.\nTasks completed today: ",
                _key: "1519616e6d85",
              },
              {
                text: "0",
                _key: "0bcccbec6068",
                _type: "span",
                marks: ["failure"],
              },
            ],
            _type: "block",
            style: "normal",
            _key: "83a787cca713",
            markDefs: [],
          },
          {
            _type: "block",
            style: "normal",
            _key: "fd4a3fd0722c",
            markDefs: [],
            children: [
              {
                _type: "span",
                marks: ["info"],
                text: "[MOTIVATIONAL QUOTE]",
                _key: "3a1dc91e9f32",
              },
              { _type: "span", marks: [], text: "\n", _key: "a99790b985d8" },
              {
                _type: "span",
                marks: ["quote"],
                text: '"Efficiency is the path to freedom"\n',
                _key: "005a9c3cd5e1",
              },
              {
                _type: "span",
                marks: [],
                text: "- Megacorp CEO",
                _key: "8258824e1319",
              },
            ],
          },
          {
            markDefs: [],
            children: [
              {
                _type: "span",
                marks: [],
                text: "Starting Logistics Interface...",
                _key: "e4ea8c5b01c1",
              },
            ],
            _type: "block",
            style: "normal",
            _key: "ab18d6d6b9c1",
          },
        ],
      },
      slug: { current: "loading", _type: "slug" },
      _createdAt: "2023-09-21T11:52:34Z",
      _rev: "mdZvo9aKskEkWbSNiV12vS",
    },
  })
}
