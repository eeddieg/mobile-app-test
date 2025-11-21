<template>
  <div>
    <p>{{ title }}</p>
    <ul>
      <li v-for="todo in todos" :key="todo.id" @click="increment">
        {{ todo.id }} - {{ todo.content }}
      </li>
    </ul>
    <p>Count: {{ todoCount }} / {{ meta.totalCount }}</p>
    <p>Active: {{ active ? 'yes' : 'no' }}</p>
    <p>Clicks on todos: {{ clickCount }}</p>
  </div>
  <div>
    <q-btn
      id="pdf-button"
      color="primary"
      label="Show PDF"
      @click="fetchPdf"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Todo, Meta } from '../models/models';

interface Props {
  title: string;
  todos?: Todo[];
  meta: Meta;
  active: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  todos: () => [],
});

const clickCount = ref(0);
function increment() {
  clickCount.value += 1;
  return clickCount.value;
}

const todoCount = computed(() => props.todos.length);

function fetchPdf() {
  console.log("fetchPdf function")
  // await store.pdfStore.fetchPdfFile();
}
</script>
