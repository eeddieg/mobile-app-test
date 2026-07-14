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
  const doc    = parser.parseFromString(html, 'text/html')

  // Fix UAGB icon list items -> add line breaks between compressed text
  doc.querySelectorAll('.uagb-icon-list-item').forEach(el => {
    el.insertAdjacentHTML('afterend', '<br>')
  })

  // Fix UAGB icon list labels -> wrap each in a block element
  doc.querySelectorAll('.uagb-icon-list-label').forEach(el => {
    const text = el.textContent?.trim() ?? ''
    if (text) {
      const p = doc.createElement('p')
      p.textContent = '• ' + text
      el.closest('.uagb-icon-list-item')?.replaceWith(p)
    }
  })

  // Remove empty UAGB wrappers left behind
  doc.querySelectorAll('.uagb-icon-list-content').forEach(el => {
    if (!el.textContent?.trim()) el.remove()
  })

  // Fix background-image inline styles with Greek filenames
  doc.querySelectorAll<HTMLElement>('[style*="background"]').forEach(el => {
    const style = el.getAttribute('style') ?? ''
    if (!style.includes('wp-content/uploads')) return
    const fixed = style.replace(/url\(['"]?([^'")\s]+)['"]?\)/g, (_m, url: string) => {
      const filename    = url.split('/').pop() ?? ''
      const encodedName = filename.split('').map(c =>
        /[^\u0020-\u007E]/.test(c) ? encodeURIComponent(c) : c
      ).join('')
      const fixedUrl = url.substring(0, url.lastIndexOf('/') + 1) + encodedName
      return `url('${fixedUrl}')`
    })
    el.setAttribute('style', fixed)
  })

  return doc.body.innerHTML
}

export function makePhoneNumbersClickable(html: string): string {
  if (!html) return html

  // First pass: your existing regex
  html = html.replace(
    /(?<!["\->])(\b(?:(?:\d{3}[-\s]?\d{7})|(?:\d{10})|(?:\d{4}[-\s]?\d{6}))\b)(?![^<]*>|[^<>]*<\/a>)/g,
    '<a href="tel:$1" style="color:#1976d2;text-decoration:none;font-weight:500;">$1</a>'
  )

  // Second pass: numbers inside heading tags (<h1>...<strong>210 3410900</strong></h1>)
  html = html.replace(
    /<strong>(\d{3})\s+(\d{7})<\/strong>/g,
    '<strong><a href="tel:$1$2" style="color:inherit;text-decoration:none;">$1 $2</a></strong>'
  )

  return html
}

export function decodeHtmlEntities(html: string): string {
  if (!html) return html
  const textarea = document.createElement('textarea')
  textarea.innerHTML = html
  return textarea.value
}

export function normalizeTableRows(html: string): string {
  if (!html) return html

  const parser = new DOMParser()
  const doc    = parser.parseFromString(html, 'text/html')

  doc.querySelectorAll('table').forEach(table => {
    const headerCount = table.querySelectorAll('thead th').length
    if (!headerCount) return

    table.querySelectorAll('tbody tr').forEach(row => {
      const cellCount = row.querySelectorAll('td').length
      const missing   = headerCount - cellCount
      for (let i = 0; i < missing; i++) {
        row.appendChild(doc.createElement('td'))
      }
    })
  })

  return doc.body.innerHTML
}

export interface DepartmentRow {
  iatreio:  string
  tmima:    string
  stelexos: string
  rolos:    string
  tilefono: string
}

/**
 * Reconstructs a department/contact table where WordPress has omitted
 * empty <td>s entirely rather than emitting <td></td> placeholders,
 * causing naive rendering to shift remaining cells left.
 *
 * Since WP never reorders cells, only drops empty ones, each surviving
 * cell can be placed into its correct column by content shape alone:
 *  - ΤΜΗΜΑ:    1–3 bare Greek capital letters (Α, ΣΤ, ΖΤ...)
 *  - ΡΟΛΟΣ:    the literal word "Προϊστάμενος"
 *  - ΤΗΛΕΦΩΝΟ: digits with an optional dash, 9–10 digits total
 *  - ΣΤΕΛΕΧΟΣ: everything else (rank + name — always contains a
 *              "/" or a space, so it's caught by exclusion)
 */
export function parseDepartmentTable(html: string): DepartmentRow[] {
  if (!html) return []

  const parser = new DOMParser()
  const doc    = parser.parseFromString(html, 'text/html')
  const rows   = Array.from(doc.querySelectorAll('table tbody tr'))

  const deptLetterRe = /^[Α-Ωα-ω]{1,3}$/
  const roleRe       = /^Προϊστάμενος$/i
  const phoneRe       = /^\d{3}-?\d{6,7}$/

  return rows
    .map(row => {
      const cells = Array.from(row.querySelectorAll('td'))
        .map(td => td.textContent?.trim() ?? '')

      const out: DepartmentRow = { iatreio: '', tmima: '', stelexos: '', rolos: '', tilefono: '' }
      if (!cells.length) return out

      out.iatreio = cells[0] ?? ''

      for (let i = 1; i < cells.length; i++) {
        const val = cells[i]
        if (!val) continue
        if (!out.tmima && deptLetterRe.test(val)) { out.tmima = val; continue }
        if (!out.rolos && roleRe.test(val)) { out.rolos = val; continue }
        if (!out.tilefono && phoneRe.test(val.replace(/\s/g, ''))) { out.tilefono = val; continue }
        if (!out.stelexos) { out.stelexos = val; continue }
        if (!out.tilefono) out.tilefono = val // last-resort catch-all
      }

      return out
    })
    .filter(r => r.iatreio) // drop stray empty rows
}
