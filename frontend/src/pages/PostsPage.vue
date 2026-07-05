<template>
  <PostListComponent :title="title" :category-slug="categorySlug" />
</template>

<script setup lang="ts">
import PostListComponent from "../components/PostListComponent.vue";

const props = defineProps<{
  title?:        string
  categorySlug?: string
}>()

const title        = props.title        ?? 'ΑΡΧΙΚΗ'
const categorySlug = props.categorySlug ?? ''
</script>
