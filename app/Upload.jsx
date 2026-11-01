'use client'
import { useEffect, useRef, useState } from 'react'

export default function Upload() {
    const [url, setUrl] = useState('')
    const widgetRef = useRef(null)

    useEffect(() => {
        // Load Cloudinary script
        const script = document.createElement('script')
        script.src = 'https://upload-widget.cloudinary.com/global/all.js'
        script.async = true
        script.onload = () => {
            // Create widget after script loads
            widgetRef.current = window.cloudinary.createUploadWidget(
                {
                    cloudName: 'u2jhy2x',
                    apiKey: '222797123241311',
                    uploadPreset: 'likehub',
                },
                (error, result) => {
                    if (!error && result && result.event === 'success') {
                        setUrl(result.info.secure_url)
                    }
                }
            )
        }
        document.body.appendChild(script)

        return () => {
            // Cleanup
            if (script.parentNode) script.parentNode.removeChild(script)
        }
    }, [])

    const openWidget = () => {
        if (widgetRef.current) {
            widgetRef.current.open()
        }
    }

    return (
        <div
            onClick={openWidget}
            className="border-dashed border-2 p-4 rounded-xl text-center cursor-pointer"
            style={{ background: '#f9fafb', borderColor: '#d1d5db' }}
        >
            {url ? (
                <img src={url} alt="Uploaded" className="h-32 mx-auto rounded-lg" />
            ) : (
                <p style={{ color: '#6b7280' }}>📸 Սեղմիր նկար վերբեռնելու համար</p>
            )}
            <input name="image" value={url} hidden readOnly />
        </div>
    )
}