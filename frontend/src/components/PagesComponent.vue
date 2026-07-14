<template>
  <div class="page-container">
    <div class="header-wrapper q-mb-md">
      <q-item-label
        class="text-center"
        :class="isMobile ? 'text-h6' : 'text-h3'"
      >
        {{ props.title }}
      </q-item-label>
    </div>

    {{ pages }}
    <div class="footer-area">
      <i class="responsive-text">{{ footer }}</i>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { pagesStore } from 'src/stores/pages.store'
import { screenStore } from 'src/stores/screen.store'

defineOptions({
  name: 'PagesComponent'
})

const pagesStoreInstance = pagesStore()
const screen = screenStore()

const isMobile = computed(() => screen.isMobile)

const props = defineProps<{
  title: string
}>()

const pages = ref<unknown[]>([])
const footer = ref('')


const resizeHandler = () => {
  screen.updateScreenWidth()
}

onMounted(async () => {
  screen.detectDevice()
  window.addEventListener('resize', resizeHandler)

  await Promise.all([
    retrievePages()
  ])
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
})



async function retrievePages(): Promise<void> {
  const data = await pagesStoreInstance.fetchPages()

  if (data) {
    pages.value = data as unknown[]
  }
}


</script>

<style scoped>

/* PAGE LAYOUT */
.page-container {
  min-height: 100vh;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
}

/* HEADER */
.header-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
}

/* UNIFIED WRAPPER */
.inner-wrapper {
  width: 100%;
  max-width: 900px;
  padding: 0 12px;
  box-sizing: border-box;
}

/* CAROUSEL */
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

/* CAPTION */
.carousel-caption {
  position: absolute;
  bottom: 12px;
  left: 12px;

  color: white;
  font-size: 16px;
  font-weight: bold;

  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
}

/* FOOTER */
.footer-area {
  text-align: center;
  margin-top: 20px;
}

/* POST CARD */
.post-card {
  border-radius: 18px;
  overflow: hidden;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  min-height: 280px;

  color: white;

  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
}

/* CONTENT LAYERING */
.q-card__section,
.q-card__actions {
  position: relative;
  z-index: 2;
}

/* WORDPRESS CONTENT */
.post-content {
  width: 100%;
  font-size: 14px;
  line-height: 1.7;
  color: white;

  overflow-wrap: break-word;
  word-break: break-word;
}

.post-content :deep(p) {
  margin-bottom: 12px;
}

.post-content :deep(a) {
  color: #90caf9;
  word-break: break-word;
}

.post-content :deep(ul),
.post-content :deep(ol) {
  padding-left: 20px;
}

.post-content :deep(img) {
  max-width: 100% !important;
  height: auto !important;

  display: block;
  margin: 16px auto;

  object-fit: contain;

  border-radius: 8px;
}

.post-content :deep(figure) {
  max-width: 100%;
  margin: 16px auto;
  text-align: center;
}

.post-content :deep(table) {
  width: 100%;
  display: block;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.post-content :deep(iframe),
.post-content :deep(video) {
  max-width: 100%;
  width: 100%;
}

/* TEXT SHADOW */
.text-white {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
}

/* RESPONSIVE TEXT */
.responsive-text {
  font-size: clamp(10px, 2vw, 16px);
  line-height: 1.3;
}

/* MOBILE */
@media (max-width: 600px) {
  .page-container {
    padding: 8px;
  }

  .carousel-wrapper .q-carousel {
    border-radius: 12px;
  }

  .post-card {
    min-height: 220px;
  }
}

/* GLOBAL */
* {
  box-sizing: border-box;
}

</style>
