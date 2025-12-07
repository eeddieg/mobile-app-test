<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { pdfStore } from './stores/pdf.store';

const pdfStoreInstance = pdfStore();

onMounted(async () => {
  await pdfStoreInstance.getPdfFile();
});

</script>
