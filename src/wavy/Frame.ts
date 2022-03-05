import 'reflect-metadata'

import { Buffer } from "buffer"
import {
  Block,
  BlockType,
  DecimalBlock,
  StringBlock,
  UndefinableBlock,
  UndefinableBuffer
} from "./Block"
import { Expose, Type } from 'class-transformer'

type UndefinableWavyProject = WavyProject | undefined

export class RefBlock implements Block {
  __type: BlockType = 'Ref'
  _block?: Block
  _refId?: string
  _project?: WavyProject

  constructor(
    readonly id: string,
    public name: string,
    refId?: string,
    project?: WavyProject
  ) {
    this._refId = refId
    this._project = project
  }

  set project(v: UndefinableWavyProject) {
    this._project = v
  }

  get project(): UndefinableWavyProject {
    return this._project
  }

  set refId(v: string) {
    this._refId = v
  }

  get block(): UndefinableBlock {
    if (this._project && this._refId) {
      this._block = this._project.findBlock(this._refId)
    }
    return this._block
  }

  encode(): UndefinableBuffer {
    this.block
    if (this._block) {
      return this._block.encode()
    } else {
      return undefined
    }
  }

  decode(raw: Buffer, offset: number): number {
    this.block
    if (this._block) {
      return this._block.decode(raw, offset)
    } else {
      return 0
    }
  }
}

const BlockTransformer = Type(() => Object, {
  discriminator: {
    property: '__type',
    subTypes: [
      { value: RefBlock, name: 'Ref' },
      { value: DecimalBlock, name: 'Decimal' },
      { value: StringBlock, name: 'String' },
    ],
  },
})

type FrameType = 'Ref' | 'Data'

export interface WavyItem {
  readonly id: string
  name: string
  project?: WavyProject
  injectProjectToRef(): void
}

export interface Frame extends WavyItem {
  encode(): UndefinableBuffer
  decode(raw: Buffer, offset: number): number
  decodeByResponse(raw: Buffer, offset: number): number
}

type UndefinableFrame = Frame | undefined

export class RefFrame implements Frame {
  _frame?: Frame
  _project?: WavyProject

  @Expose({ name: 'refId' })
  _refId?: string

  constructor(
    readonly id: string,
    public name: string,
    refId?: string,
    project?: WavyProject
  ) {
    this._refId = refId
    this._project = project
  }

  set project(v: UndefinableWavyProject) {
    this._project = v
  }

  get project(): UndefinableWavyProject {
    return this._project
  }

  injectProjectToRef(): void {
  }

  set refId(v: string) {
    this._refId = v
  }

  get frame(): UndefinableFrame {
    if (this._project && this._refId) {
      let f = this._project.findFrame(this._refId)
      this._frame = f
    }
    return this._frame
  }

  encode(): UndefinableBuffer {
    this.frame
    if (this._frame) {
      return this._frame.encode()
    } else {
      return undefined
    }
  }

  decode(raw: Buffer, offset: number): number {
    this.frame
    if (this._frame) {
      return this._frame.decode(raw, offset)
    } else {
      return 0
    }
  }

  decodeByResponse(raw: Buffer, offset: number): number {
    this.frame
    if (this._frame) {
      return this._frame.decodeByResponse(raw, offset)
    } else {
      return 0
    }
  }
}

export class DataFrame implements Frame {
  @BlockTransformer
  blocks: Block[] = []
  @Type(() => Object, {
    discriminator: {
      property: '__type',
      subTypes: [
        { value: RefFrame, name: 'Ref' },
        { value: DataFrame, name: 'Data' }
      ],
    },
  })
  @Expose({ name: 'responseFrame' })
  _responseFrame?: Frame
  _project?: WavyProject

  constructor(
    readonly id: string,
    public name: string,
    blocks?: Block[],
    responseFrame?: Frame,
    project?: WavyProject
  ) {
    if (blocks) {
      this.blocks = blocks
    }
    this._responseFrame = responseFrame
    this._project = project
  }

