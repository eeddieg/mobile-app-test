<template>
  <component :is="pageComponent" :page="page" :loading="loading" :error="error" @reload="load" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { wpPageStore } from 'src/stores/wpPage.store'
import { screenStore } from 'src/stores/screen.store'
import { SLUG_TO_PAGE_ID, SLUG_TO_WP_SLUG } from 'src/config/slugMap'
import type { WpPage } from 'src/models/models'

defineOptions({ name: 'WpPage' })

const route  = useRoute()
const screen = screenStore()
const store  = wpPageStore()

const page    = ref<WpPage | null>(null)
const loading = ref(false)
const error   = ref(false)

// Map slugs that need a custom renderer
const CUSTOM_RENDERERS: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  'apostoli':       defineAsyncComponent(() => import("../pages/WpIconListPage.vue")),
  'grammi-ypostiriksis': defineAsyncComponent(() => import("../pages/WpDefaultPage.vue")),
}

const pageComponent = computed(() => {
  const slug = route.params.slug as string
  return CUSTOM_RENDERERS[slug] ?? defineAsyncComponent(() => import("../pages/WpDefaultPage.vue"))
})

async function load(): Promise<void> {
  const localSlug = route.params.slug as string
  loading.value = true
  error.value   = false
  page.value    = null

  try {
    const pageId = SLUG_TO_PAGE_ID[localSlug]
    page.value = pageId
      ? await store.fetchById(pageId)
      : await store.fetchBySlug(SLUG_TO_WP_SLUG[localSlug] ?? localSlug)
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






<!-- <template>
  <div class="page-container">

    <div v-if="loading" class="full-width flex flex-center q-py-xl">
      <q-spinner-dots color="primary" size="48px" />
    </div>

    <div v-else-if="error" class="full-width flex flex-center column q-py-xl q-gutter-sm">
      <q-icon name="error_outline" color="negative" size="48px" />
      <div class="text-body2 text-grey-6">Αδυναμία φόρτωσης σελίδας</div>
      <q-btn flat color="primary" label="Επαναφόρτωση" @click="load" />
    </div>

    <div v-else-if="page" class="inner-wrapper">
      <div class="page-title q-mb-sm">{{ pageTitle }}</div>
      <div ref="contentRef" class="content-wrapper">
        <q-card flat bordered class="content-card">
          <q-card-section>
            <div
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
import { fixWpImageUrls, fixBrokenImagesAsync, sanitizeWpContent } from 'src/utils/wpContent'
import { injectWpStyles } from 'src/utils/wpStyles'
import type { WpPage } from 'src/models/models'

defineOptions({ name: 'WpPage' })

const route      = useRoute()
const screen     = screenStore()
const store      = wpPageStore()
const contentRef = ref<HTMLElement | null>(null)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isMobile  = computed(() => screen.isMobile)
const page      = ref<WpPage | null>(null)
const loading   = ref(false)
const error     = ref(false)

const pageTitle = computed(() =>
  page.value ? page.value.title.rendered : '...'
)

// const fixedContent = computed(() =>
//   page.value ? fixWpImageUrls(page.value.content.rendered) : ''
// )

const fixedContent = computed(() => {
  if (!page.value) return ''
  const sanitized = sanitizeWpContent(page.value.content.rendered)
  return fixWpImageUrls(sanitized)
})

async function runImageFix(): Promise<void> {
  await nextTick()
  await new Promise(r => setTimeout(r, 100))
  const postContent = contentRef.value?.querySelector<HTMLElement>('.post-content')
  if (postContent) await fixBrokenImagesAsync(postContent)
}

async function load(): Promise<void> {
  const localSlug = route.params.slug as string
  loading.value = true
  error.value   = false
  page.value    = null

  try {
    const pageId = SLUG_TO_PAGE_ID[localSlug]
    page.value = pageId
      ? await store.fetchById(pageId)
      : await store.fetchBySlug(SLUG_TO_WP_SLUG[localSlug] ?? localSlug)

    console.log(page.value)

  } catch {
    error.value = true
  } finally {
    loading.value = false
    await runImageFix()
  }
}

onMounted(() => {
  void screen.detectDevice()
  injectWpStyles()
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

.inner-wrapper {
  width: 100%;
  max-width: 900px;
  padding: 0 12px;
  box-sizing: border-box;
}

.page-title {
  font-size: clamp(1rem, 4vw, 1.8rem);
  font-weight: 600;
  text-align: center;
  line-height: 1.3;
  word-break: break-word;
  padding: 0 8px;
  margin-bottom: 8px;
}

.content-wrapper {
  width: 100%;
}

.content-card {
  border-radius: 18px;
}

.content-card :deep(.q-card__section) {
  padding: 12px;
}

/* WP content */
.post-content {
  width: 100%;
  font-size: 14px;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
}

.post-content :deep(h1) {
  font-size: clamp(1.1rem, 4vw, 1.6rem);
  font-weight: 700;
  margin: 8px 0 4px;
  line-height: 1.2;
}

.post-content :deep(h2) {
  font-size: clamp(1rem, 3.5vw, 1.4rem);
  font-weight: 600;
  margin: 6px 0 4px;
  line-height: 1.2;
}

.post-content :deep(h3),
.post-content :deep(h4),
.post-content :deep(h5) {
  font-size: clamp(0.9rem, 3vw, 1.1rem);
  font-weight: 600;
  margin: 6px 0 4px;
  line-height: 1.2;
}

.post-content :deep(p) {
  margin-bottom: 10px;
}

.post-content :deep(a) {
  color: #1976d2;
  word-break: break-word;
}

.post-content :deep(ul),
.post-content :deep(ol) {
  padding-left: 20px;
  margin-bottom: 10px;
}

.post-content :deep(li) {
  margin-bottom: 4px;
}

.post-content :deep(strong) {
  font-weight: 600;
}

/* Images */
.post-content :deep(img) {
  max-width: 100% !important;
  height: auto !important;
  display: block;
  margin: 12px auto;
  border-radius: 8px;
}

.post-content :deep(figure) {
  max-width: 100%;
  margin: 12px auto;
  text-align: center;
}

.post-content :deep(figcaption) {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

/* Tables */
.post-content :deep(table) {
  width: 100%;
  display: block;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-collapse: collapse;
  margin-bottom: 12px;
}

.post-content :deep(td),
.post-content :deep(th) {
  padding: 6px 10px;
  border: 1px solid #ddd;
  font-size: 13px;
  vertical-align: top;
}

.post-content :deep(thead) {
  background: #f5f5f5;
  font-weight: 600;
}

.post-content :deep(tr:nth-child(even)) {
  background: #fafafa;
}

/* Iframes */
.post-content :deep(iframe),
.post-content :deep(video) {
  max-width: 100%;
  width: 100%;
  border: none;
  border-radius: 8px;
}

/* Mobile */
@media (max-width: 600px) {
  .page-container {
    padding: 8px;
  }

  .inner-wrapper {
    padding: 0 4px;
  }

  .content-card :deep(.q-card__section) {
    padding: 8px;
  }

  .post-content {
    font-size: 13px;
  }

  .post-content :deep(td),
  .post-content :deep(th) {
    padding: 4px 6px;
    font-size: 12px;
  }
}

* {
  box-sizing: border-box;
}
</style> -->
