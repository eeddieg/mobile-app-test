<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { scheduleStore } from "./stores/schedule.store";
// import { pdfStore } from './stores/pdf.store';

const scheduleStoreInstance = scheduleStore();

onMounted(async () => {
  await scheduleStoreInstance.getScheduleData();
});

</script>
