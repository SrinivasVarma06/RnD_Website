#!/usr/bin/env node
// Simple import script to create IP and Biosafety committee entries in Strapi v4
// Usage:
// STRAPI_URL=https://rnd.iitdh.ac.in/strapi STRAPI_API_TOKEN=<token> node import_committees.js

const STRAPI = process.env.STRAPI_URL || 'https://rnd.iitdh.ac.in/strapi'
const TOKEN = process.env.STRAPI_API_TOKEN

if (!TOKEN) {
  console.error('Error: set STRAPI_API_TOKEN environment variable with a Strapi API token (Admin > Settings > API Tokens)')
  process.exit(1)
}

const iprEntries = [
  { sl_no: 1, name: 'Dr. Pratyasa Bhui', current: 'Dean (R&D)', role: 'Chairman' },
  { sl_no: 2, name: 'Prof. Ramjee Repaka', current: 'Dean (SW)', role: 'Member' },
  { sl_no: 3, name: 'Dr. RajeswaraRao M.', current: 'Associate Dean, SW (Gymkhana, Sports & Clubs & Technology)', role: 'Member' },
  { sl_no: 4, name: 'Dr. Somashekara M. A.', current: 'HoD, MMAE', role: 'Member' },
  { sl_no: 5, name: 'Dr. Amar Gaonkar', current: 'Associate Dean (Entrepreneurship, Incubation)', role: 'Member' },
  { sl_no: 6, name: 'Dr. Sandeep R. B.', current: 'Associate Dean R&D Projects', role: 'Member' },
  { sl_no: 7, name: 'Dr. Kedar Khandeparkar', current: 'FiC(Intellectual Property Rights and Patent Cell)', role: 'Convenor' }
]

// If you have biosafety entries to import, add them to biosafetyEntries array below
const biosafetyEntries = []

async function exists(collection, field, value) {
  const url = `${STRAPI}/api/${collection}?filters[${field}][$eq]=${encodeURIComponent(value)}`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } })
  if (!res.ok) return false
  const j = await res.json()
  return (j.data || []).length > 0
}

async function create(collection, payload) {
  const url = `${STRAPI}/api/${collection}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`
    },
    body: JSON.stringify({ data: payload })
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to create ${collection}: ${res.status} ${text}`)
  }
  return res.json()
}

async function upsertList(collection, uniqueField, items) {
  for (const item of items) {
    try {
      const val = item[uniqueField]
      const found = await exists(collection, uniqueField, val)
      if (found) {
        console.log(`Skipping ${collection} ${uniqueField}=${val} (already exists)`)
        continue
      }
      await create(collection, item)
      console.log(`Created ${collection} ${uniqueField}=${val}`)
    } catch (err) {
      console.error('Error importing item', item, err.message)
    }
  }
}

async function main() {
  console.log('Import starting...')
  if (iprEntries.length) {
    await upsertList('ipr-committees', 'name', iprEntries)
  }
  if (biosafetyEntries.length) {
    await upsertList('biosafety-committees', 'person', biosafetyEntries)
  }
  console.log('Import finished.')
}

// Node 18+ has fetch built-in; if not, user must run with a Node that supports fetch.
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
