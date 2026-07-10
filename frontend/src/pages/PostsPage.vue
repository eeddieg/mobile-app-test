<template>
  <PostListComponent :title="title" :category-slug="categorySlug" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PostListComponent from "../components/PostListComponent.vue";

const props = defineProps<{
  title?:        string
  categorySlug?: string
}>()

const title        = computed(() => props.title        ?? 'ΑΡΧΙΚΗ')
const categorySlug = computed(() => props.categorySlug ?? '')
</script>


