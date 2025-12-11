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
    class="mobile-table responsive"
  >
    <template #body="slotProps">
      <q-tr :props="slotProps">

        <!-- Render the main columns -->
        <q-td
          v-for="(col, index) in computedColumns"
          :key="index"
          :class="col.classes"
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
      <q-tr v-show="expanded.includes(slotProps.row.id)">
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
                  : slotProps.row[col.field as string]
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

// Manage row expansion
const expanded = ref<number[]>([]);

// Column widths for mobile
const computedColumns = computed(() => {
  const base = props.columns || [];
  if (!props.isMobile) return base;

  return [
    {
      ...base[0],
      classes: "mobile-column-small"
    },
    {
      ...base[1],
      classes: "mobile-column-medium"
    },
    {
      name: "info",
      label: "",
      field: () => "",
      align: "left" as const,
      sortable: false,
      classes: "mobile-column-info"
    }
  ] as QTableProps["columns"];
});

// Remaining columns for expanded mobile view
const remainingColumns = computed(() => {
  return props.isMobile ? props.columns!.slice(2) : [];
});

function toggleExpand(rowId: number) {
  expanded.value = expanded.value[0] === rowId ? [] : [rowId];
}
</script>

<style scoped>
.mobile-table {
  width: 100%;
  text-align: center;
}

/* Table cell font smaller */
.q-table tbody tr td {
  font-size: clamp(10px, 1.5vw, 14px);
  line-height: 1.3;
}

/* Header font slightly bigger */
.q-table thead tr th {
  font-size: clamp(12px, 2vw, 16px);
}

/* Mobile: allow wrapping for long text */
@media (max-width: 768px) {
  .q-table td {
    white-space: normal !important;
    word-break: break-word !important;
    overflow-wrap: break-word !important;
  }
}

/* COLUMN WIDTH CLASSES */
.mobile-column-small {
  width: 10vw !important;
  min-width: 50px !important;
  max-width: 60px !important;
  text-align: center;
}

.mobile-column-medium {
  width: 50vw !important;
  min-width: 120px !important;
  text-align: left;
}

.mobile-column-info {
  width: 12vw !important;
  min-width: 40px !important;
  max-width: 60px !important;
  text-align: center;
}
</style>
