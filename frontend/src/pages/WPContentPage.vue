<template>
  <q-page class="row items-center justify-evenly">
    <content-component
      :title=title
    ></content-component>
  </q-page>
</template>

<script setup lang="ts">
import ContentComponent from 'components/ContentComponent.vue';

const title = "WP content component";
</script>
