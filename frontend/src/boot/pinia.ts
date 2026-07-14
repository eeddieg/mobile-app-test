import { boot } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import { scheduleStore } from 'src/stores/schedule.store'
import { screenStore } from 'src/stores/screen.store'

export default boot(({ app }) => {
  const pinia = createPinia()
  pinia.use(piniaPersist)
  app.use(pinia)

  const TAB_ID = Date.now().toString()
  const activeTabs = JSON.parse(localStorage.getItem('active-tabs') || '[]')
  activeTabs.push(TAB_ID)
  localStorage.setItem('active-tabs', JSON.stringify(activeTabs))

  window.addEventListener('beforeunload', () => {
    let tabs = JSON.parse(localStorage.getItem('active-tabs') || '[]')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tabs = tabs.filter((id: any) => id !== TAB_ID)
    localStorage.setItem('active-tabs', JSON.stringify(tabs))

    if (tabs.length === 0) {
      scheduleStore().$reset()
      screenStore().$reset()
      localStorage.removeItem('active-tabs')
    }
  })
})

