<template>
  <component
    :is="pageComponent"
    :page="page"
    :loading="loading"
    :error="error"
    :related-category="relatedCategory"
    :related-title="relatedTitle"
    @reload="load"
  />
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
  'apostoli':             defineAsyncComponent(() => import("../pages/WpIconListPage.vue")),
  'grammi-ypostiriksis':  defineAsyncComponent(() => import("../pages/WpDefaultPage.vue")),
  'faq':                  defineAsyncComponent(() => import('../pages/WpFaqPage.vue')),

}

const RELATED_CATEGORIES: Record<string, { category: string; title: string }> = {
  'trapeza-aimatos': { category: 'αιμοδοσία',     title: 'Αιμοδοσίες' },
  'aimodosia':       { category: 'αιμοδοσία',     title: 'Αιμοδοσίες' },
}

const relatedCategory = computed(() => {
  const slug = route.params.slug as string
  return RELATED_CATEGORIES[slug]?.category ?? ''
})

const relatedTitle = computed(() => {
  const slug = route.params.slug as string
  return RELATED_CATEGORIES[slug]?.title ?? ''
})

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
