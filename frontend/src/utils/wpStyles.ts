import env from 'src/config/env.config'

const API_BASE = env.AXIOS_BASE_URL

let injected = false

export function injectWpStyles(): void {
  if (injected) return
  injected = true

  const sheets = [
    `${API_BASE}/wp/styles/dashicons.min.css`,
    `${API_BASE}/wp/styles/uagb-style.css`,
    `${API_BASE}/wp/styles/astra.min.css`,
  ]

  sheets.forEach(href => {
    if (document.querySelector(`link[href="${href}"]`)) return
    const link       = document.createElement('link')
    link.rel         = 'stylesheet'
    link.href        = href
    document.head.appendChild(link)
  })
}













// import env from "../config/env.config"

// const WP_BASE = env.WP_BASE_URL;

// let injected = false

// export function injectWpStyles(): void {
//   if (injected) return
//   injected = true

//   const sheets = [
//     `${WP_BASE}/wp-includes/css/dashicons.min.css`,
//     `${WP_BASE}/wp-content/plugins/ultimate-addons-for-gutenberg/assets/css/uagb-style.css`,
//     `${WP_BASE}/wp-content/themes/astra/assets/css/minified/style.min.css`,
//   ]

//   sheets.forEach(href => {
//     if (document.querySelector(`link[href="${href}"]`)) return
//     const link       = document.createElement('link')
//     link.rel         = 'stylesheet'
//     link.href        = href
//     link.crossOrigin = 'anonymous'
//     document.head.appendChild(link)
//   })
// }
