<template>
  <div class="page-container">

    <!-- Header -->
    <div class="header-wrapper q-mb-md">
      <q-item-label
        class="text-center"
        :class="isMobile ? 'text-h6' : 'text-h3'"
      >
        {{ props.title }}
      </q-item-label>
    </div>

    <!-- Carousel — only for home/all posts -->
    <div v-if="!props.categorySlug" class="carousel-wrapper q-mb-lg">
      <q-carousel
        v-model="slide"
        animated swipeable infinite autoplay arrows navigation
        height="250px" class="rounded-borders"
      >
        <q-carousel-slide
          v-for="item in slides"
          :key="item.id"
          :name="item.id"
          :img-src="getSlideImage(item)"
        />
      </q-carousel>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="full-width flex flex-center q-py-xl">
      <q-spinner-dots color="primary" size="48px" />
    </div>

    <!-- Posts -->
    <div v-else class="inner-wrapper">

      <q-card
        v-for="post in posts"
        :key="post.id"
        class="q-mb-md post-card"
        flat bordered
        :style="{
          backgroundImage: `linear-gradient(
            rgba(0,0,0,0.65),
            rgba(0,0,0,0.80)
          ), url('${getImage(post) ?? ''}')`
        }"
      >
        <!-- Title + date -->
        <q-card-section>
          <div class="text-h6 text-weight-bold text-white">
            {{ decodeHtmlEntities(post.title.rendered) }}
          </div>
          <div class="text-caption text-grey-3">
            {{ new Date(post.date).toLocaleDateString('el-GR') }}
          </div>
        </q-card-section>

        <!-- Excerpt / Full content -->
        <q-card-section>
          <div
            v-if="!isExpanded(post.id)"
            class="post-content"
            v-html="cleanExcerpt(post.excerpt.rendered)"
          />
          <q-slide-transition>
            <div
              v-if="isExpanded(post.id)"
              class="post-content"
              v-html="fixWpImageUrls(post.content.rendered)"
            />
          </q-slide-transition>
        </q-card-section>

        <!-- Actions -->
        <q-card-actions align="right">
          <q-btn
            flat
            color="white"
            :label="isExpanded(post.id) ? 'Λιγότερα' : 'Διαβάστε περισσότερα'"
            @click="togglePost(post.id)"
          />
          <q-btn
            flat
            color="white"
            icon="open_in_new"
            label="Άνοιγμα στο site"
            :href="post.link"
          />
        </q-card-actions>

      </q-card>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex flex-center q-mt-md q-mb-xl">
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          :max-pages="5"
          boundary-links
          direction-links
          color="primary"
          @update:model-value="onPageChange"
        />
      </div>

    </div>

    <div class="footer-area">
      <i class="responsive-text">{{ footer }}</i>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { postListStore }  from 'src/stores/postlist.store'
import { screenStore }    from 'src/stores/screen.store'
import { fixWpImageUrls, decodeHtmlEntities } from 'src/utils/wpContent'
import type { MediaItem, WPPostExtended } from '../models/models'

defineOptions({ name: 'PostListComponent' })

const store  = postListStore()
const screen = screenStore()

const isMobile = computed(() => screen.isMobile)

const props = defineProps<{
  title:         string
  categorySlug?: string
}>()

const posts         = ref<WPPostExtended[]>([])
const expandedPosts = ref<number[]>([])
const slides        = ref<MediaItem[]>([])
const slide         = ref<number | null>(null)
const footer        = ref('')
const loading       = ref(false)
const currentPage   = ref(1)
const totalPages    = ref(1)

const resizeHandler = () => screen.updateScreenWidth()

onMounted(async () => {
  screen.detectDevice()
  window.addEventListener('resize', resizeHandler)

  await Promise.all([
    retrievePosts(1),
    props.categorySlug ? Promise.resolve() : retrieveCarousel(),
  ])
})

watch(() => props.categorySlug, async (newSlug, oldSlug) => {
  if (newSlug === oldSlug) return
  currentPage.value   = 1
  expandedPosts.value = []
  await retrievePosts(1)
})

