<template>
  <ElConfigProvider :locale="locale">
    <div class="app-root">
      <Logo v-if="!loaded"
            showProgress />
      <Wavy v-else
            class="wavy" />
    </div>
  </ElConfigProvider>
</template>

<script lang="ts" setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { reactive, ref } from 'vue'
import Logo from './components/Logo.vue'
import Wavy from './Wavy.vue'

const locale = reactive(zhCn)
const loaded = ref(false)
setTimeout(() => {
  loaded.value = true
}, 2000)
</script>

<style lang="stylus">
* {
  margin: 0;
}

#app {
  font-family: 'Source Sans Pro';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  width: 100vw;
  height: 100vh;
}
</style>

<style scoped lang="stylus">
.app-root {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  user-select: none;
  -webkit-user-drag: none;
  will-change: transform;
  cursor: default;
  animation: 0.5s ease-out fadeIn;
  transition: 0.25s background;
  background: #1D272D;

  .wavy {
    flex: 1;
  }
}
</style>
