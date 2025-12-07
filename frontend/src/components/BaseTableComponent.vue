<template>
  <q-table
    :rows="props.rows"
    :columns="computedColumns"
    :row-key="'id'"
    :expanded="expanded"
    flat
    dense
    bordered
    class="q-pa-md"
    :pagination="{ rowsPerPage: 0 }"
    hide-bottom
  >
    <template #body="slotProps">
      <q-tr :props="slotProps">
        <!-- Render the limited columns -->
        <q-td
          v-for="(col, index) in computedColumns"
          :key="index"
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
            {{
              typeof col.field === "function"
                ? col.field(slotProps.row)
                : slotProps.row[col.field]
            }}
          </template>
        </q-td>

      </q-tr>

      <!-- Expanded row -->
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

interface Props {
  columns: QTableProps["columns"];
  rows: QTableProps["rows"];
  isMobile?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isMobile: false,
});

// Track expanded rows
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const expanded = ref<any[]>([]);

/* ---------------------- COLUMNS ---------------------- */
const computedColumns = computed(() => {
  const base = props.columns || [];

  // if desktop, use all columns
  if (!props.isMobile) return base;

  // if mobile, only first 2 columns
  const limited = props.columns!.slice(0, 2).map(col => ({
    ...col,
    style: "width: 80px; max-width: 80px; white-space: nowrap;"
  }));

  limited.push({
    name: "info",
    label: "ΠΛΗΡΟΦΟΡΙΕΣ",
    field: "info",
    align: "center" as const,
    sortable: false,
    style: "width: 60px; max-width: 60px;",
  });

  return limited;
});

const remainingColumns = computed(() => {
  if (!props.isMobile) return []; // desktop doesn’t use expand
  return props.columns!.slice(2); // everything after first 2 columns
});

/* ---------------------- INFO HANDLER ---------------------- */
function toggleExpand(key: string | number) {
  // If clicking the already-expanded row, then collapse it
  if (expanded.value[0] === key) {
    expanded.value = [];
  }
  // expand ONLY this row and collapse all others
  else {
    expanded.value = [key];
  }
}
// function toggleExpand(key: string | number) {
//   const index = expanded.value.indexOf(key);
//   if (index === -1) expanded.value.push(key);
//   else expanded.value.splice(index, 1);
// }
</script>