onUnmounted(() => window.removeEventListener('resize', resizeHandler))

function getImage(post: WPPostExtended): string | null {
  return (
    post.uagb_featured_image_src?.full?.[0] ||
    post.uagb_featured_image_src?.large?.[0] ||
    post.uagb_featured_image_src?.medium_large?.[0] ||
    null
  )
}

function getSlideImage(item: MediaItem): string {
  return (
    item.media_details?.sizes?.large?.source_url  ||
    item.media_details?.sizes?.medium?.source_url ||
    item.source_url
  )
}

function isExpanded(postId: number): boolean {
  return expandedPosts.value.includes(postId)
}

function togglePost(postId: number): void {
  if (isExpanded(postId)) {
    expandedPosts.value = expandedPosts.value.filter(id => id !== postId)
  } else {
    expandedPosts.value.push(postId)
  }
}

async function retrievePosts(page: number): Promise<void> {
  loading.value = true
  try {
    if (props.categorySlug) {
      const result = await store.fetchPostsByCategory(props.categorySlug, page)
      if (result) {
        posts.value      = result.posts
        totalPages.value = result.totalPages
      }
    } else {
      const data = await store.fetchPosts()
      if (data) posts.value = data
    }
  } finally {
    loading.value = false
  }
}

async function onPageChange(page: number): Promise<void> {
  expandedPosts.value = []
  window.scrollTo({ top: 0, behavior: 'smooth' })
  await retrievePosts(page)
}

async function retrieveCarousel(): Promise<void> {
  const data = await store.fetchCarousel()
  if (data?.length) {
    slides.value = data
    slide.value  = data[0]?.id ?? null
  }
}

// Strip category links from excerpt
function cleanExcerpt(html: string): string {
  if (!html) return ''
  const parser = new DOMParser()
  const doc    = parser.parseFromString(html, 'text/html')

  // Remove any paragraph that contains ONLY links (category links)
  doc.querySelectorAll('p').forEach(p => {
    const text  = p.textContent?.trim() ?? ''
    const links = p.querySelectorAll('a')
    if (links.length > 0 && [...links].map(a => a.textContent).join('').trim() === text) {
      p.remove()
    }
  })

  // Remove any remaining standalone links
  doc.querySelectorAll('a').forEach(a => a.remove())

  return doc.body.innerHTML.trim()
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
.carousel-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}
.carousel-wrapper .q-carousel {
  width: 100%;
  max-width: 900px;
  border-radius: 16px;
  overflow: hidden;
}
.footer-area {
  text-align: center;
  margin-top: 20px;
}
.post-card {
  border-radius: 18px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 180px;
  color: white;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.35);
}
.q-card__section, .q-card__actions {
  position: relative;
  z-index: 2;
}
.post-content {
  width: 100%;
  font-size: 14px;
  line-height: 1.7;
  color: white;
  overflow-wrap: break-word;
  word-break: break-word;
}
.post-content :deep(p)   { margin-bottom: 12px; }
.post-content :deep(a)   { color: #90caf9; word-break: break-word; }
.post-content :deep(ul), .post-content :deep(ol) { padding-left: 20px; }
.post-content :deep(img) {
  max-width: 100% !important;
  height: auto !important;
  display: block;
  margin: 16px auto;
  object-fit: contain;
  border-radius: 8px;
}
.post-content :deep(figure)  { max-width: 100%; margin: 16px auto; text-align: center; }
.post-content :deep(table)   { width: 100%; display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.post-content :deep(iframe), .post-content :deep(video) { max-width: 100%; width: 100%; }
.responsive-text {
  font-size: clamp(10px, 2vw, 16px);
  line-height: 1.3;
}
@media (max-width: 600px) {
  .page-container { padding: 8px; }
  .carousel-wrapper .q-carousel { border-radius: 12px; }
  .post-card { min-height: 140px; }
}
* { box-sizing: border-box; }
</style>
