import React, { useState } from 'react'


export default function ShortenForm({ onCreated, apiBase }) {
const [url, setUrl] = useState('')
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
const [result, setResult] = useState(null)


async function submit(e) {
e.preventDefault()
setError(null)
setLoading(true)
console.log("Calling backend:", `${apiBase}/api/shorten`)
try {
const res = await fetch(`${apiBase}/api/shorten`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ url })
})
if (!res.ok) throw new Error('Failed')
const data = await res.json()
setResult(data)
setUrl('')
onCreated && onCreated()
} catch (err) {
setError(err.message)
} finally { setLoading(false) }
}


return (
<form onSubmit={submit} className="mb-6">
<div className="flex gap-2">
<input className="flex-1 p-2 border rounded" placeholder="https://example.com" value={url} onChange={e=>setUrl(e.target.value)} />
<button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? '...' : 'Shorten'}</button>
</div>
{error && <div className="text-red-600 mt-2">{error}</div>}
{result && (
<div className="mt-2 p-2 bg-white border rounded">
Shortened: <a href={`${apiBase.replace(/:\/\/[^/]+/,'')}/${result.code}`} target="_blank" rel="noreferrer">{result.code}</a>

<div className="text-sm text-gray-500">Full: {result.original_url}</div>
</div>
)}
</form>
)
}