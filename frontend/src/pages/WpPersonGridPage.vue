<template>
  <div class="page-container">

    <div v-if="loading || initialLoading" class="full-width flex flex-center q-py-xl">
      <q-spinner-dots color="primary" size="48px" />
    </div>

    <div v-else-if="error" class="full-width flex flex-center column q-py-xl q-gutter-sm">
      <q-icon name="error_outline" color="negative" size="48px" />
      <div class="text-body2 text-grey-6">Αδυναμία φόρτωσης σελίδας</div>
      <q-btn flat color="primary" label="Επαναφόρτωση" @click="$emit('reload')" />
    </div>

    <div v-else-if="page" class="inner-wrapper">

      <div class="page-title q-mb-sm">{{ page.title.rendered }}</div>
      <div v-if="sectionTitle" class="section-title q-mb-sm">{{ sectionTitle }}</div>
      <div v-if="clinicInfoHtml" class="clinic-info q-mb-md" v-html="clinicInfoHtml" />

      <div class="people-grid">
        <q-card
          v-for="(person, i) in people"
          :key="i"
          flat
          bordered
          class="person-card"
        >
          <div class="photo-wrapper">
            <img
              v-if="person.image"
              :src="resolveImgSrc(person.image)"
              class="person-photo"
              :alt="person.name"
              @error="onImgError"
            />
            <div v-else class="photo-fallback">
              <q-icon name="account_circle" size="64px" color="grey-5" />
            </div>
          </div>

          <q-card-section class="text-center q-pb-none">
            <div v-if="person.role" class="role-badge">{{ person.role }}</div>
            <div class="text-subtitle1 text-weight-bold q-mt-xs">{{ person.name }}</div>
          </q-card-section>

          <q-card-section class="text-center q-pt-xs q-pb-none">
            <div v-for="(line, j) in person.lines" :key="j" class="text-caption text-grey-7">
              {{ line }}
            </div>
          </q-card-section>

          <q-card-section v-if="person.personLink" class="text-center q-pt-xs">
            <a :href="person.personLink" class="more-link">Περισσότερα →</a>
          </q-card-section>
        </q-card>
      </div>

      <div v-if="loadingMore" class="full-width flex flex-center q-py-md">
        <q-spinner-dots color="primary" size="32px" />
      </div>

      <div class="q-mt-md flex justify-end">
        <q-btn
          flat color="primary" icon="open_in_new" label="Άνοιγμα στο site"
          :href="page.link" target="_blank" data-external-browser
        />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { wpPageStore } from 'src/stores/wpPage.store'
import type { WpPage } from '../models/models'

defineOptions({ name: 'WpPersonGridPage' })

const props = defineProps<{
  page:    WpPage | null
  loading: boolean
  error:   boolean
}>()

defineEmits<{ reload: [] }>()

const store = wpPageStore()

interface PersonEntry {
  role:       string
  name:       string
  lines:      string[]
  tags:       string[]
  image:      string
  personLink: string
}

const people      = ref<PersonEntry[]>([])
const loadingMore = ref(false)

const MAX_EXTRA_PAGES = 5

const initialLoading = ref(true)
function parseContent(): Document | null {
  if (!props.page) return null
  const parser = new DOMParser()
  return parser.parseFromString(props.page.content.rendered, 'text/html')
}

const sectionTitle = computed(() => {
  const doc = parseContent()
  if (!doc) return ''
  const h2 = doc.querySelector('h2')
  return h2?.textContent?.trim() ?? ''
})

const clinicInfoHtml = computed(() => {
  const doc = parseContent()
  if (!doc) return ''
  for (const el of Array.from(doc.body.children)) {
    const tag = el.tagName.toLowerCase()
    if (tag === 'h3') break
    if (tag === 'p') return el.innerHTML
  }
  return ''
})

function extractPeopleFromHtml(html: string): { people: PersonEntry[]; moreUrl: string } {
  const parser = new DOMParser()
  const doc    = parser.parseFromString(html, 'text/html')

  const blogBlocks = doc.querySelectorAll('.uabb-blog-post-content')
  const people = blogBlocks.length
    ? extractFromBlogGrid(doc, blogBlocks)
    : extractFlat(doc)

  return { people, moreUrl: findNextPageUrl(doc) }
}

