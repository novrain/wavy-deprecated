
<template>
  <div class="preload-logo">
    <div>
      <div class="wavy-logo"></div>
      <h1 class="wavy-title">
        Wavy
        <!-- <sup>α</sup> -->
      </h1>
      <div class="progress"
           v-if="showProgress">
        <div class="bar"
             style="width: 0%"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: ['showProgress']
})
</script>

<style scoped lang="stylus">
.preload-logo {
  -webkit-app-region: drag;
  width: 100%;
  height: 100%;
  display: flex;
  animation: 0.5s ease-out fadeIn;
  background-image: radial-gradient(#3a66820a 0%, #000e17 30%, black 100%);
  background-color: black;

  &>div {
    width: 200px;
    height: 200px;
    margin: auto;
    flex: none;

    .progress {
      background: rgba(0, 0, 0, 0.25);
      height: 3px;
      margin: 10px 50px;

      .bar {
        transition: 1s ease-out width;
        background: #a1c5e4;
        height: 3px;
        box-shadow: 0 0 2px #ffffff1f;
      }
    }
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.wavy-logo {
  width: 120px;
  height: 120px;
  background: url('../assets/logo.svg');
  background-repeat: no-repeat;
  background-size: contain;
  margin: auto;
}

.wavy-title {
  color: #a1c5e4;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  font-weight: normal;
  font-size: 32px;
  margin: 0;

  .sup {
    color: #842fe0;
  }
}
</style>
