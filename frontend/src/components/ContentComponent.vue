<template>
  <div>
    <p>{{ title }}</p>
    <div class="row items-center">
      <q-btn color="amber" glossy label="Amber" @click="readPdfFile"/>
      <p v-if="loading">Loading...</p>
      <pre v-if="result">{{ result }}</pre>
      <p v-if="error" style="color:red">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import list from "../../../backend/src/utils/pdfParse";
import { ref } from 'vue'

const loading = ref(false)
const result = ref('')
const error = ref('')

interface Props {
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: "",
});


function readPdfFile() {
  console.log(list);
}

</script>
