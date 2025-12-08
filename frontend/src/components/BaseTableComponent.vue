<template>
  <q-table
    :rows="props.rows"
    :columns="computedColumns"
    :row-key="'id'"
    :expanded="expanded"
    dense
    flat
    bordered
    hide-bottom
    :pagination="{ rowsPerPage: 0 }"
    class="mobile-table"
  >
    <template #body="slotProps">
      <q-tr :props="slotProps">

        <!-- Render the limited columns -->
        <q-td
          v-for="(col, index)  in computedColumns"
          :key="index"
          :style="col.style"
        >
          <!-- info column -->
          <template v-if="col.name === 'info'">
            <q-btn
              flat round dense
              icon="info"
              @click.stop="toggleExpand(slotProps.row.id)"
            />
          </template>

          <!-- Normal columns -->
          <template v-else>
            {{ typeof col.field === "function"
                ? col.field(slotProps.row)
                : slotProps.row[col.field as string]
            }}
          </template>
        </q-td>
      </q-tr>

      <!-- Expanded area -->
      <q-tr v-show="expanded.includes(slotProps.key)">
        <q-td colspan="100%">
          <div class="q-pa-sm">
            <div
              v-for="col in remainingColumns"
              :key="col.name"
              class="q-mb-sm"
            >
              <strong>{{ col.label }}:</strong>
              {{
                typeof col.field === "function"
                  ? col.field(slotProps.row)
                  : slotProps.row[col.field]
              }}
            </div>
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { QTableProps } from "quasar";
import { screenStore } from "src/stores/screen.store";

interface Props {
  columns: QTableProps["columns"];
  rows: QTableProps["rows"];
  isMobile?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isMobile: false,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const expanded = ref<any[]>([]);

const screenStoreInstance = screenStore();

const containerWidth = computed(() => {
  return Math.min(screenStoreInstance.screenWidth * 0.9, 1200) + "px";
});

const computedColumns = computed(() => {
  const base = props.columns || [];

  if (!props.isMobile) return base;

  const width = Number(containerWidth.value);

  let col1 = "30%";
  let col2 = "60%";
  let info = "20%";

  if (width >= 400 && width < 600) {
    col1 = "35%";
    col2 = "60%";
    info = "20%";
  }

  if (width >= 600 && width < 800) {
    col1 = "40%";
    col2 = "60%";
    info = "10%";
  }

  return [
    {
      ...base[0],
      style: `width: ${col1}; max-width: ${col1};`
    },
    {
      ...base[1],
      style: `width: ${col2}; max-width: ${col2};`
    },
    {
      name: "info",
      label: "",
      field: () => "",
      align: "center" as const,
      sortable: false,
      style: `width: ${info}; max-width: ${info}; text-align:center;`
    }
  ] as QTableProps["columns"];
});

const remainingColumns = computed(() => {
  return props.isMobile ? props.columns!.slice(2) : [];
});

function toggleExpand(key: string | number) {
  expanded.value = expanded.value[0] === key ? [] : [key];
}
</script>


<style scoped>
.mobile-table {
  width: 100%;
  text-align: center;
}
@media (max-width: 768px) {
  .q-table td {
    white-space: normal !important;
    word-break: break-word !important;
  }
}
</style>