  addBlock(block: Block) {
    this.blocks.push(block)
  }

  set project(v: UndefinableWavyProject) {
    this._project = v
  }

  get project(): UndefinableWavyProject {
    return this._project
  }

  injectProjectToRef(): void {
    if (this._project) {
      let p = this._project
      this.blocks.forEach((b => {
        if (b instanceof RefBlock) {
          b.project = p
        }
      }))
    }
  }

  set responseFrame(frame: Frame) {
    this._responseFrame = frame
  }

  get responseFrame(): Frame {
    if (this._responseFrame) {
      return this._responseFrame
    }
    else {
      throw Error('response frame is undefined')
    }
  }

  encode(): UndefinableBuffer {
    let buffs = this.blocks.map(b => b.encode() || Buffer.alloc(0)) // @Todo 处理异常？
    return Buffer.concat(buffs)
  }

  decode(raw: Buffer, offset: number): number {
    throw new Error('Method not implemented.')
  }

  decodeByResponse(raw: Buffer, offset: number): number {
    return this.responseFrame.decode(raw, offset)
  }
}

type WavyItemType = FrameType | 'Suite'

export class Suite implements WavyItem {
  // Cannot declare before Suite
  @Type(() => Object, {
    discriminator: {
      property: '__type',
      subTypes: [
        { value: RefFrame, name: 'Ref' },
        { value: DataFrame, name: 'Data' },
        { value: Suite, name: 'Suite' },
      ],
    },
  })
  @Expose({ name: 'frames' })
  _frames: WavyItem[] = []
  _project?: WavyProject

  constructor(
    readonly id: string,
    public name: string,
    frames?: WavyItem[],
    project?: WavyProject
  ) {
    if (frames) {
      this._frames = frames
      this._project = project
      this.injectProjectToRef()
    }
  }

  set project(v: UndefinableWavyProject) {
    this._project = v
    this.injectProjectToRef()
  }

  get project(): UndefinableWavyProject {
    return this._project
  }

  injectProjectToRef(): void {
    if (this._project) {
      this._frames.forEach((f => {
        f.project = this._project
      }))
    }
  }

  addFrame(frame: WavyItem): void {
    this._frames.push(frame)
  }
}

type UndefinableWavyItem = WavyItem | undefined

export class WavyProject {
  @Expose({ name: 'frames' })
  @Type(() => Object, {
    discriminator: {
      property: '__type',
      subTypes: [
        { value: RefFrame, name: 'Ref' },
        { value: DataFrame, name: 'Data' },
        { value: Suite, name: 'Suite' },
      ],
    },
  })
  _frames: WavyItem[] = []
  @Expose({ name: 'blocks' })
  @BlockTransformer
  _blocks: Block[] = []

  constructor(
    public name: string,
    frames?: WavyItem[],
    blocks?: Block[]
  ) {
    if (frames) {
      this._frames = frames
    }
    if (blocks) {
      this._blocks = blocks
    }
    this.injectProjectToRef()
  }

  injectProjectToRef(): void {
    this._frames.forEach((f => {
      f.project = this
    }))
    this._blocks.forEach((b => {
      if (b instanceof RefBlock) {
        b.project = this
      }
    }))
  }

  addFrame(frame: WavyItem): void {
    this._frames.push(frame)
  }

  findFrame(id: string): UndefinableFrame {
    let f = this._frames.find((f) => {
      return f.id === id
    })
    if (f instanceof Suite) {
      return undefined
    }
    return f as Frame
  }

  findWavyItem(id: string): UndefinableWavyItem {
    let f = this._frames.find((f) => {
      return f.id === id
    })
    return f
  }

  addBlock(block: Block): void {
    this._blocks.push(block)
  }

  findBlock(id: string): UndefinableBlock {
    let b = this._blocks.find((b) => {
      return b.id === id
    })
    return b
  }
}
