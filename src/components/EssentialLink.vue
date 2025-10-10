<template>
  <q-item clickable tag="a" :href="resolvedHref">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, type RouteLocationRaw } from 'vue-router';

const router = useRouter();

export interface EssentialLinkProps {
  title: string;
  caption?: string;
  icon?: string;
  link?: RouteLocationRaw;
}

const props = withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
});

const resolvedHref = computed(() => {
  // If link is a string (path), just return it directly
  if (typeof props.link === 'string') {
    return props.link;
  }
  // If it's a route object (e.g., { name: 'test' }), resolve it to a full URL
  return router.resolve(props.link).href;
});

</script>
