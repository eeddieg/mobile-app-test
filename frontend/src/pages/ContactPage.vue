<template>
  <div class="page-container">

    <div class="header-wrapper q-mb-md">
      <q-item-label class="text-center" :class="isMobile ? 'text-h6' : 'text-h3'">
        ΕΠΙΚΟΙΝΩΝΙΑ
      </q-item-label>
    </div>

    <div class="inner-wrapper">

      <!-- KIA -->
      <q-card flat bordered class="q-mb-md" style="border-radius: 18px;">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-sm">
            Κεντρικό Ιατρείο Αθηνών (ΚΙΑ)
          </div>
          <div class="text-body2 text-grey-7 q-mb-xs">
            <q-icon name="location_on" size="sm" class="q-mr-xs" />
            Πειραιώς 153, Αθήνα 118 54
          </div>
          <div class="text-body2 text-grey-7 q-mb-xs">
            <q-icon name="access_time" size="sm" class="q-mr-xs" />
            07:00 – 15:00
          </div>
        </q-card-section>

        <q-separator />

        <q-list dense>
          <q-item
            v-for="c in kiaContacts"
            :key="c.label"
            clickable
            tag="a"
            :href="c.href"
          >
            <q-item-section avatar>
              <q-icon :name="c.icon" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ c.label }}</q-item-label>
              <q-item-label caption>{{ c.value }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <q-card flat bordered class="q-mb-md" style="border-radius: 18px;">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-sm">
            Κεντρικό Ιατρείο Θεσσαλονίκης (ΚΙΘ)
          </div>
          <div class="text-body2 text-grey-7 q-mb-xs">
            <q-icon name="location_on" size="sm" class="q-mr-xs" />
            Μοναστηρίου 326, Θεσσαλονίκη 54 121
          </div>
        </q-card-section>
        <q-separator />
        <q-list dense>
          <q-item v-for="c in kithContacts" :key="c.label" clickable tag="a" :href="c.href">
            <q-item-section avatar><q-icon :name="c.icon" color="primary" /></q-item-section>
            <q-item-section>
              <q-item-label>{{ c.label }}</q-item-label>
              <q-item-label caption>{{ c.value }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <q-card flat class="bg-red-1 q-mb-md" style="border-radius: 18px; border: 1px solid #ef9a9a;">
        <q-card-section class="text-center">
          <q-icon name="support_agent" color="red" size="36px" />
          <div class="text-subtitle1 text-weight-bold q-mt-sm">24ωρη Γραμμή Ψυχολογικής Υποστήριξης</div>
          <q-btn
            unelevated
            color="red"
            class="q-mt-md"
            icon="call"
            label="210-3410900"
            href="tel:2103410900"
            tag="a"
            style="border-radius: 12px;"
          />
        </q-card-section>
      </q-card>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { screenStore } from 'src/stores/screen.store'

defineOptions({ name: 'ContactPage' })

const screen   = screenStore()
const isMobile = computed(() => screen.isMobile)

const kiaContacts = [
  { label: 'Πληροφορίες',              value: '210-3482333', icon: 'call',  href: 'tel:2103482333' },
  { label: 'Ιατρείο Επιφυλακής',       value: '210-3482420', icon: 'emergency', href: 'tel:2103482420' },
  { label: 'Γραφείο Διαχείρισης Ασθενών', value: '210-3482477', icon: 'assignment_ind', href: 'tel:2103482477' },
  { label: 'Email', value: 'dygeionomikou.kiatrio@astynomia.gr', icon: 'email', href: 'mailto:dygeionomikou.kiatrio@astynomia.gr' },
]

const kithContacts = [
  { label: 'Τηλέφωνο', value: '231-0388727', icon: 'call', href: 'tel:2310388727' },
  { label: 'Τηλέφωνο', value: '231-3020070', icon: 'call', href: 'tel:2313020070' },
  { label: 'Email',    value: 'ki.the@astynomia.gr', icon: 'email', href: 'mailto:ki.the@astynomia.gr' },
]
</script>

<style scoped>
.page-container { min-height: 100vh; width: 100%; padding: 16px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; }
.header-wrapper { width: 100%; display: flex; justify-content: center; text-align: center; }
.inner-wrapper { width: 100%; max-width: 900px; padding: 0 12px; box-sizing: border-box; }
</style>
