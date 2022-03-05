import { Buffer } from 'buffer'
import { Exclude, Expose } from 'class-transformer'

export type UndefinableBuffer = Buffer | undefined

/**
 *  数据块类型
 */
export type BlockType = 'Ref' | 'Decimal' | 'Hex' | 'String' | 'ComputedFromPreBlcok'

/**
 * 数据二次加工
 */
// 标准 | 重复
type DataProcessing = 'None' | 'Repeat'

/**
 * 字节序
 */
type Endian = 'BigEndian' | 'LittleEndian'

export interface Block {
  readonly id: string
  name: string
  __type: BlockType
  encode(): UndefinableBuffer
  decode(raw: Buffer, offset: number): number
}

export type UndefinableBlock = Block | undefined

type PadSide = 'End' | 'Start'

/** 数据块接口 */
export interface DataBlock extends Block {
  readonly strValue: string
  // value: number | string | Buffer
  padToLength: number
  padSide: PadSide
  pad: number | string
}

const isBigEndian = (v: Endian): boolean => {
  return v === "BigEndian"
}

type DecimalNumberType = 'UInt8' | 'Int8' | 'UInt16' | 'Int16' | 'UInt32' | 'Int32' | 'UInt64' | 'Int64' | 'Float' | 'Double'

/**
 * 数值型可以转换的数据传输编码类型
 */
//  十六进制 | BCD | ASCII
type DecimalEncoding = 'Hex' | 'BCD(8421)' | 'ASCII'

/**
 * Decimal Data Block
 */
export class DecimalBlock implements DataBlock {

  __type: BlockType = 'Decimal'

  @Exclude()
  _value: number | bigint = 0
  strValue: string

  constructor(
    readonly id: string,
    public name: string,
    value: number | bigint = 0,
    public numberType: DecimalNumberType = 'Int8',
    public endian: Endian = 'BigEndian',
    public encoding: DecimalEncoding = 'Hex',
    public padToLength: number = 1,
    public padSide: PadSide = 'Start',
    public pad: number | string = 0
  ) {
    this._value = value || this._value
    this.strValue = this._value + ''
  }

  set value(v: number | bigint) {
    this._value = v || 0
    this.strValue = this._value + ''
  }

  @Expose()
  get value(): number | bigint {
    return this._value
  }

  get numberLength(): number {
    switch (this.numberType) {
      case 'Float':
        return 4
      case 'Double':
        return 8
      case 'Int8':
      case 'UInt8':
        return 1
      case 'UInt16':
      case 'Int16':
        return 2
      case 'UInt32':
      case 'Int32':
        return 4
      case 'UInt64':
      case 'Int64':
        return 8
    }
  }

  encode(): UndefinableBuffer {
    let v = this._value
    switch (this.encoding) {
      case 'Hex':
        {
          let numberLength = this.numberLength
          let size = Math.max(numberLength, this.padToLength)
          let padLength = size - numberLength
          let buff = Buffer.alloc(size)
          let isBE = isBigEndian(this.endian)
          let fn: any = undefined
          switch (this.numberType) {
            case 'Int8':
            case 'Int16':
            case 'Int32':
              fn = isBE ? buff.writeIntBE : buff.writeIntLE
              break
            case 'UInt8':
            case 'UInt16':
            case 'UInt32':
              fn = isBE ? buff.writeUIntBE : buff.writeUIntLE
              break
            case 'Int64':
              v = BigInt(v)
              fn = isBE ? buff.writeBigInt64BE : buff.writeBigInt64LE
              break
            case 'UInt64':
              v = BigInt(v)
              fn = isBE ? buff.writeBigUInt64BE : buff.writeBigUInt64LE
              break
            case 'Float':
              fn = isBE ? buff.writeFloatBE : buff.writeFloatLE
              break
            case 'Double':
              fn = isBE ? buff.writeDoubleBE : buff.writeDoubleLE
              break
          }
          fn = fn.bind(buff)
          let pad = Number(this.pad) & 0xFF // can only pad byte
          if (this.padSide === 'End') {
            fn(v, 0, numberLength)
            if (padLength > 0) {
              for (let i = numberLength + 1; i < size; i++) {
                buff.writeInt8(pad, i)
              }
            }
          } else {
            if (padLength > 0) {
              for (let i = 0; i < padLength; i++) {
                buff.writeInt8(pad, i)
              }
            }
            fn(v, padLength, numberLength)
          }
          return buff
        }
      case 'ASCII':
        {
          let v = this.strValue
          let pad = this.pad + ''
          if (this.padSide === 'End') {
            v = v.padEnd(this.padToLength, pad)
          } else {
            v = v.padStart(this.padToLength, pad)
          }
          let buff = Buffer.alloc(v.length)
          buff.write(v, 'ascii')
          return buff
        }
      default:
        return undefined
    }
  }

  decode(raw: Buffer, offset: number): number {
    throw new Error('Method not implemented.')
  }
}

//  十六进制 | Base64 | ASCII
type StringEncoding = 'Hex' | 'Base64' | 'ASCII'

/**
 * String Data Block
 */
export class StringBlock implements DataBlock {

  __type: BlockType = 'String'
  strValue: string = '0'

  constructor(
    readonly id: string,
    public name: string,
    value: string = '0',
    public encoding: StringEncoding = 'ASCII',
    public endian: Endian = 'BigEndian',
    public padToLength: number = 1,
    public padSide: PadSide = 'Start',
    public pad: number | string = 0
  ) {
    this.strValue = value
  }

  set value(v: string) {
    this.strValue = v || this.strValue
  }

  @Expose()
  get value(): string {
    return this.strValue
  }

  encode(): UndefinableBuffer {
    let buff = Buffer.from(this.strValue, this.encoding as BufferEncoding)
    return buff
  }

  decode(raw: Buffer, offset: number): number {
    throw new Error('Method not implemented.')
  }
}