function splitOnBreaks(doc: Document, container: Element): string[] {
  const lines: string[] = []
  const parts = container.innerHTML.split(/<br\s*\/?>/i)
  parts.forEach(part => {
    const div = doc.createElement('div')
    div.innerHTML = part
    const text = div.textContent?.trim() ?? ''
    if (text) lines.push(text)
  })
  return lines
}

function extractFromBlogGrid(doc: Document, blocks: NodeListOf<Element>): PersonEntry[] {
  const h3   = Array.from(doc.querySelectorAll('h3')).find(h => h.textContent?.trim())
  const role = h3?.textContent?.trim() ?? ''

  const entries: PersonEntry[] = []

  blocks.forEach(block => {
    const nameA = block.querySelector('h4 a')
    const name  = nameA?.textContent?.trim() ?? block.querySelector('h4')?.textContent?.trim() ?? ''
    if (!name) return

    const tags: string[] = []
    block.querySelectorAll('h5 a').forEach(a => {
      const t = a.textContent?.trim()
      if (t) tags.push(t)
    })

    const descBlock = block.querySelector('.uabb-blog-posts-description')
    const lines      = descBlock ? splitOnBreaks(doc, descBlock) : []

    const img   = block.closest('.uabb-post-wrapper')?.querySelector('img')
    const image = img?.getAttribute('src') ?? ''

    entries.push({
      role,
      name,
      lines,
      tags,
      image,
      personLink: nameA?.getAttribute('href') ?? '',
    })
  })

  return entries
}

function extractFlat(doc: Document): PersonEntry[] {
  const entries: PersonEntry[] = []
  let current: PersonEntry | null = null
  let pendingRole    = ''
  let pendingImage   = ''
  let sectionStarted = false

  function handleText(node: ChildNode): void {
    const text = node.textContent?.trim() ?? ''
    if (text && current) current.lines.push(text)
  }

  function walk(node: ChildNode): void {
    if (node.nodeType === Node.TEXT_NODE) { handleText(node); return }
    if (node.nodeType !== Node.ELEMENT_NODE) return

    const el  = node as HTMLElement
    const tag = el.tagName.toLowerCase()

    if (tag === 'script' || tag === 'style') return
    if (tag === 'h1' || tag === 'h2' || tag === 'p' || tag === 'ul' || tag === 'a') return

    if (tag === 'h3') {
      if (current) { entries.push(current); current = null }
      pendingRole    = el.textContent?.trim() ?? ''
      sectionStarted = true
      return
    }

    if (tag === 'img') {
      const src = el.getAttribute('src') ?? ''
      if (!src || !sectionStarted) return
      if (current && !current.image) current.image = src
      else if (!current) pendingImage = src
      return
    }

    if (tag === 'h4') {
      if (current) entries.push(current)
      const link = el.querySelector('a')
      current = {
        role: pendingRole, name: el.textContent?.trim() ?? '',
        lines: [], tags: [], image: pendingImage,
        personLink: link?.getAttribute('href') ?? '',
      }
      pendingImage = ''
      return
    }

    if (tag === 'h5') {
      if (!current) return
      if (el.querySelector('a')) {
        el.querySelectorAll('a').forEach(a => {
          const t = a.textContent?.trim()
          if (t) current!.tags.push(t)
        })
      } else {
        const text = el.textContent?.trim() ?? ''
        if (text) current.lines.push(text)
      }
      return
    }

    for (const child of Array.from(el.childNodes)) walk(child)
  }

  for (const child of Array.from(doc.body.childNodes)) walk(child)
  if (current) entries.push(current)
  return entries
}

function findNextPageUrl(doc: Document): string {
  const items = Array.from(doc.querySelectorAll('ul.page-numbers > li'))
  if (!items.length) return ''

  const currentIndex = items.findIndex(li => {
    if (li.querySelector('.current')) return true
    return !li.querySelector('a') && !!li.textContent?.trim()
  })
  if (currentIndex === -1) return ''

  const nextLi = items[currentIndex + 1]
  const nextA  = nextLi?.querySelector('a')
  return nextA?.getAttribute('href') ?? ''
}


