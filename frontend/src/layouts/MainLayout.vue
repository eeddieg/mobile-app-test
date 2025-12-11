<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Mobile App - Test </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" :to="link.link" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';


const linksList: EssentialLinkProps[] = [
  {
    title: 'ΑΡΧΙΚΗ',
    caption: 'Home screen',
    icon: 'home',
    link: { name: 'home' },
  },
  {
    title: 'ΠΡΟΓΡΑΜΜΑ ΙΑΤΡΕΙΩΝ',
    caption: 'ΕΒΔΟΜΑΔΙΑΙΟ ΠΡΟΓΡΑΜΜΑ',
    icon: 'schedule',
    link: { name: 'test' },
  },

];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
