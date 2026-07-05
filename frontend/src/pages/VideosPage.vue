<template>
  <div class="page-container">

    <div class="page-title q-mb-md">ΒΙΝΤΕΟ</div>

    <div v-if="loading" class="full-width flex flex-center q-py-xl">
      <q-spinner-dots color="primary" size="48px" />
    </div>

    <div v-else-if="!posts.length" class="full-width flex flex-center q-py-xl">
      <div class="text-body2 text-grey-6">Δεν βρέθηκαν βίντεο</div>
    </div>

    <div v-else class="inner-wrapper">
      <q-card
        v-for="post in posts"
        :key="post.id"
        flat
        bordered
        clickable
        class="q-mb-md video-card cursor-pointer"
        @click="openVideo(post)"
      >
        <!-- Thumbnail -->
        <div
          class="video-thumb"
          :style="getThumbStyle(post)"
        >
          <div class="thumb-overlay">
            <q-icon name="play_circle" size="56px" color="white" />
          </div>
        </div>

        <q-card-section>
          <div class="text-subtitle2 text-weight-bold">
            {{ decodeHtmlEntities(post.title.rendered) }}
          </div>
          <div class="text-caption text-grey-6 q-mt-xs">
            {{ new Date(post.date).toLocaleDateString('el-GR') }}
          </div>
        </q-card-section>

      </q-card>
    </div>

    <!-- Video Dialog -->
    <q-dialog v-model="dialogOpen" maximized>
      <q-card class="dialog-card">

        <q-bar class="bg-primary text-white">
          <div class="text-subtitle2 ellipsis">
            {{ decodeHtmlEntities(selectedPost?.title.rendered ?? '') }}
          </div>
          <q-space />
          <q-btn dense flat icon="close" @click="closeVideo" />
        </q-bar>

        <q-card-section class="q-pa-none">

          <!-- Embedded video -->
          <div v-if="selectedEmbedUrl" class="video-wrapper">
            <iframe
              :src="selectedEmbedUrl"
              frameborder="0"
              allowfullscreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              class="video-iframe"
            />
          </div>

          <!-- No embed found — show content -->
          <div v-else class="q-pa-md">
            <div
              class="post-content"
              v-html="selectedPost?.content.rendered"
            />
          </div>

        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            color="primary"
            icon="open_in_new"
            label="Άνοιγμα στο site"
            :href="selectedPost?.link"
            target="_blank"
          />
          <q-btn flat label="Κλείσιμο" @click="closeVideo" />
        </q-card-actions>

      </q-card>
    </q-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Axios from 'src/services/api.backend'
import type { WPPostExtended } from 'src/models/models'
import { decodeHtmlEntities } from 'src/utils/wpContent'

defineOptions({ name: 'VideosPage' })

const posts        = ref<WPPostExtended[]>([])
const loading      = ref(false)
const dialogOpen   = ref(false)
const selectedPost = ref<WPPostExtended | null>(null)

const selectedEmbedUrl = computed(() =>
  selectedPost.value ? getEmbedUrl(selectedPost.value) : ''
)

function getEmbedUrl(post: WPPostExtended): string {
  const html = post.content.rendered

  const iframeMatch = html.match(/src="(https?:\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/[^"]+)"/)
  if (iframeMatch?.[1]) return iframeMatch[1]

  const ytMatch = html.match(/https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w-]+)/)
  if (ytMatch?.[1]) return `https://www.youtube.com/embed/${ytMatch[1]}`

  const ytShort = html.match(/https?:\/\/youtu\.be\/([\w-]+)/)
  if (ytShort?.[1]) return `https://www.youtube.com/embed/${ytShort[1]}`

  const vimeoMatch = html.match(/https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/)
  if (vimeoMatch?.[1]) return `https://player.vimeo.com/video/${vimeoMatch[1]}`

  return ''
}

function getThumb(post: WPPostExtended): string {
  return (
    post.uagb_featured_image_src?.large?.[0] ||
    post.uagb_featured_image_src?.medium_large?.[0] ||
    post.uagb_featured_image_src?.full?.[0] ||
    ''
  )
}

function getThumbStyle(post: WPPostExtended): Record<string, string> {
  const thumb = getThumb(post)
  return thumb
    ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('${thumb}')` }
    : { background: '#1a1a2e' }
}

function openVideo(post: WPPostExtended): void {
  selectedPost.value = post
  dialogOpen.value   = true
}

function closeVideo(): void {
  dialogOpen.value   = false
  selectedPost.value = null
}

async function loadVideos(): Promise<void> {
  loading.value = true
  try {
    const res = await Axios.get('/wp/posts/category?slug=%CE%B2%CE%AF%CE%BD%CF%84%CE%B5%CE%BF')
    if (res.data.statusCode === 200 && res.data.data) {
      posts.value = res.data.data as WPPostExtended[]
    }
  } catch (e) {
    console.error('loadVideos failed:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => void loadVideos())
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
}
.inner-wrapper {
  width: 100%;
  max-width: 900px;
}
.video-card {
  border-radius: 18px;
  overflow: hidden;
}
.video-thumb {
  width: 100%;
  height: 180px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.thumb-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
}

/* Dialog */
.dialog-card {
  display: flex;
  flex-direction: column;
  max-height: 100vh;
}
.video-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background: #000;
}
.video-iframe {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  border: none;
}
.post-content {
  font-size: 14px;
  line-height: 1.7;
}
.post-content :deep(iframe) {
  width: 100%;
  aspect-ratio: 16/9;
  border: none;
}

@media (max-width: 600px) {
  .page-container { padding: 8px; }
  .video-thumb    { height: 140px; }
}
* { box-sizing: border-box; }
</style>
