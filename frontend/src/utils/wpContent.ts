const API_BASE = import.meta.env.VITE_API_URL as string

export function fixWpImageUrls(html: string): string {
  if (!html) return html

  const result = html.replace(/(<img[^>]+src=")([^"]+)(")/g, (_match, pre, url, post) => {
    if (!isEncodedGreekWpUrl(url)) return pre + url + post
    return `<img data-wp-src="${url}" src="" style="min-height:40px;background:#f0f0f0;"` + post
  })

  return result
}

export async function fixBrokenImages(container: HTMLElement): Promise<void> {
  const imgs = container.querySelectorAll<HTMLImageElement>('img[data-wp-src]')

  console.log(imgs)

  await Promise.all(Array.from(imgs).map(async (img) => {
    const encodedUrl = img.getAttribute('data-wp-src') ?? ''
    if (!encodedUrl) return

    try {
      const apiUrl = `${API_BASE}/wp/media?url=${encodeURIComponent(encodedUrl)}`
      const res = await fetch(apiUrl)
      const json = await res.json()

      if (json.status && json.data?.source_url) {
        img.src = json.data.source_url
        img.removeAttribute('data-wp-src')
        img.style.background = ''
        img.style.minHeight = ''
      } else {
        img.style.display = 'none'
      }
    } catch {
      img.style.display = 'none'
    }
  }))
}

function isEncodedGreekWpUrl(url: string): boolean {
  if (!url.includes('kiath.gr/wp-content/')) return false
  return /%(8|9|[A-Fa-f][0-9A-Fa-f])[0-9A-Fa-f]/.test(url)
}
