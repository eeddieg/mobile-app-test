<template>
  <div class="page-container">

    <div v-if="loading" class="full-width flex flex-center q-py-xl">
      <q-spinner-dots color="primary" size="48px" />
    </div>

    <div v-else-if="error" class="full-width flex flex-center column q-py-xl q-gutter-sm">
      <q-icon name="error_outline" color="negative" size="48px" />
      <div class="text-body2 text-grey-6">Αδυναμία φόρτωσης σελίδας</div>
      <q-btn flat color="primary" label="Επαναφόρτωση" @click="$emit('reload')" />
    </div>

    <div v-else-if="page" class="inner-wrapper">
      <div class="page-title q-mb-sm">{{ page.title.rendered }}</div>
      <div ref="contentRef">
        <q-card flat bordered class="content-card">
          <q-card-section>
            <div class="post-content" v-html="fixedContent" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat color="primary" icon="open_in_new" label="Άνοιγμα στο site" :href="page.link" target="_blank" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { fixWpImageUrls, fixBrokenImagesAsync, makePhoneNumbersClickable  } from 'src/utils/wpContent'
import type { WpPage } from 'src/models/models'

defineOptions({ name: 'WpDefaultPage' })

const props = defineProps<{
  page:    WpPage | null
  loading: boolean
  error:   boolean
}>()

defineEmits<{ reload: [] }>()

const contentRef = ref<HTMLElement | null>(null)

const fixedContent = computed(() => {
  if (!props.page) return ''
  const html = fixWpImageUrls(props.page.content.rendered)
  return makePhoneNumbersClickable(html)
})

async function runImageFix(): Promise<void> {
  await nextTick()
  await new Promise(r => setTimeout(r, 100))
  const postContent = contentRef.value?.querySelector<HTMLElement>('.post-content')
  if (postContent) await fixBrokenImagesAsync(postContent)
}

// Run image fix whenever page content changes
watch(() => props.page, async (newPage) => {
  if (newPage) await runImageFix()
}, { immediate: true })
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
  padding: 0 4px;
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
.content-wrapper { width: 100%; }
.content-card    { border-radius: 18px; }
.content-card :deep(.q-card__section) { padding: 12px; }

/* iframe — full width, auto height */
.wp-iframe {
  width: 100%;
  min-height: 600px;
  border: none;
  border-radius: 8px;
  display: block;
}

/* WP content */
.post-content { width: 100%; font-size: 14px; line-height: 1.7; overflow-wrap: break-word; word-break: break-word; }
.post-content :deep(h1) { font-size: clamp(1.1rem, 4vw, 1.6rem); font-weight: 700; margin: 8px 0 4px; line-height: 1.2; }
.post-content :deep(h2) { font-size: clamp(1rem, 3.5vw, 1.4rem); font-weight: 600; margin: 6px 0 4px; line-height: 1.2; }
.post-content :deep(h3), .post-content :deep(h4), .post-content :deep(h5) { font-size: clamp(0.9rem, 3vw, 1.1rem); font-weight: 600; margin: 6px 0 4px; line-height: 1.2; }
.post-content :deep(p)  { margin-bottom: 10px; }
.post-content :deep(a)  { color: #1976d2; word-break: break-word; }
.post-content :deep(ul), .post-content :deep(ol) { padding-left: 20px; margin-bottom: 10px; }
.post-content :deep(li) { margin-bottom: 4px; }
.post-content :deep(strong) { font-weight: 600; }
.post-content :deep(img) { max-width: 100% !important; height: auto !important; display: block; margin: 12px auto; border-radius: 8px; }
.post-content :deep(figure) { max-width: 100%; margin: 12px auto; text-align: center; }
.post-content :deep(figcaption) { font-size: 12px; color: #888; margin-top: 4px; }
.post-content :deep(table) { width: 100%; display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; border-collapse: collapse; margin-bottom: 12px; }
.post-content :deep(td), .post-content :deep(th) { padding: 6px 10px; border: 1px solid #ddd; font-size: 13px; vertical-align: top; }
.post-content :deep(thead) { background: #f5f5f5; font-weight: 600; }
.post-content :deep(tr:nth-child(even)) { background: #fafafa; }
.post-content :deep(iframe), .post-content :deep(video) { max-width: 100%; width: 100%; border: none; border-radius: 8px; }

@media (max-width: 600px) {
  .page-container { padding: 8px; }
  .inner-wrapper  { padding: 0 4px; }
  .content-card :deep(.q-card__section) { padding: 8px; }
  .post-content   { font-size: 13px; }
  .post-content :deep(td), .post-content :deep(th) { padding: 4px 6px; font-size: 12px; }
}
* { box-sizing: border-box; }
</style>
