<template>
  <q-page class="row items-center justify-evenly">
    <post-list-component
      :title="title"
    ></post-list-component>
  </q-page>
</template>

<script setup lang="ts">
import PostListComponent from 'components/PostListComponent.vue';

const title = "Αρχική Σελίδα";

</script>
