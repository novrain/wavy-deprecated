<template>
  <div class="wavy-app">
    <div class="tab-bar">
      <div class="tabs"
           v-if="store.sessions.length > 0">
        <div :class="actived -1 === i ? 'tab-header active':'tab-header'"
             v-for="s,i in store.sessions"
             :key="s.options.port">
          <!-- <div :class="actived === i ? 'activity-indicator active':'activity-indicator'"></div> -->
          <div class="index">{{i+1}}</div>
          <div class="name">{{`${s.options.port}  (${s.options.description})`}}</div>
          <button class="btn">
            <Close />
          </button>
        </div>
      </div>
      <div class="btn-group background">
        <button class="btn btn-secondary btn-tab-bar dropdown-toggle"
                @click="onOpenList">
          <Plus />
        </button>
      </div>
      <div class="space background">

      </div>
      <div class="btn-group background">
        <button class="btn btn-secondary btn-tab-bar dropdown-toggle">
          <Setting />
        </button>
      </div>
    </div>
    <div class="content">
      <div class="startup"
           v-if="store.sessions.length == 0">
        <Logo />
        <div class="list-group">
          <a :key="p.port"
             class="list-group-item"
             v-for="p in serial.ports"
             @click="()=>onSelectSerial(p)">
            <el-icon class="i">
              <plus />
            </el-icon>
            <span>{{`${p.port}  (${p.description})`}}</span>
          </a>
        </div>
      </div>
      <div class="content-tab content-tab-active"
           v-else>
      </div>
      <el-dialog v-model="openOne"
                 :width="800"
                 custom-class="open-baudrate-dialog"
                 :show-close="false"
                 title="波特率">
        <template #default>
          <div class="list-group">
            <a :key="i"
               class="list-group-item"
               v-for="b,i in BAUD_RATES"
               @click="()=>onSelectBaudrate(b)">
              <span>{{b}}</span>
            </a>
          </div>
        </template>
      </el-dialog>
      <el-dialog v-model="openList"
                 :width="800"
                 custom-class="open-serial-dialog"
                 :show-close="false"
                 title="串口">
        <template #default>
          <div class="list-group">
            <a :key="p.port"
               class="list-group-item"
               v-for="p in serial.ports"
               @click="()=>onSelectSerial(p)">
              <el-icon class="i">
                <plus />
              </el-icon>
              <span>{{`${p.port}  (${p.description})`}}</span>
            </a>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Plus,
  Setting,
  Close
} from '@element-plus/icons-vue'
import { wavyStore } from './store/wavy'
import Logo from './components/Logo.vue'
import { reactive, ref } from 'vue'
import { BAUD_RATES, RawSerialPortSession } from '../wavy/session/RawSerialPortSession'


const { autoDetect } = require('@serialport/bindings-cpp')
const store = wavyStore()
let serial = reactive({
  ports: []
})
const listPorts = async () => {
  let ps = []
  try {
    ps = (await autoDetect().list()).sort((l, r) => {
      if (l.path < r.path) {
        return -1
      }
      if (l.path > r.path) {
        return 1
      }
      return 0
    }).map((x: any) => {
      return {
        port: x.path,
        description: `${x.manufacturer ?? ''} ${x.serialNumber ?? ''}`.trim() || undefined,
      }
    })
  }
  catch (e) { }
  serial.ports = ps
}
listPorts()


const actived = ref(store.sessions.length)
const openOne = ref(false)
const serialOption = reactive({
  port: null,
  baudrate: 9600,
  description: null
})
const onSelectSerial = (port) => {
  openList.value = false
  serialOption.port = port.port
  serialOption.description = port.description
  openOne.value = true
}
const onSelectBaudrate = (baudrate) => {
  openOne.value = false
  serialOption.baudrate = baudrate
  let newSesion: RawSerialPortSession = {
    options: {
      ...serialOption
    }
  }
  actived.value = store.sessions.length + 1
  store.newSession(newSesion)
}

const openList = ref(false)
const onOpenList = () => {
  openList.value = true
}

</script>

<style scoped lang="stylus">
$tabs-height = 38px;
$tab-border-radius = 4px;
$side-tab-width = 200px;
$border-color = #111;
$button-hover-bg = rgba(0, 0, 0, 0.25);
$button-active-bg = rgba(0, 0, 0, 0.5);
$content-bg = rgba(39, 49, 60, 0.65); // #1D272D;
$content-bg-solid = #1D272D;

