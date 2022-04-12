<template>
  <div class="block">
    <section class="header">
      <span class="id">{{ sBlock.id }}</span>
      <span class="name">{{ sBlock.name }}</span>
    </section>
    <section class="value">{{ sBlock.strValue }}</section>
    <section class="encoded">{{ encoded }}</section>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue'
import { StringBlock } from '../../../wavy/frame/Block'

const props = defineProps<{
  block: StringBlock
}>()

const emit = defineEmits<{
  (e: 'update:bolck', block: StringBlock): void
}>()

const sBlock = reactive(props.block.clone() as StringBlock)

const encoded = computed(() => {
  let buff = sBlock.encode()
  if (buff) {
    return buff.toString('hex')
  } else {
    return 'Encode error.'
  }
})
</script>

<style lang='stylus' scoped></style>