<script setup>
defineProps({
  index: { type: String, required: true },
  en: { type: String, required: true },
  title: { type: String, required: true },
  note: { type: String, default: '' },
  desc: { type: String, default: '' }
})
</script>

<template>
  <div class="sec-head" data-reveal>
    <div class="sec-head__row">
      <span class="sec-head__index">{{ index }}</span>
      <span class="sec-head__en">{{ en }}</span>
      <span class="rule" aria-hidden="true" />
      <span v-if="note" class="sec-head__note">{{ note }}</span>
    </div>
    <div class="sec-head__bottom">
      <h2 class="sec-head__title">{{ title }}</h2>
      <p v-if="desc" class="sec-head__desc">{{ desc }}</p>
      <slot name="aside" />
    </div>
  </div>
</template>
