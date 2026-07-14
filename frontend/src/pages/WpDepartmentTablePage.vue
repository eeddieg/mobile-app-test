<template>
  <div class="page-container">

    <div v-if="loading" class="full-width flex flex-center q-py-xl">
      <q-spinner-dots color="primary" size="48px" />
    </div>

    <div v-else-if="error" class="full-width flex flex-center column q-py-xl q-gutter-sm">
      <q-icon name="error_outline" color="negative" size="48px" />
      <div class="text-body2 text-grey-6">Αδυναμία φόρτωσης σελίδας</div>
      <q-btn flat color="primary" label="Επαναφόρτωση" @click="$emit('reload')" />
    </div>

    <div v-else-if="page" class="inner-wrapper">

      <div class="page-title q-mb-sm">{{ page.title.rendered }}</div>
      <div v-if="clinicInfoHtml" class="clinic-info q-mb-md" v-html="clinicInfoHtml" />
      <div v-if="sectionTitle" class="section-title q-mb-sm">{{ sectionTitle }}</div>

      <q-input
        v-model="searchQuery"
        dense
        outlined
        clearable
        placeholder="Αναζήτηση"
        class="q-mb-md search-box"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <div class="table-wrapper">
        <table class="dept-table">
          <thead>
            <tr>
              <th>ΙΑΤΡΕΙΟ</th>
              <th>ΤΜΗΜΑ</th>
              <th>ΥΓΕΙΟΝΟΜΙΚΟ ΣΤΕΛΕΧΟΣ</th>
              <th>ΡΟΛΟΣ</th>
              <th>ΤΗΛΕΦΩΝΟ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in filteredRows" :key="i">
              <td>{{ row.iatreio }}</td>
              <td>{{ row.tmima }}</td>
              <td>{{ row.stelexos }}</td>
              <td>{{ row.rolos }}</td>
              <td>
                <a
                  v-if="row.tilefono"
                  :href="`tel:${row.tilefono.replace(/[^\d]/g, '')}`"
                  class="phone-link"
                >
                  {{ row.tilefono }}
                </a>
              </td>
            </tr>
            <tr v-if="!filteredRows.length">
              <td colspan="5" class="no-results">Δεν βρέθηκαν αποτελέσματα</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="q-mt-md flex justify-end">
        <q-btn
          flat color="primary" icon="open_in_new" label="Άνοιγμα στο site"
          :href="page.link" target="_blank" data-external-browser
        />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WpPage } from '../models/models'
import { parseDepartmentTable, type DepartmentRow } from '../utils/wpContent'

defineOptions({ name: 'WpDepartmentTablePage' })

const props = defineProps<{
  page:    WpPage | null
  loading: boolean
  error:   boolean
}>()

defineEmits<{ reload: [] }>()

const searchQuery = ref('')

function parseContent(): Document | null {
  if (!props.page) return null
  return new DOMParser().parseFromString(props.page.content.rendered, 'text/html')
}

const sectionTitle = computed(() => {
  const doc = parseContent()
  return doc?.querySelector('h3')?.textContent?.trim() ?? ''
})

// The intro contact-info <p> appears before the first <h3> in this shape
const clinicInfoHtml = computed(() => {
  const doc = parseContent()
  if (!doc) return ''
  for (const el of Array.from(doc.body.children)) {
    const tag = el.tagName.toLowerCase()
    if (tag === 'h3') break
    if (tag === 'p') return el.innerHTML
  }
  return ''
})

const rows = computed((): DepartmentRow[] => {
  if (!props.page) return []
  return parseDepartmentTable(props.page.content.rendered)
})

const filteredRows = computed(() => {
  const q = searchQuery.value.trim().toLocaleLowerCase('el')
  if (!q) return rows.value
  return rows.value.filter(r =>
    [r.iatreio, r.tmima, r.stelexos, r.rolos, r.tilefono]
      .some(field => field.toLocaleLowerCase('el').includes(q))
  )
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.inner-wrapper {
  width: 100%;
  max-width: 1100px;
  padding: 0 4px;
  box-sizing: border-box;
}
.page-title {
  font-size: clamp(1rem, 4vw, 1.8rem);
  font-weight: 600;
  text-align: center;
}
.clinic-info {
  width: 100%;
  text-align: center;
  font-size: 14px;
  line-height: 1.7;
  color: #444;
  margin-top: 4px;
}
.clinic-info :deep(a) { color: #1976d2; text-decoration: none; }
.section-title {
  font-size: clamp(0.9rem, 3vw, 1.2rem);
  font-weight: 500;
  text-align: center;
  color: #1976d2;
}
.search-box {
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
}
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}
.dept-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.dept-table th, .dept-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
  text-align: left;
  white-space: nowrap;
}
.dept-table thead th {
  background: #f5f5f5;
  font-weight: 600;
}
.dept-table tbody tr:nth-child(even) { background: #fafafa; }
.dept-table tbody tr:hover { background: #eef5fd; }
.phone-link { color: #1976d2; text-decoration: none; font-weight: 500; }
.no-results { text-align: center; color: #888; padding: 16px; }

@media (max-width: 600px) {
  .page-container { padding: 8px; }
  .dept-table { font-size: 12px; }
  .dept-table th, .dept-table td { padding: 6px 8px; }
}
* { box-sizing: border-box; }
</style>
