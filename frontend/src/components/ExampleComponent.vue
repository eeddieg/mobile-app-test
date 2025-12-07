<template>
  <div class="q-pa-md flex column items-center justify-center" style="min-height: 100vh;">

    <!-- Button -->
    <div class="q-mb-md">
      <q-btn color="primary" :label="buttonLabel" @click="fetchPdf" />
    </div>

    <div v-if="showTableContents" class="q-mb-md flex column items-center justify-center">

      <!-- Dropdown for mobile -->
      <div v-if="isMobile" class="q-mb-sm flex justify-center" style="width: 150px;">
        <q-select
          v-model="activeTab"
          :options="floorOptions"
          label="Όροφος"
          option-value="value"
          option-label="label"
          emit-value map-options
          outlined dense hide-dropdown-icon
          style="width: 100%;"
        />
      </div>

      <!-- Tabs for desktop -->
      <div v-else class="q-mb-sm flex justify-center" style="width: 80%;">
        <q-tabs
          v-model="activeTab"
          dense
          class="text-teal bg-grey-2"
          align="justify"
          style="width: 100%; margin-bottom: 8px;"
        >
          <q-tab v-for="floor in floors" :key="floor" :name="floor" :label="floor" />
        </q-tabs>
      </div>

      <!-- Table -->
      <div class="q-mb-sm flex justify-center" style="overflow-x:auto; width: 85%;">
        <q-tab-panels v-model="activeTab" animated style="width: 100%;">
          <q-tab-panel v-for="floor in floors" :key="floor" :name="floor">
            <base-table-component :columns="columns" :rows="floorRows[floor]!" :isMobile />
          </q-tab-panel>
        </q-tab-panels>
      </div>

      <!-- Footer -->
      <div class="q-mb-sm flex justify-center" style="overflow-x:auto; width: 70%;">
        <i>{{ footer }}</i>
      </div>

    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { pdfStore } from 'src/stores/pdf.store';
import { screenStore } from "src/stores/screen.store";
import BaseTableComponent from './BaseTableComponent.vue';
import type { QTableProps } from "quasar";

const pdfStoreInstance = pdfStore();
const screenStoreInstance = screenStore();

const showTableContents = ref(false);
const columns = ref<QTableProps["columns"]>([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rows = ref<any[]>([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const floorRows = ref<Record<string, any[]>>({});
const floors = ref<string[]>([]);
const activeTab = ref("");
const footer = ref("");

const buttonLabel = computed(() =>
  showTableContents.value ? "Hide Data" : "Show Data"
);
const isMobile = computed(() => screenStoreInstance.isMobile);
const floorOptions = computed(() => floors.value.map(f => ({ label: f, value: f })));

onMounted(() => {
  screenStoreInstance.detectDevice()
  if (floors.value.length) activeTab.value = floors.value[0] as string;
})

async function fetchPdf() {
  let rawData = [];
  rawData = pdfStoreInstance.pdfData;

  if (JSON.parse(localStorage.getItem('pdfStore')!).pdfData.length === 0) {
    console.log("Fetching PDF file...");
    rawData = await pdfStoreInstance.getPdfFile();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = rawData.filter((row: any) => typeof row === "object");

  // Create columns
  const keys = Object.keys(data[0]);
  columns.value = makeColumnsFromKeys(keys);

  // Prepare rows and add index id for grouping in mobile expanded view
  let index = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows.value = data.map((row: any) => ({
    id: index++,
    ...clearRowData(row)
  }));

  // Footer
  footer.value = rows.value[rows.value.length - 1].footer_text;

  // Group by floor
  floorRows.value = groupByFloor(rows.value);
  floors.value = Object.keys(floorRows.value);
  activeTab.value = floors.value[0] || "";

  showTableContents.value = true;
}

function makeColumnsFromKeys(keys: string[]): QTableProps["columns"] {
  return keys
    .filter(key => !key.startsWith("_"))
    .map(key => ({
      name: key,
      label: key,
      field: key,
      align: "center" as const,
      sortable: true,
    }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function clearRowData(row: any) {
  return Object.fromEntries(
    Object.entries(row).filter(([key]) => !key.startsWith("_"))
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function groupByFloor(data: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.reduce((acc: any, row) => {
    const floor = row["ΟΡΟΦΟΣ"];

    if (!floor) return acc;
    if (!acc[floor]) acc[floor] = [];

    acc[floor].push(clearRowData(row));
    return acc;
  }, {});
}

</script>
