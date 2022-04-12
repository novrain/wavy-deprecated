import { defineStore } from 'pinia'
import { RawSerialPortSession } from '../../wavy/session/RawSerialPortSession'

let sessions: RawSerialPortSession[] = []
export const wavyStore = defineStore('wavy', {
  state: () => {
    return {
      sessions: sessions
    }
  },
  actions: {
    newSession(s: RawSerialPortSession) {
      this.sessions.push(s)
    }
  }
})