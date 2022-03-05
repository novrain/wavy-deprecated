import {
  Expose,
  Type
} from 'class-transformer'
import {
  Block,
  UndefinableBlock
} from './Block'
import {
  BlockTransformer,
  DataFrame,
  Frame,
  RefBlock,
  RefFrame,
  Suite,
  UndefinableFrame,
  WavyItem
} from "./Frame"

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
