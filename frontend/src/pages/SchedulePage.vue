<template>
  <q-page class="row items-center justify-evenly">
    <schedule-component
      :title=title
    ></schedule-component>
  </q-page>
</template>

<script setup lang="ts">
import ScheduleComponent from 'components/ScheduleComponent.vue';

const title = "Schedule component";
</script>
