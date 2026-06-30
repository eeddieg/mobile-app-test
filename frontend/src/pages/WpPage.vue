<template>
  <div class="page-container">

    <div class="header-wrapper q-mb-md">
      <q-item-label
        class="text-center"
        :class="isMobile ? 'text-h6' : 'text-h3'"
      >
        {{ pageTitle }}
      </q-item-label>
    </div>

    <div v-if="loading" class="full-width flex flex-center q-py-xl">
      <q-spinner-dots color="primary" size="48px" />
    </div>

    <div v-else-if="error" class="full-width flex flex-center column q-py-xl q-gutter-sm">
      <q-icon name="error_outline" color="negative" size="48px" />
      <div class="text-body2 text-grey-6">Αδυναμία φόρτωσης σελίδας</div>
      <q-btn flat color="primary" label="Επαναφόρτωση" @click="load" />
    </div>

    <div v-else-if="page" class="inner-wrapper">
      <q-card flat bordered class="q-pa-sm" style="border-radius: 18px;">
        <q-card-section>
          <div
            ref="contentRef"
            class="post-content"
            v-html="fixedContent"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            color="primary"
            icon="open_in_new"
            label="Άνοιγμα στο site"
            :href="page.link"
            target="_blank"
          />
        </q-card-actions>
      </q-card>
    </div>

    <div v-else class="full-width flex flex-center column q-py-xl q-gutter-sm">
      <q-icon name="search_off" color="grey-5" size="48px" />
      <div class="text-body2 text-grey-6">Η σελίδα δεν βρέθηκε</div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { screenStore } from 'src/stores/screen.store'
import { wpPageStore } from 'src/stores/wpPage.store'
import { SLUG_TO_PAGE_ID, SLUG_TO_WP_SLUG } from 'src/config/slugMap'
import { fixWpImageUrls, fixBrokenImages } from 'src/utils/wpContent'
import type { WpPage } from 'src/models/models'

defineOptions({ name: 'WpPage' })

const route   = useRoute()
const screen  = screenStore()
const store   = wpPageStore()
const contentRef = ref<HTMLElement | null>(null)

const isMobile   = computed(() => screen.isMobile)
const page       = ref<WpPage | null>(null)
const loading    = ref(false)
const error      = ref(false)

const pageTitle = computed(() =>
  page.value ? page.value.title.rendered : '...'
)

const fixedContent = computed(() =>
  page.value ? fixWpImageUrls(page.value.content.rendered) : ''
)

async function load() {
  const localSlug = route.params.slug as string
  loading.value = true
  error.value   = false
  page.value    = null

  try {
    const pageId = SLUG_TO_PAGE_ID[localSlug]
    page.value = pageId
      ? await store.fetchById(pageId)
      : await store.fetchBySlug(SLUG_TO_WP_SLUG[localSlug] ?? localSlug)

    await nextTick()
    if (contentRef.value) {
      await fixBrokenImages(contentRef.value)
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void screen.detectDevice()
  void load()
})

watch(() => route.params.slug, load)
</script>
<style scoped>
.page-container {
  min-height: 100vh;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
}
.inner-wrapper {
  width: 100%;
  max-width: 900px;
  padding: 0 12px;
  box-sizing: border-box;
}

/* WP content */
.post-content { width: 100%; font-size: 14px; line-height: 1.7; overflow-wrap: break-word; word-break: break-word; }
.post-content :deep(p)   { margin-bottom: 12px; }
.post-content :deep(h1), .post-content :deep(h2), .post-content :deep(h3) { margin: 16px 0 8px; font-weight: 600; }
.post-content :deep(a)   { color: #1976d2; word-break: break-word; }
.post-content :deep(ul), .post-content :deep(ol) { padding-left: 20px; margin-bottom: 12px; }
.post-content :deep(li)  { margin-bottom: 4px; }

/* Images — the key fix for broken Greek-filename images */
.post-content :deep(img) {
  max-width: 100% !important;
  height: auto !important;
  display: block;
  margin: 16px auto;
  border-radius: 8px;
  /* Show a placeholder background while loading */
  background: #f0f0f0;
  min-height: 40px;
}
.post-content :deep(figure)  { max-width: 100%; margin: 16px auto; text-align: center; }
.post-content :deep(figcaption) { font-size: 12px; color: #888; margin-top: 4px; }

/* Tables */
.post-content :deep(table)  { width: 100%; display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; border-collapse: collapse; }
.post-content :deep(td), .post-content :deep(th) { padding: 8px 12px; border: 1px solid #ddd; font-size: 13px; vertical-align: top; }
.post-content :deep(thead)  { background: #f5f5f5; font-weight: 600; }
.post-content :deep(tr:nth-child(even)) { background: #fafafa; }

/* Iframes (Google Drive embeds etc.) */
.post-content :deep(iframe) { max-width: 100%; width: 100%; border: none; border-radius: 8px; }
.post-content :deep(video)  { max-width: 100%; width: 100%; }

@media (max-width: 600px) {
  .page-container { padding: 8px; }
}
* { box-sizing: border-box; }
</style>
