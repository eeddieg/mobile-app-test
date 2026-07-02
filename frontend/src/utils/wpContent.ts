import env from 'src/config/env.config'

const API_BASE = env.AXIOS_BASE_URL

export function fixWpImageUrls(html: string): string {
  if (!html) return html

  return html.replace(/(<img[^>]+src=")([^"]+)(")/g, (_m, pre, url, post) => {
    if (!isProblematicWpUrl(url)) return `${pre}${url}${post}`
    return `${pre}${post} data-wp-src="${url}" src="" style="min-height:80px;background:#f0f0f0;border-radius:8px;display:block;"`
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function fixBrokenImages(_container: HTMLElement): void {
  return
}

export async function fixBrokenImagesAsync(container: HTMLElement): Promise<void> {
  const imgs = container.querySelectorAll<HTMLImageElement>('img[data-wp-src]')
  if (!imgs.length) return

  await Promise.all(Array.from(imgs).map(async (img) => {
    const originalUrl = img.getAttribute('data-wp-src') ?? ''
    if (!originalUrl) return

    try {
      const apiUrl = `${API_BASE}/wp/media?url=${originalUrl}`

      const res  = await fetch(apiUrl)
      const json = await res.json() as { status: boolean; data?: { source_url: string } }

      if (json.status && json.data?.source_url) {
        img.src = json.data.source_url
        img.removeAttribute('data-wp-src')
        img.removeAttribute('style')
      } else {
        img.style.display = 'none'
      }
    } catch (e) {
      console.error('[fixBrokenImages] error:', e)
      img.style.display = 'none'
    }
  }))
}

function isProblematicWpUrl(url: string): boolean {
  if (!url.includes('kiath.gr/wp-content/')) return false

  const filename = url.split('/').pop() ?? ''

  // Raw non-ASCII characters (literal Greek) e.g. ιατρός-εοπυυ.jpg
  if (/[^\u0020-\u007E]/.test(filename)) return true

  // Percent-encoded non-ASCII e.g. %CE%B9...
  if (/%(8|9|[A-Fa-f][0-9A-Fa-f])[0-9A-Fa-f]/.test(filename)) return true

  return false
}

/**
 * Strips WP page builder blocks that rely on external CSS/fonts
 * and won't render correctly outside the WP theme.
 * Keeps only semantic HTML: headings, paragraphs, lists, tables, images.
 */
export function sanitizeWpContent(html: string): string {
  if (!html) return html

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  doc.querySelectorAll('.uagb-icon-list-item, .uagb-icon-list').forEach(el => el.remove())

  doc.querySelectorAll('[class*="uagb-block"]').forEach(el => {
    if (!el.textContent?.trim()) el.remove()
  })

  doc.querySelectorAll('.uagb-separator, .wp-block-separator, hr.is-style-wide').forEach(el => el.remove())

  doc.querySelectorAll('div:empty, span:empty').forEach(el => el.remove())

  return doc.body.innerHTML
}

export function makePhoneNumbersClickable(html: string): string {
  if (!html) return html

  // Match Greek phone number formats:
  // 210-3482333, 2103482333, 210 3482333
  // 231-0388727, 6944123456 (mobile)
  // Also handles formats like 210-3410900
  return html.replace(
    /(?<!["\->])(\b(?:(?:\d{3}[-\s]?\d{7})|(?:\d{10})|(?:\d{4}[-\s]?\d{6}))\b)(?![^<]*>|[^<>]*<\/a>)/g,
    '<a href="tel:$1" style="color:#1976d2;text-decoration:none;font-weight:500;">$1</a>'
  )
}
