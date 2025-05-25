// src/hooks/useGeo.ts
import { useState, useEffect } from "react"

export interface GeoData {
  ip: string;
  city: string;
  region_name: string;
  country_name: string;
}

export function useGeo(ip: string | null) {
  const [data, setData] = useState<GeoData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ip) return

    console.log('Environment variables:', import.meta.env);
    const key = import.meta.env.VITE_IPSTACK_KEY;
    console.log('IPStack key:', key);
    if (!key) throw new Error("Missing VITE_IPSTACK_KEY");

    fetch(`https://api.ipstack.com/${ip}?access_key=${key}&fields=ip,city,region_name,country_name`)

      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json: GeoData) => setData(json))
      .catch(err => setError(err.message))
  }, [ip])

  return { data, error }
}
