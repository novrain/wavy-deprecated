<template>
  <div class="project">
    <section class="header">
      <span class="name">{{ project.name }}</span>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { FrameProject } from '../../../../dist/wavy/frame/FrameProject'

const props = defineProps<{
  project: FrameProject
}>()

const emit = defineEmits<{
  (e: 'update:project', project: FrameProject): void
}>()

const pjClone = reactive(props.project.clone())
</script>

<style lang='stylus' scoped></style>