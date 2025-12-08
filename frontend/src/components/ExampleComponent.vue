<template>
  <div class="page-container">

    <!-- Loading -->
    <div class="q-mb-md" v-if="!isButtonVisible">
      <p>Ανάκτηση προγράμματος. Παρακαλώ περιμένετε...</p>
    </div>

    <!-- Content -->
    <div v-else class="content-wrapper">

      <div v-if="showTableContents" class="inner-wrapper">

        <!-- Header -->
        <div class="header-wrapper">

          <!-- Mobile dropdown -->
          <div v-if="isMobile" class="mobile-select">
            <q-select
              v-model="activeTab"
              :options="floorOptions"
              label="Όροφος"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              outlined
              dense
            />
          </div>

          <!-- Desktop tabs -->
          <div v-else class="desktop-tabs">
            <q-tabs
              v-model="activeTab"
              dense
              class="text-teal bg-grey-2"
              align="justify"
            >
              <q-tab
                v-for="floor in floors"
                :key="floor"
                :name="floor"
                :label="floor"
              />
            </q-tabs>
          </div>
        </div>

        <!-- Table Area -->
        <div class="table-area">

          <!-- Desktop -->
          <div v-if="!isMobile" class="desktop-table">
            <q-tab-panels v-model="activeTab" animated>
              <q-tab-panel
                v-for="floor in floors"
                :key="floor"
                :name="floor"
              >
                <base-table-component
                  :columns="columns"
                  :rows="floorRows[floor]!"
                  :isMobile="false"
                />
              </q-tab-panel>
            </q-tab-panels>
          </div>

          <!-- Mobile -->
          <div v-else class="mobile-table">
            <q-tab-panels v-model="activeTab" animated>
              <q-tab-panel
                v-for="floor in floors"
                :key="floor"
                :name="floor"
              >
                <base-table-component
                  :columns="columns"
                  :rows="floorRows[floor]!"
                  :isMobile="true"
                />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer-area">
          <i>{{ footer }}</i>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { pdfStore } from 'src/stores/pdf.store';
import { screenStore } from "src/stores/screen.store";
import BaseTableComponent from './BaseTableComponent.vue';
import type { QTableProps } from "quasar";

const pdfStoreInstance = pdfStore();
const screen = screenStore();

const showTableContents = ref(false);
const columns = ref<QTableProps["columns"]>([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rows = ref<any[]>([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const floorRows = ref<Record<string, any[]>>({});
const floors = ref<string[]>([]);
const activeTab = ref("");
const footer = ref("");

const isMobile = computed(() => screen.isMobile);

const floorOptions = computed(() =>
  floors.value.map(f => ({ label: f, value: f }))
);

const isButtonVisible = computed(() => {
  return pdfStoreInstance.pdfData.length > 0;
});

watch(isButtonVisible, () => {
  showPdf();
});

// resize listener
const resizeHandler = () => {
  screen.updateScreenWidth();
};

onMounted(() => {
  screen.detectDevice();
  window.addEventListener("resize", resizeHandler);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeHandler);
});

// Center container width = 90% of screen
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const containerWidth = computed(() => screen.screenWidth * 0.9 + "px");


function showPdf() {
  const raw = pdfStoreInstance.pdfData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = raw.filter((row: any) => typeof row === "object");

  const keys = Object.keys(data[0]);
  columns.value = makeColumnsFromKeys(keys);

  let index = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows.value = data.map((row: any) => ({
    id: index++,
    ...clearRowData(row)
  }));

  footer.value = rows.value[rows.value.length - 1].footer_text;

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
      align: "left",
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

<style scoped>
.page-container {
  min-height: 100vh;
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.inner-wrapper {
  width: 90%;
  max-width: 1200px;
}

.header-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.mobile-select {
  width: 40%;
  min-width: 180px;
}

.desktop-tabs {
  width: 60%;
}

.table-area {
  width: 100%;
  display: flex;
  justify-content: center;
}

.desktop-table {
  width: 100%;
}

.mobile-table {
  width: 100%;
  overflow-x: auto;
}

.footer-area {
  text-align: center;
  margin-top: 12px;
}
</style>
