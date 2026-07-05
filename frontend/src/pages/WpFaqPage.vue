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

      <div class="page-title q-mb-sm" v-html="makePhoneNumbersClickable(page.title.rendered)" />

      <q-card flat bordered class="content-card q-mb-md">
        <q-card-section>

          <!-- Section headers (e.g. "Ασθένεια-Εξέταση") -->
          <template v-for="section in sections" :key="section.title">

            <div v-if="section.title" class="section-title q-mt-md q-mb-sm">
              {{ section.title }}
            </div>

            <q-list bordered separator class="rounded-borders q-mb-md">
              <q-expansion-item
                v-for="(faq, i) in section.items"
                :key="i"
                expand-separator
                :label="faq.question"
                header-class="faq-question"
                group="faq"
              >
                <q-card>
                  <q-card-section>
                    <div
                      class="faq-answer"
                      v-html="makePhoneNumbersClickable(faq.answer)"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-list>

          </template>

        </q-card-section>
      </q-card>

      <div class="flex justify-end">
        <q-btn
          flat
          color="primary"
          icon="open_in_new"
          label="Άνοιγμα στο site"
          :href="page.link"
          target="_blank"
        />
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { makePhoneNumbersClickable } from 'src/utils/wpContent'
import type { WpPage } from 'src/models/models'

defineOptions({ name: 'WpFaqPage' })

const props = defineProps<{
  page:    WpPage | null
  loading: boolean
  error:   boolean
}>()

defineEmits<{ reload: [] }>()

interface FaqItem {
  question: string
  answer:   string
}

interface FaqSection {
  title: string
  items: FaqItem[]
}

const sections = computed((): FaqSection[] => {
  if (!props.page) return []

  const parser  = new DOMParser()
  const doc     = parser.parseFromString(props.page.content.rendered, 'text/html')
  const result: FaqSection[] = []
  let currentSection: FaqSection = { title: '', items: [] }

  const children = Array.from(doc.body.children)

  let i = 0
  while (i < children.length) {
    const el = children[i]
    if (!el) { i++; continue }

    const tag     = el.tagName.toLowerCase()
    const text    = el.textContent?.trim() ?? ''

    // H2/H3 → new section title
    if (tag === 'h2' || tag === 'h3') {
      if (currentSection.items.length) {
        result.push(currentSection)
      }
      currentSection = { title: text, items: [] }
      i++
      continue
    }

    // WP accordion/toggle block — wp-block-details or details element
    if (tag === 'details') {
      const summary = el.querySelector('summary')
      const question = summary?.textContent?.trim() ?? ''
      summary?.remove()
      const answer = el.innerHTML.trim()
      if (question) currentSection.items.push({ question, answer })
      i++
      continue
    }

    // WP FAQ block — look for heading+paragraph pairs
    // Question is a <p><strong>...</strong></p> or standalone <strong>
    if (tag === 'p') {
      const strong = el.querySelector('strong')
      if (strong && el.children.length === 1) {
        // This paragraph is just a bold question
        const question = strong.textContent?.trim() ?? ''
        // Collect following paragraphs as answer until next bold-only p
        const answerParts: string[] = []
        let j = i + 1
        while (j < children.length) {
          const next    = children[j]
          if (!next) break
          const nextTag = next.tagName.toLowerCase()
          // Stop at next question (bold-only p) or heading
          if (nextTag === 'h2' || nextTag === 'h3') break
          if (nextTag === 'p') {
            const nextStrong = next.querySelector('strong')
            if (nextStrong && next.children.length === 1) break
          }
          answerParts.push(next.outerHTML)
          j++
        }
        if (question && answerParts.length) {
          currentSection.items.push({ question, answer: answerParts.join('') })
          i = j
          continue
        }
      }
    }

    // WP uses h4/h5 as questions in some FAQ layouts
    if ((tag === 'h4' || tag === 'h5') && text) {
      const question = text
      const answerParts: string[] = []
      let j = i + 1
      while (j < children.length) {
        const next    = children[j]
        if (!next) break
        const nextTag = next.tagName.toLowerCase()
        if (['h2', 'h3', 'h4', 'h5'].includes(nextTag)) break
        answerParts.push(next.outerHTML)
        j++
      }
      if (question && answerParts.length) {
        currentSection.items.push({ question, answer: answerParts.join('') })
        i = j
        continue
      }
    }

    i++
  }

  if (currentSection.items.length) {
    result.push(currentSection)
  }

  // Fallback — if nothing parsed, return empty (WpDefaultPage will handle)
  return result
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
.content-card { border-radius: 18px; }

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1976d2;
  padding: 4px 0;
  border-bottom: 2px solid #1976d2;
  margin-bottom: 8px;
}

.faq-question {
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.faq-answer {
  font-size: 13px;
  line-height: 1.7;
  color: #444;
}

.faq-answer :deep(p)  { margin-bottom: 8px; }
.faq-answer :deep(a)  { color: #1976d2; }
.faq-answer :deep(ul),
.faq-answer :deep(ol) { padding-left: 20px; margin-bottom: 8px; }
.faq-answer :deep(li) { margin-bottom: 4px; }

@media (max-width: 600px) {
  .page-container { padding: 8px; }
  .inner-wrapper  { padding: 0 4px; }
  .faq-answer     { font-size: 12px; }
}
* { box-sizing: border-box; }
</style>
