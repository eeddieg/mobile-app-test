<template>
  <q-list>
    <q-item
      v-for="link in linksList"
      :key="link.title"
      :to="link.link.path"
      v-bind="link"
      clickable
      tag="a"
    >
      <q-item-section v-if="link.icon" avatar>
        <q-icon :name="link.icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ link.title }}</q-item-label>
        <q-item-label caption>{{ link.caption }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const linksList = [
  {
    title: 'ΑΡΧΙΚΗ',
    caption: 'Αρχική Σελίδα',
    icon: 'home',
    link: { name: 'home', path: '/' },
  },
  {
    title: 'ΠΡΟΓΡΑΜΜΑ ΙΑΤΡΕΙΩΝ',
    caption: 'ΕΒΔΟΜΑΔΙΑΙΟ ΠΡΟΓΡΑΜΜΑ',
    icon: 'schedule',
    link: { name: 'schedule', path: '/schedule' },
  },

];

// function navigate(name: string) {
//   void router.push({ name });
// }

router.beforeEach((to, from, next) => {
  console.log('NAV:', from.fullPath, '->', to.fullPath);
  next();
});
</script>
