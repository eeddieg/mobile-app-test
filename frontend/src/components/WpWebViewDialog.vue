<template>
  <q-dialog v-model="isOpen" maximized>
    <q-card class="dialog-card">

      <q-bar class="bg-primary text-white">
        <q-icon name="language" size="sm" class="q-mr-sm" />
        <div class="text-caption ellipsis">{{ friendlyTitle }}</div>
        <q-space />
        <q-btn dense flat icon="close" @click="close" />
      </q-bar>

      <q-card-section class="q-pa-none full-height relative-position">

        <div v-if="iframeLoading" class="absolute-full flex flex-center bg-white">
          <q-spinner-dots color="primary" size="48px" />
        </div>

        <iframe
          v-if="pdfSrc"
          :src="pdfSrc"
          class="web-iframe"
          frameborder="0"
          @load="iframeLoading = false"
        />

        <iframe
          v-else-if="iframeSrc"
          :srcdoc="iframeSrc"
          class="web-iframe"
          frameborder="0"
          allowfullscreen
          @load="iframeLoading = false"
        />

      </q-card-section>

      <q-card-actions align="right" class="q-pa-sm">
        <q-btn flat color="grey-7" label="Κλείσιμο" icon="close" @click="close" />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { wpPageStore } from 'src/stores/wpPage.store'

defineOptions({ name: 'WpWebViewDialog' })

const store         = wpPageStore()
const isOpen        = ref(false)
const iframeLoading = ref(false)
const iframeSrc     = ref('')
const pdfSrc         = ref('')
const friendlyTitle = ref('')

function isPdfUrl(href: string): boolean {
  return /\.pdf(\?|#|$)/i.test(href)
}

async function open(href: string): Promise<void> {
  friendlyTitle.value = '...'
  iframeSrc.value     = ''
  pdfSrc.value         = ''
  iframeLoading.value = true
  isOpen.value        = true

  if (isPdfUrl(href)) {
    friendlyTitle.value = decodeURIComponent(href.split('/').pop() ?? 'PDF')
    pdfSrc.value         = href
    return
  }

  const result = await store.fetchCleanPage(href)

  if (result) {
    iframeSrc.value     = result.html
    friendlyTitle.value = result.title
  } else {
    friendlyTitle.value = 'Σελίδα μη διαθέσιμη'
    iframeSrc.value     = `<html><body style="font-family:sans-serif;padding:16px;color:#333;text-align:center;">
      <p style="font-size:48px">🔍</p>
      <h2 style="color:#1976d2">Η σελίδα δεν βρέθηκε</h2>
      <p>Ο σύνδεσμος δεν είναι διαθέσιμος.</p>
      <a href="${href}" target="_blank" style="color:#1976d2">Άνοιγμα στο browser</a>
    </body></html>`
    iframeLoading.value = false
  }
}

function close(): void {
  isOpen.value        = false
  iframeSrc.value     = ''
  pdfSrc.value         = ''
  iframeLoading.value = false
}

defineExpose({ open, close })
</script>

<style scoped>
.dialog-card { display: flex; flex-direction: column; height: 100vh; }
.full-height { flex: 1; overflow: hidden; }
.web-iframe { width: 100%; height: 100%; border: none; display: block; }
</style>

<style scoped>
.dialog-card {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.full-height {
  flex: 1;
  overflow: hidden;
}
.web-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
</style>
