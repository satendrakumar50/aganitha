import React, { useEffect, useState } from 'react'
import ShortenForm from './components/ShortenForm'
import LinksList from './components/LinksList'


// const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
const API = import.meta.env.VITE_API_BASE || 'https://aganitha-8.onrender.com'

export default function App() {
const [links, setLinks] = useState([])


async function fetchLinks() {
const res = await fetch(`${API}/api/links`)
const data = await res.json()
setLinks(data)
}


useEffect(() => { fetchLinks() }, [])


return (
<div className="min-h-screen bg-gray-50 p-6">
<div className="max-w-3xl mx-auto">
<h1 className="text-3xl font-bold mb-4">TinyURL — minimal</h1>
{/* <ShortenForm onCreated={fetchLinks} apiBase="http://localhost:4000" /> */}

<ShortenForm onCreated={fetchLinks} apiBase={API} />
<LinksList links={links} apiBase={API} />
</div>
</div>
)
}