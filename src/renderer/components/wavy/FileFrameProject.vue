<template>
  <FrameProjectComp v-if="state.project"
                    v-model:project="state.project">
  </FrameProjectComp>
</template>

<script lang="ts" setup>
import FrameProjectComp from './FrameProject.vue'
import { FrameProject } from '../../../../dist/wavy/frame/FrameProject'
import { reactive, onMounted } from 'vue'
import fs from 'fs'

const props = defineProps<{
  file: string
}>()

const state = reactive({
  file: props.file,
  project: null,
})

if (props.file) {
  onMounted(() => {
    fs.readFile(props.file, (err, context) => {
      if (!err) {
      }
    })
  })
} else {
  state.project = new FrameProject('New Project')
}
</script>

<style lang="stylus" scoped></style>