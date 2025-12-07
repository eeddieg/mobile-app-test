// // src/boot/pinia.js
// import { boot } from 'quasar/wrappers'
// import { createPinia } from 'pinia'
// import piniaPersist from 'pinia-plugin-persistedstate'

// export default boot(({ app }) => {
//   const pinia = createPinia()
//   pinia.use(piniaPersist)
//   app.use(pinia)
// })


import { boot } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import { pdfStore } from 'src/stores/pdf.store'
import { screenStore } from 'src/stores/screen.store'

export default boot(({ app }) => {
  const pinia = createPinia()
  pinia.use(piniaPersist)
  app.use(pinia)

  // Track tab for exit detection
  const TAB_ID = Date.now().toString()
  const activeTabs = JSON.parse(localStorage.getItem('active-tabs') || '[]')
  activeTabs.push(TAB_ID)
  localStorage.setItem('active-tabs', JSON.stringify(activeTabs))

  window.addEventListener('beforeunload', () => {
    // Remove only this tab
    let tabs = JSON.parse(localStorage.getItem('active-tabs') || '[]')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tabs = tabs.filter((id: any) => id !== TAB_ID)
    localStorage.setItem('active-tabs', JSON.stringify(tabs))

    // Reset stores only if no tabs left
    if (tabs.length === 0) {
      pdfStore().$reset()
      screenStore().$reset()
      // reset other stores here
      localStorage.removeItem('active-tabs')
    }
  })
})

