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

      <!-- Main text content -->
      <q-card flat bordered class="content-card q-mb-md">
        <q-card-section>

          <div v-if="sectionTitle" class="text-subtitle2 text-grey-6 q-mb-xs">
            {{ sectionTitle }}
          </div>
          <div class="text-h6 text-weight-bold q-mb-md">{{ page.title.rendered }}</div>

          <!-- Big image -->
          <div v-if="mainImage" class="main-image-wrapper q-mb-md">
            <img :src="mainImage" class="main-image" :alt="page.title.rendered" />
          </div>

          <!-- α β γ δ ε list -->
          <q-list separator>
            <q-item v-for="item in listItems" :key="item.letter" class="q-py-sm">
              <q-item-section avatar top>
                <div class="letter-badge">{{ item.letter }}</div>
              </q-item-section>
              <!-- <q-item-section>
                <q-item-label class="text-body2" v-html="formatText(item.text)" />
              </q-item-section> -->
              <q-item-section>
                <div class="text-body2" v-html="formatText(item.text)" />
              </q-item-section>
            </q-item>
          </q-list>

        </q-card-section>
      </q-card>

      <!-- Feature cards with actual images from WP -->
      <div v-if="featureItems.length" class="features-grid q-mb-md">
        <q-card
          v-for="(feature, i) in featureItems"
          :key="i"
          flat
          bordered
          class="feature-card"
        >
          <q-card-section class="text-center q-pa-md">
            <!-- Real image from WP if available, else Material icon fallback -->
            <img
              v-if="feature.image"
              :src="feature.image"
              class="feature-img q-mb-sm"
              :alt="feature.title"
            />
            <q-icon
              v-else
              :name="iconFor(i)"
              size="40px"
              :color="colorFor(i)"
              class="q-mb-sm"
            />
            <div class="text-subtitle2 text-weight-bold">{{ feature.title }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="q-mt-sm flex justify-end">
        <q-btn
          flat
          color="primary"
          icon="open_in_new"
          label="Άνοιγμα στο site"
          :href="page.link"
          target="_blank"
        />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { WpPage } from "../models/models"
  import { makePhoneNumbersClickable } from "../utils/wpContent"

  defineOptions({ name: 'WpIconListPage' })

  const props = defineProps<{
    page:    WpPage | null
    loading: boolean
    error:   boolean
  }>()

  defineEmits<{ reload: [] }>()

  function parseContent() {
    if (!props.page) return null
    const parser = new DOMParser()
    return parser.parseFromString(props.page.content.rendered, 'text/html')
  }

  const sectionTitle = computed(() => {
    const doc = parseContent()
    if (!doc) return ''
    const h1 = doc.querySelector('h1')
    return h1?.textContent?.trim() ?? ''
  })

  const listItems = computed(() => {
    const doc = parseContent()
    if (!doc) return []
    const items: { letter: string; text: string }[] = []

    doc.querySelectorAll('p').forEach(p => {
      const text = p.textContent?.trim() ?? ''
      const match = text.match(/^([α-ωΑ-Ω])\.\s+(.+)/)
      if (match?.[1] && match?.[2]) {
        items.push({ letter: match[1], text: match[2] })
      }
    })

    return items
  })

  const mainImage = computed(() => {
    const doc = parseContent()
    if (!doc) return ''

    const imgs = doc.querySelectorAll<HTMLImageElement>('p > img, figure > img, .wp-block-image img')
    if (imgs.length) {
      const first = imgs[0]
      if (first) return resolveImgSrc(first)
    }

    const allImgs = doc.querySelectorAll<HTMLImageElement>('img')
    for (const img of Array.from(allImgs)) {
      if (!img.closest('ul') && !img.closest('li')) {
        return resolveImgSrc(img)
      }
    }
    return ''
  })

  const featureItems = computed(() => {
    const doc = parseContent()
    if (!doc) return []

    const items: { image: string; title: string }[] = []

    doc.querySelectorAll('li').forEach(li => {
      const img   = li.querySelector('img')
      const h5    = li.querySelector('h5, h4, h3, strong')
      const title = h5?.textContent?.trim() ?? li.textContent?.trim() ?? ''

      if (title) {
        items.push({
          image: img ? resolveImgSrc(img) : '',
          title,
        })
      }
    })

    return items
  })

  function formatText(text: string): string {
    return makePhoneNumbersClickable(text)
  }

  function resolveImgSrc(img: HTMLImageElement): string {
    const src = img.getAttribute('src') ?? ''
    if (!src) return ''
    const parts = src.split('/')
    const filename = parts.pop() ?? ''
    const encoded = filename.split('').map(c =>
      /[^\u0020-\u007E]/.test(c) ? encodeURIComponent(c) : c
    ).join('')
    return [...parts, encoded].join('/')
  }

  const ICONS  = ['health_and_safety', 'support_agent', 'calendar_today']
  const COLORS = ['blue-7', 'green-7', 'orange-7']

  function iconFor(i: number):  string { return ICONS[i]  ?? 'star' }
  function colorFor(i: number): string { return COLORS[i] ?? 'primary' }
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
.page-title {
  font-size: clamp(1rem, 4vw, 1.8rem);
  font-weight: 600;
  text-align: center;
  line-height: 1.3;
  word-break: break-word;
  padding: 0 8px;
  margin-bottom: 8px;
}
.inner-wrapper {
  width: 100%;
  max-width: 900px;
  padding: 0 4px;
  box-sizing: border-box;
}
.content-card { border-radius: 18px; }

.main-image-wrapper { text-align: center; }
.main-image {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  display: inline-block;
}

.letter-badge {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #1976d2;
  color: white;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.feature-card  { border-radius: 14px; }
.feature-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  display: block;
  margin: 0 auto 8px;
}

@media (max-width: 480px) {
  .features-grid  { grid-template-columns: 1fr; }
  .page-container { padding: 8px; }
}
* { box-sizing: border-box; }
</style>
