<template>
  <q-page class="row items-center justify-evenly">
    <pages-component
      :title="title"
    ></pages-component>
  </q-page>
</template>

<script setup lang="ts">
import PagesComponent from 'components/PagesComponent.vue';

const title = "PAGES";

</script>
