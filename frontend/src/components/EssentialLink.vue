<template>
  <q-list>

    <template v-for="section in navSections" :key="section.title">

      <q-expansion-item
        v-if="section.children?.length"
        :icon="section.icon"
        :label="section.title"
        :caption="section.caption"
        expand-separator
        header-class="text-primary"
        group="nav-accordion"
      >
        <q-list dense class="q-pl-md">
          <q-item
            v-for="child in section.children"
            :key="child.title"
            :to="child.path"
            clickable
            tag="a"
            active-class="text-primary"
          >
            <q-item-section avatar>
              <q-icon :name="child.icon" size="sm" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ child.title }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>

      <q-item
        v-else
        :to="section.path"
        clickable
        tag="a"
        active-class="text-primary"
      >
        <q-item-section avatar>
          <q-icon :name="section.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ section.title }}</q-item-label>
          <q-item-label caption>{{ section.caption }}</q-item-label>
        </q-item-section>
      </q-item>

    </template>

  </q-list>
</template>

<script setup lang="ts">
defineOptions({ name: 'EssentialLink' })

const navSections = [
  {
    title: 'ΑΡΧΙΚΗ',
    caption: 'Νέα & Ανακοινώσεις',
    icon: 'home',
    path: '/posts',
  },
  {
    title: 'ΠΡΟΓΡΑΜΜΑ ΙΑΤΡΕΙΟΥ',
    caption: 'Εβδομαδιαίο Πρόγραμμα',
    icon: 'schedule',
    path: '/schedule',
  },
  {
    title: 'ΠΛΗΡΟΦΟΡΙΕΣ',
    caption: 'Για τον ασθενή',
    icon: 'info',
    children: [
      { title: 'Δικαιούχοι Περίθαλψης',   icon: 'verified_user',   path: '/page/dikaiouxoi' },
      { title: 'Γραφείο Ασθενών',          icon: 'assignment_ind',  path: '/page/grafeio-asthenon' },
      { title: 'Ιατρείο Επιφυλακής',       icon: 'emergency',       path: '/page/iatreio-epifylakas' },
      { title: '24ωρη Γραμμή Υποστήριξης', icon: 'support_agent',   path: '/page/grammi-ypostiriksis' },
      { title: 'Συχνές Ερωτήσεις',         icon: 'quiz',            path: '/page/faq' },
    ],
  },
  {
    title: 'ΔΙΕΥΘΥΝΣΗ ΥΓΕΙΟΝΟΜΙΚΟΥ',
    caption: 'Οργανόγραμμα & Δομή',
    icon: 'account_balance',
    children: [
      { title: 'Αποστολή',           icon: 'flag',          path: '/page/apostoli' },
      { title: 'Διοίκηση',           icon: 'supervisor_account', path: '/page/dioikisi' },
      { title: 'Διοικητικό Τμήμα',   icon: 'business',      path: '/page/dioikitiko-tmima' },
      { title: 'Τράπεζα Αίματος',    icon: 'bloodtype',     path: '/page/trapeza-aimatos' },
      { title: 'Επιτροπές',          icon: 'groups',        path: '/page/epitropes' },
      { title: 'Νομοθεσία',          icon: 'gavel',         path: '/page/nomothesia' },
    ],
  },
  {
    title: 'ΚΕΝΤΡΙΚΟ ΙΑΤΡΕΙΟ',
    caption: 'ΚΙΑ & ΚΙΘ',
    icon: 'local_hospital',
    children: [
      { title: 'Διοίκηση ΚΙΑ',        icon: 'manage_accounts', path: '/page/dioikisi-kia' },
      { title: 'Ιατρικά Τμήματα ΚΙΑ', icon: 'medication',      path: '/page/tmimata-kia' },
      { title: 'Διοικητικό Τμήμα ΚΙΑ',icon: 'business_center', path: '/page/dioikitiko-kia' },
      { title: 'Ιστορικό ΚΙΑ',        icon: 'history_edu',     path: '/page/istoriko' },
      { title: 'Διοίκηση ΚΙΘ',        icon: 'manage_accounts', path: '/page/dioikisi-kith' },
      { title: 'Ιατρικά Τμήματα ΚΙΘ', icon: 'medication',      path: '/page/tmimata-kith' },
    ],
  },
  {
    title: 'ΑΝΘΡΩΠΙΝΟ ΔΥΝΑΜΙΚΟ',
    caption: 'Προσωπικό',
    icon: 'people',
    children: [
      { title: 'Ιατρικό Προσωπικό',     icon: 'medical_services', path: '/page/iatriko-prosopiko' },
      { title: 'Νοσηλευτικό Προσωπικό', icon: 'personal_injury',  path: '/page/nosileutiko' },
      { title: 'Ψυχολόγοι',             icon: 'psychology',       path: '/page/psixologoi' },
    ],
  },
  {
    title: 'ΝΕΑ & ΕΝΗΜΕΡΩΣΗ',
    caption: 'Νέα & Ανακοινώσεις',
    icon: 'newspaper',
    children: [
      { title: 'ΝΕΑ-ΑΝΑΚΟΙΝΩΣΕΙΣ', icon: 'campaign',    path: '/page/nea-anakoinoseis' },      { title: 'ΕΠΙΣΤΗΜΟΝΙΚΑ ΑΡΘΡΑ', icon: 'science',   path: '/page/arthra' },
      { title: 'ΣΥΝΕΔΡΙΑ',         icon: 'groups',      path: '/page/synedria' },
      { title: 'ΑΙΜΟΔΟΣΙΑ',        icon: 'bloodtype',   path: '/page/aimodosia' },
      { title: 'ΒΙΝΤΕΟ',           icon: 'play_circle', path: '/page/vinteo' },
    ],
  },
  {
    title: 'ΕΠΙΚΟΙΝΩΝΙΑ',
    caption: 'Τηλέφωνα & Διεύθυνση',
    icon: 'call',
    path: '/contact',
  },
]
</script>
