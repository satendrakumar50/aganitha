import React from 'react'


export default function LinksList({ links = [], apiBase }) {
return (
<div>
<h2 className="text-xl font-semibold mb-2">Your links</h2>
<div className="space-y-2">
{links.map(l => (
<div key={l.id} className="p-3 bg-white border rounded flex justify-between items-center">
<div>
<div className="font-mono">{l.code}</div>
<div className="text-sm text-gray-600 truncate max-w-md">{l.original_url}</div>
</div>
<div className="text-right">
<div className="text-sm">Clicks: {l.clicks}</div>
<a
  className="text-blue-600 text-sm"
  href={`${apiBase.replace(/\/$/, '')}/${l.code}`}
  target="_blank"
  rel="noreferrer"
>
  Open
</a>

</div>
</div>
))}
{links.length === 0 && <div className="text-gray-600">No links yet</div>}
</div>
</div>
)
}