async function loadAllPeople(): Promise<void> {
  people.value = []
  if (!props.page) return

  initialLoading.value = true

  const DYNAMIC_LISTING_LINK_FRAGMENTS = [
    'iatriko-prosopiko', 'nosileutiko', 'psixologoi',
    '%ce%b9%ce%b1%cf%84%cf%81%ce%b9%ce%ba%cf%8c-%cf%80%cf%81%ce%bf%cf%83%cf%89%cf%80%ce%b9%ce%ba%cf%8c', // ιατρικό-προσωπικό
    '%ce%bd%ce%bf%cf%83%ce%b7%ce%bb%ce%b5%cf%85%cf%84%ce%b9%ce%ba%cf%8c-%cf%80%cf%81%ce%bf%cf%83%cf%89%cf%80%ce%b9%ce%ba%cf%8c', // νοσηλευτικό-προσωπικό
    '%cf%88%cf%85%cf%87%ce%bf%ce%bb%ce%bf%ce%b3%ce%bf%ce%b9', // ψυχολογοι
  ]

  const isDynamicListing = DYNAMIC_LISTING_LINK_FRAGMENTS.some(fragment =>
  props.page!.link.toLowerCase().includes(fragment)
)
  let firstPagePeople: PersonEntry[] = []
  let nextUrl = ''

  if (isDynamicListing) {
    const live = await store.fetchCleanPage(props.page.link)

    if (live?.html) {
      const liveParsed = extractPeopleFromHtml(live.html)
      firstPagePeople = liveParsed.people
      nextUrl = liveParsed.moreUrl
    }
  }

  if (!firstPagePeople.length) {
    const restParsed = extractPeopleFromHtml(props.page.content.rendered)
    firstPagePeople = restParsed.people
    nextUrl = restParsed.moreUrl
  }

  const seen: Map<string, PersonEntry> = new Map()
  firstPagePeople.forEach(p => { if (p.name && !seen.has(p.name)) seen.set(p.name, p) })
  people.value = Array.from(seen.values())
  initialLoading.value = false

  let guard = 0
  while (nextUrl && guard < MAX_EXTRA_PAGES) {
    guard++
    loadingMore.value = true
    const result = await store.fetchCleanPage(nextUrl)
    loadingMore.value = false

    if (!result?.html) break
    const parsed = extractPeopleFromHtml(result.html)
    if (!parsed.people.length && !parsed.moreUrl) break

    let addedAny = false
    parsed.people.forEach(p => {
      if (p.name && !seen.has(p.name)) { seen.set(p.name, p); addedAny = true }
    })
    if (addedAny) people.value = Array.from(seen.values())

    if (parsed.moreUrl === nextUrl) break
    nextUrl = parsed.moreUrl
  }
}

watch(() => props.page, loadAllPeople, { immediate: true })

function resolveImgSrc(src: string): string {
  if (!src) return ''
  const parts    = src.split('/')
  const filename = parts.pop() ?? ''
  const encoded  = filename.split('').map(c =>
    /[^\u0020-\u007E]/.test(c) ? encodeURIComponent(c) : c
  ).join('')
  return [...parts, encoded].join('/')
}

function onImgError(e: Event): void {
  (e.target as HTMLImageElement).style.display = 'none'
}
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
  max-width: 1000px;
  padding: 0 4px;
  box-sizing: border-box;
}
.page-title {
  font-size: clamp(1rem, 4vw, 1.8rem);
  font-weight: 600;
  text-align: center;
}
.section-title {
  font-size: clamp(0.9rem, 3vw, 1.2rem);
  font-weight: 500;
  text-align: center;
  color: #1976d2;
}
.clinic-info {
  width: 100%;
  text-align: center;
  font-size: 14px;
  line-height: 1.7;
  color: #444;
}
.clinic-info :deep(a) { color: #1976d2; text-decoration: none; }

.people-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.person-card-link { text-decoration: none; color: inherit; display: block; }

.person-card {
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.photo-wrapper {
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.person-photo { width: 100%; height: 100%; object-fit: cover; display: block; }
.photo-fallback { display: flex; align-items: center; justify-content: center; }

.role-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  color: #1976d2;
  background: #e3f2fd;
  padding: 2px 10px;
  border-radius: 12px;
}

.more-link {
  color: #1976d2;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
}
.more-link:hover { text-decoration: underline; }

@media (max-width: 600px) {
  .people-grid { grid-template-columns: 1fr; }
  .page-container { padding: 8px; }
}
* { box-sizing: border-box; }
</style>
