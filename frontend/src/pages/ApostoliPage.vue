<template>
  <div class="page-container">

    <div class="page-title q-mb-sm">Αποστολή</div>

    <div class="inner-wrapper">

      <!-- Main text content -->
      <q-card flat bordered class="content-card q-mb-md">
        <q-card-section>
          <div class="text-subtitle2 text-grey-6 q-mb-sm">ΔΙΕΥΘΥΝΣΗ ΥΓΕΙΟΝΟΜΙΚΟΥ</div>
          <div class="text-h6 text-weight-bold q-mb-md">Αποστολή</div>

          <q-list separator>
            <q-item v-for="item in missionItems" :key="item.letter" class="q-py-sm">
              <q-item-section avatar top>
                <div class="letter-badge">{{ item.letter }}</div>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body2">{{ item.text }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <!-- 3 feature cards (replacing the broken UAGB image+icon blocks) -->
      <div class="features-grid q-mb-md">
        <q-card
          v-for="feature in features"
          :key="feature.title"
          flat
          bordered
          class="feature-card"
        >
          <q-card-section class="text-center q-pa-md">
            <q-icon
              :name="feature.icon"
              size="40px"
              :color="feature.color"
              class="q-mb-sm"
            />
            <div class="text-subtitle2 text-weight-bold">{{ feature.title }}</div>
            <div class="text-caption text-grey-6 q-mt-xs">{{ feature.subtitle }}</div>
          </q-card-section>
        </q-card>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ApostoliPage' })

const missionItems = [
  {
    letter: 'α',
    text: 'Η παρακολούθηση της κατάστασης της υγείας και η μέριμνα για πληρέστερη ιατρική και νοσοκομειακή περίθαλψη του εν ενεργεία προσωπικού της Ελληνικής Αστυνομίας και των Πολιτικών Υπαλλήλων της.',
  },
  {
    letter: 'β',
    text: 'Η επίβλεψη της πορείας της ασθένειας του προσωπικού, που νοσηλεύεται στα νοσοκομεία ή κλινικές ή άλλα θεραπευτήρια της περιοχής ευθύνης του.',
  },
  {
    letter: 'γ',
    text: 'Η λήψη ή εισήγηση αναγκαίων μέτρων για την υγεία του προσωπικού.',
  },
  {
    letter: 'δ',
    text: 'Η διενέργεια ιατρικών επιστημονικών ερευνών.',
  },
  {
    letter: 'ε',
    text: 'Η παροχή ψυχολογικής υποστήριξης, συμβουλευτικής και ενημέρωσης του προσωπικού της Ελληνικής Αστυνομίας, μέσω ειδικής τηλεφωνικής γραμμής.',
  },
]

const features = [
  {
    icon:     'health_and_safety',
    color:    'blue-7',
    title:    'Πρωτοβάθμια Φροντίδα Υγείας',
    subtitle: 'Εξωνοσοκομειακή ιατρική περίθαλψη',
  },
  {
    icon:     'support_agent',
    color:    'green-7',
    title:    '24×7 Υποστήριξη',
    subtitle: 'Τηλεφωνική γραμμή ψυχολογικής υποστήριξης',
  },
  {
    icon:     'calendar_today',
    color:    'orange-7',
    title:    'Καθημερινά Ραντεβού',
    subtitle: 'Ιατρεία 08:00 – 13:00',
  },
]
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
.page-title {
  font-size: clamp(1rem, 4vw, 1.8rem);
  font-weight: 600;
  text-align: center;
  line-height: 1.3;
  word-break: break-word;
  padding: 0 8px;
  margin-bottom: 8px;
}
.inner-wrapper {
  width: 100%;
  max-width: 900px;
  padding: 0 4px;
  box-sizing: border-box;
}
.content-card {
  border-radius: 18px;
}
.letter-badge {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #1976d2;
  color: white;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.feature-card {
  border-radius: 14px;
}
@media (max-width: 480px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
* { box-sizing: border-box; }
</style>
