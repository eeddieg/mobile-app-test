<template>
  <q-page class="row items-center justify-evenly">
    <schedule-component
      :title=title
    ></schedule-component>
  </q-page>
</template>

<script setup lang="ts">
import ScheduleComponent from 'components/ScheduleComponent.vue';
import { onMounted } from 'vue';
import { scheduleStore } from "../stores/schedule.store";

const scheduleStoreInstance = scheduleStore();

onMounted(async () => {
  await scheduleStoreInstance.getScheduleData();
});


const title = "Πρόγραμμα Εβδομάδας";
</script>
