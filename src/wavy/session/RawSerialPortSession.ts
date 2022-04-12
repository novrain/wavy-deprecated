export const BAUD_RATES = [
  110, 150, 300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600, 1500000,
]


export interface SerialProfileOptions {
  port: string
  baudrate?: number
  databits?: number
  stopbits?: number
  parity?: string
  rtscts?: boolean
  xon?: boolean
  xoff?: boolean
  xany?: boolean
  slowSend?: boolean
  description?: string
}


export interface RawSerialPortSession {
  options: SerialProfileOptions
}
