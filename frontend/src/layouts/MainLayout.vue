<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="header-title">
          <div class="main-title">ΕΛΛΗΝΙΚΗ ΑΣΤΥΝΟΜΙΑ</div>
          <div class="sub-title">ΔΙΕΥΘΥΝΣΗ ΥΓΕΙΟΝΟΜΙΚΟΥ</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Πλοήγηση Ιστοτόπου </q-item-label>
        <EssentialLink />
      </q-list>
    </q-drawer>

    <q-page-container @click.capture="interceptLinks">
      <router-view />
    </q-page-container>

    <WpWebViewDialog ref="webViewDialog" />

  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink from "../components/EssentialLink.vue";
import WpWebViewDialog from "../components/WpWebViewDialog.vue";

const leftDrawerOpen = ref(false);
const webViewDialog  = ref<InstanceType<typeof WpWebViewDialog> | null>(null);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function interceptLinks(e: MouseEvent): void {
  const anchor = (e.target as HTMLElement).closest('a')
  if (!anchor) return

  const href   = anchor.getAttribute('href') ?? ''
  const target = anchor.getAttribute('target') ?? ''

  // Allow tel/mailto — these should dial/email directly
  if (href.startsWith('tel:') || href.startsWith('mailto:')) return

  // Allow internal app routes (hash links)
  if (href.startsWith('#') || href.startsWith('/')) return

  // Allow the explicit "ΑΝΟΙΓΜΑ ΣΤΟ SITE" button (target="_blank")
  if (target === '_blank') return

  // Everything else, open in popup
  if (href.startsWith('http')) {
    e.preventDefault()
    e.stopPropagation()
    toggleLeftDrawer()
    webViewDialog.value?.open(href)
  }
}
</script>

<style scoped>
.header-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.2;
}

.main-title {
  font-size: 1.15rem;
  font-weight: 700;
}

.sub-title {
  font-size: 0.8rem;
  font-weight: 400;
  opacity: 0.9;
}
</style>