.wavy-app {
  display: flex;
  flex-direction: column;

  .tab-bar {
    flex: none;
    height: $tabs-height;
    display: flex;
    width: 100%;

    button.btn>svg {
      pointer-events: none;
      width: 16px;
      height: 16px;
      fill: white;
      // fill-opacity: 0.75;
    }

    .btn-tab-bar {
      background: transparent;
      line-height: $tabs-height + 2px;
      height: $tabs-height;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0 12px;
      flex: 0 0 auto;
      border-bottom: 2px solid transparent;
      transition: 0.125s all ease-out;
      font-size: 12px;
      text-transform: uppercase;
      font-weight: bold;
      color: #aaa;
      border: none;
      border-radius: 0;
      align-items: center;

      &.dropdown-toggle::after {
        display: none;
      }

      &:hover {
        background: rgba(0, 0, 0, 0.25) !important;
      }

      &:active, &[aria-expanded-true] {
        background: rgba(0, 0, 0, 0.5) !important;
      }

      &:focus {
        box-shadow: none;
      }

      &::after {
        display: none;
      }
    }

    &>.tabs {
      flex: 0 1 auto;
      display: flex;
      min-width: 0;

      .tab-header {
        border-left: 1px solid transparent;
        border-right: 1px solid transparent;
        transition: 0.125s ease-out width;
        color: white;
        border-left: 1px solid #111;
        border-right: 1px solid #111;
        position: relative;
        cursor: pointer;
        flex: 1000 1 200px;
        width: 200px;
        padding: 0 10px;
        display: flex;
        flex-direction: row;
        min-width: 0;
        overflow: hidden;

        &:first-child {
          border-left: none;
        }

        .index {
          color: rgba(255, 255, 255, 0.4);
          flex: none;
          font-weight: bold;
          -webkit-app-region: no-drag;
          cursor: -webkit-grab;
          width: 22px;
          border-radius: 10px;
          text-align: center;
          transition: 0.25s all;
          align-self: center;
          margin-top: 1px;
        }

        .icon {
          opacity: 0.75;
        }

        .name {
          flex: auto;
          margin-top: 1px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          min-width: 0;
          align-self: center;
          margin-left: 10px;
        }

        button.btn>svg {
          pointer-events: none;
          width: 16px;
          height: 16px;
          fill: white;
        }

        button {
          color: #ccc;
          border: none;
          transition: 0.25s all;
          right: 5px;
          display: block;
          flex: none;
          background: transparent;
          opacity: 0;
          -webkit-app-region: no-drag;
          position: absolute;
          width: 26px;
          height: 26px;
          border-radius: 4.33333px;
          line-height: 26px;
          align-self: center;
          text-align: center;
          font-size: 20px;
          cursor: pointer;

          .icon {
          }

          &:hover {
            background: $button-active-bg !important;
          }

          &:active {
            background: $button-active-bg !important;
          }
        }

        .progressbar {
          background: $green;
        }

        &:hover {
          .name {
            -webkit-mask-image: linear-gradient(black 0 0), linear-gradient(to left, transparent 0%, black 100%);
            -webkit-mask-size: calc(100% - 60px) auto, 60px auto;
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-position: left, right;
          }

          button {
            transition: 0.25s opacity;
            display: block;
            opacity: 1;
          }
        }

        .activity-indicator {
          background: rgba(255, 255, 255, 0.2);
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 4px;
          height: 2px;
          z-index: -1;
        }

        &.active {
          color: white;
          background: $content-bg;
          border-left: 1px solid $border-color;
          border-right: 1px solid $border-color;

          .activity-indicator {
            display: none;
          }
        }
      }
    }

    &>.space {
      min-width: 1px;
      flex: 1 0 1%;
      margin-top: 2px; // for window resizing
      -webkit-app-region: drag;

      &.persistent {
        min-width: 72px; // 2 x 36 px height, ie 2 squares
      }
    }
  }

  &.tabs-on-top .tab-bar {
    &>.background {
      border-bottom: 1px solid $border-color;
    }

    .tab-header {
      border-bottom: 1px solid $border-color;

      &.active {
        border-bottom-color: transparent;
      }
    }
  }

  &:not(.tabs-on-top) .tab-bar {
    &>.background {
      border-top: 1px solid $border-color;
    }

    .tab-header {
      border-top: 1px solid $border-color;

      &.active {
        margin-top: -1px;
      }
    }
  }

  .content {
    width: 100vw;
    flex: 1 1 0%;
    display: flex;
    flex-direction: column-reverse;
    position: relative;
    min-height: 0;
    min-width: 0;

    > .content-tab {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      left: -1000%;

      &.content-tab-active {
        left: 0;
      }
    }
  }

  .startup {
    flex: none;
    margin: auto;
    width: 350px;
    max-width: 100vw;
    display: flex;
    flex-direction: column;

    :deep(.preload-logo) {
      background: transparent;
    }
  }

  .list-group {
    display: flex;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
    border-radius: 0.4rem;

    .list-group-item {
      position: relative;
      display: flex;
      padding: 0.8rem 1rem;
      background-color: rgba(255, 255, 255, 0.025);
      border: 1px solid rgba(0, 0, 0, 0);
      color: #ccc;

      &:hover {
        z-index: 1;
        color: #fff;
        text-decoration: none;
        background-color: rgba(255, 255, 255, 0.05);
      }

      .i {
        margin-right: 8px;
      }
    }
  }
}
</style>

<style lang="stylus">
.open-serial-dialog, .open-baudrate-dialog {
  margin-top: 0;
  background-color: #1D272D;
  overflow-y: auto;

  .el-dialog__title {
    color: #CCC !important;
  }
}
</style>