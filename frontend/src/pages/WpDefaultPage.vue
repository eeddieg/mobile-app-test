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

      <div
        class="page-title q-mb-sm"
        v-html="makePhoneNumbersClickable(page.title.rendered)"
      />

      <!-- Static content card -->
      <div ref="contentRef">
        <q-card flat bordered class="content-card q-mb-md">
          <q-card-section>
            <div
              class="post-content"
              v-html="staticContent"
              @click.capture="interceptLinks"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              color="primary"
              icon="open_in_new"
              label="Άνοιγμα στο site"
              :href="page.link"
            />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Related posts section -->
      <template v-if="relatedPosts.length">
        <div class="text-subtitle1 text-weight-bold q-mb-sm q-mt-md q-pl-xs">
          {{ relatedSectionTitle }}
        </div>

        <q-card
          v-for="post in relatedPosts"
          :key="post.id"
          flat bordered
          class="q-mb-md article-card"
          :style="getPostImage(post) ? {
            backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.80)), url('${getPostImage(post)}')`
          } : {}"
        >
          <q-card-section>
            <div
              class="text-subtitle1 text-weight-bold"
              :class="getPostImage(post) ? 'text-white' : ''"
            >
              {{ decodeHtmlEntities(post.title.rendered) }}
            </div>
            <div
              class="text-caption q-mt-xs"
              :class="getPostImage(post) ? 'text-grey-3' : 'text-grey-6'"
            >
              {{ new Date(post.date).toLocaleDateString('el-GR') }}
            </div>
          </q-card-section>

          <q-card-section>
            <div
              v-if="!isExpanded(post.id)"
              class="post-content"
              :class="getPostImage(post) ? 'text-white' : ''"
              v-html="cleanExcerpt(post.excerpt.rendered)"
            />
            <q-slide-transition>
              <div
                v-if="isExpanded(post.id)"
                class="post-content"
                :class="getPostImage(post) ? 'text-white' : ''"
                v-html="fixWpImageUrls(post.content.rendered)"
              />
            </q-slide-transition>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              :color="getPostImage(post) ? 'white' : 'primary'"
              :label="isExpanded(post.id) ? 'Λιγότερα' : 'Διαβάστε περισσότερα'"
              @click="togglePost(post.id)"
            />
            <q-btn
              flat
              :color="getPostImage(post) ? 'white' : 'primary'"
              icon="open_in_new"
              label="Άνοιγμα στο site"
              :href="post.link"
            />
          </q-card-actions>
        </q-card>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { postListStore } from "../stores/postlist.store"
import type { WpPage, WPPostExtended } from "../models/models"
import {
  decodeHtmlEntities,
  fixBrokenImagesAsync,
  fixWpImageUrls,
  makePhoneNumbersClickable,
  normalizeTableRows,
  sanitizeWpContent
} from "../utils/wpContent"

defineOptions({ name: 'WpDefaultPage' })

const props = defineProps<{
  page:             WpPage | null
  loading:          boolean
  error:            boolean
  relatedCategory?: string
  relatedTitle?:    string
}>()

defineEmits<{ reload: [] }>()

const store      = postListStore()
const contentRef = ref<HTMLElement | null>(null)

const relatedPosts        = ref<WPPostExtended[]>([])
const expandedPosts       = ref<number[]>([])
const relatedSectionTitle = computed(() => props.relatedTitle ?? 'Σχετικά Άρθρα')

// Strip embedded post loop from static content
// Keep only content before the first article-style h3>a block
const staticContent = computed(() => {
  if (!props.page) return ''

  const parser = new DOMParser()
  const doc    = parser.parseFromString(props.page.content.rendered, 'text/html')

  const toRemove: ChildNode[] = []
  let cutFrom: ChildNode | null = null

  for (const node of Array.from(doc.body.childNodes)) {
    if (node.nodeType !== Node.ELEMENT_NODE) continue
    const el  = node as HTMLElement
    const tag = el.tagName.toLowerCase()

    // Stop at article list section (h3 with anchor = post title)
    if ((tag === 'h3' || tag === 'h2') && el.querySelector('a') && props.relatedCategory) {
      cutFrom = node
      break
    }

    // Skip the section title heading that matches relatedTitle
    if ((tag === 'h2' || tag === 'h3') && props.relatedTitle) {
      if (el.textContent?.trim() === props.relatedTitle) {
        toRemove.push(node)
        continue
      }
    }

    // Skip "Περισσότερα" links
    if (tag === 'a' && el.textContent?.includes('Περισσότερα')) {
      toRemove.push(node)
      continue
    }

    // Skip image+link blocks belonging to related posts
    if (tag === 'a' && el.querySelector('img') && props.relatedCategory) {
      toRemove.push(node)
      continue
    }
  }

  // Remove everything from the cut point to the end of body
  if (cutFrom) {
    let node: ChildNode | null = cutFrom
    while (node) {
      const next: ChildNode | null = node.nextSibling
      node.remove()
      node = next
    }
  }

  toRemove.forEach(n => n.remove())

  // innerHTML walks ALL node types (text + elements), unlike
  // rebuilding from .children[].outerHTML which drops loose text nodes
  let html = doc.body.innerHTML
  html = sanitizeWpContent(html)
  html = fixWpImageUrls(html)
  html = makePhoneNumbersClickable(html)
  html = normalizeTableRows(html)
  return html
})

// Fetch related posts when category prop is provided
watch(() => props.relatedCategory, async (cat) => {
  if (!cat) return
  const result = await store.fetchPostsByCategory(cat, 1)
  if (result) relatedPosts.value = result.posts
}, { immediate: true })


watch(() => props.page, async (newPage) => {
  if (newPage) {
    await nextTick()
    await new Promise(r => setTimeout(r, 100))
    const postContent = contentRef.value?.querySelector<HTMLElement>('.post-content')
    if (postContent) await fixBrokenImagesAsync(postContent)
  }
}, { immediate: true })

function isExpanded(id: number): boolean {
  return expandedPosts.value.includes(id)
}

function togglePost(id: number): void {
  if (isExpanded(id)) {
    expandedPosts.value = expandedPosts.value.filter(x => x !== id)
  } else {
    expandedPosts.value.push(id)
  }
}

function getPostImage(post: WPPostExtended): string {
  return (
    post.uagb_featured_image_src?.large?.[0] ||
    post.uagb_featured_image_src?.medium_large?.[0] ||
    post.uagb_featured_image_src?.full?.[0] ||
    ''
  )
}

function cleanExcerpt(html: string): string {
  if (!html) return ''
  const parser = new DOMParser()
  const doc    = parser.parseFromString(html, 'text/html')
  doc.querySelectorAll('p').forEach(p => {
    const text  = p.textContent?.trim() ?? ''
    const links = p.querySelectorAll('a')
    if (links.length > 0 && [...links].map(a => a.textContent).join('').trim() === text) {
      p.remove()
    }
  })
  doc.querySelectorAll('a').forEach(a => a.remove())
  return doc.body.innerHTML.trim()
}

function interceptLinks(e: MouseEvent): void {
  const anchor = (e.target as HTMLElement).closest('a')
  if (!anchor) return
  const href = anchor.getAttribute('href') ?? ''
  if (href.startsWith('tel:') || href.startsWith('mailto:')) return
  if (anchor.getAttribute('target') === '_blank') return
  e.preventDefault()
  e.stopPropagation()
}

</script>


<style scoped>
* {
  box-sizing: border-box;
}

.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  padding: 16px;
  box-sizing: border-box;
}

.page-title {
  margin-bottom: 8px;
  padding: 0 8px;
  font-size: clamp(1rem, 4vw, 1.8rem);
  font-weight: 600;
  line-height: 1.3;
  text-align: center;
  word-break: break-word;
}

.inner-wrapper {
  width: 100%;
  max-width: 900px;
  padding: 0 4px;
  box-sizing: border-box;
}

.content-card {
  border-radius: 18px;
}

.content-card :deep(.q-card__section) {
  padding: 12px;
}

.article-card {
  overflow: hidden;
  min-height: 120px;
  border-radius: 18px;
  background-position: center;
  background-size: cover;
}

.post-content {
  width: 100%;
  font-size: 14px;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
}

.post-content :deep(h1) {
  margin: 8px 0 4px;
  font-size: clamp(1.1rem, 4vw, 1.6rem);
  font-weight: 700;
}

.post-content :deep(h1 a[href^="tel:"]) {
  color: #1976d2 !important;
  text-decoration: none;
}

.post-content :deep(h2) {
  margin: 6px 0 4px;
  font-size: clamp(1rem, 3.5vw, 1.4rem);
  font-weight: 600;
}

.post-content :deep(h3),
.post-content :deep(h4),
.post-content :deep(h5) {
  margin: 6px 0 4px;
  font-size: clamp(0.9rem, 3vw, 1.1rem);
  font-weight: 600;
}

.post-content :deep(p) {
  margin-bottom: 10px;
}

.post-content :deep(p:has(> a:first-child)) {
  position: relative;
  padding-left: 18px;
}

.post-content :deep(p:has(> a:first-child))::before {
  content: "•";
  position: absolute;
  left: 4px;
  color: #1976d2;
}

.post-content :deep(a) {
  color: #1976d2;
  word-break: break-word;
}

.post-content :deep(ul),
.post-content :deep(ol) {
  margin-bottom: 10px;
  padding-left: 20px;
}

.post-content :deep(li) {
  margin-bottom: 4px;
}

.post-content :deep(strong) {
  font-weight: 600;
}

.post-content :deep(img) {
  display: block;
  max-width: 100% !important;
  height: auto !important;
  margin: 12px auto;
  border-radius: 8px;
}

.post-content :deep(figure) {
  max-width: 100%;
  margin: 12px auto;
  text-align: center;
}

.post-content :deep(table) {
  display: block;
  width: 100%;
  margin-bottom: 12px;
  overflow-x: auto;
  border-collapse: collapse;
}

.post-content :deep(td),
.post-content :deep(th) {
  padding: 6px 10px;
  border: 1px solid #ddd;
  font-size: 13px;
  vertical-align: top;
}

.post-content :deep(thead) {
  font-weight: 600;
  background: #f5f5f5;
}

.post-content :deep(tr:nth-child(even)) {
  background: #fafafa;
}

.post-content :deep(iframe),
.post-content :deep(video) {
  width: 100%;
  max-width: 100%;
  border: none;
  border-radius: 8px;
}

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
}
</style>
