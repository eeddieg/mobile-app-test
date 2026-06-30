<template>
  <q-list>

    <template v-for="section in navSections" :key="section.title">

      <!-- Section with children → expansion item -->
      <q-expansion-item
        v-if="section.children?.length"
        :icon="section.icon"
        :label="section.title"
        :caption="section.caption"
        expand-separator
        header-class="text-primary"
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

      <!-- Top-level leaf item -->
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
    caption: 'Επιστημονικά Άρθρα & Βίντεο',
    icon: 'newspaper',
    children: [
      { title: 'Νέα & Ανακοινώσεις',  icon: 'campaign',      path: '/posts' },
      { title: 'Επιστημονικά Άρθρα',  icon: 'science',       path: '/page/arthra' },
      { title: 'Αιμοδοσία',           icon: 'bloodtype',     path: '/page/aimodosia' },
      { title: 'Βίντεο',              icon: 'play_circle',   path: '/page/vinteo' },
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






















<!-- <template>
  <q-list>
    <q-item
      v-for="link in linksList"
      :key="link.title"
      :to="link.link.path"
      v-bind="link"
      clickable
      tag="a"
    >
      <q-item-section v-if="link.icon" avatar>
        <q-icon :name="link.icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ link.title }}</q-item-label>
        <q-item-label caption>{{ link.caption }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const linksList = [
  {
    title: 'ΑΡΧΙΚΗ',
    caption: 'Αρχική Σελίδα',
    icon: 'home',
    link: { name: 'home', path: '/posts' },
  },
  {
    title: 'ΠΡΟΓΡΑΜΜΑ ΙΑΤΡΕΙΩΝ',
    caption: 'ΕΒΔΟΜΑΔΙΑΙΟ ΠΡΟΓΡΑΜΜΑ',
    icon: 'schedule',
    link: { name: 'schedule', path: '/schedule' },
  },

];

// function navigate(name: string) {
//   void router.push({ name });
// }

router.beforeEach((to, from, next) => {
  console.log('NAV:', from.fullPath, '->', to.fullPath);
  next();
});
</script> -->
