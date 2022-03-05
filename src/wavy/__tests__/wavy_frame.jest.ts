import { DecimalBlock, StringBlock } from "../Block"
import { DataFrame } from "../Frame"

test('frames', () => {
  let f = new DataFrame('f1', 'f1')
  f.addBlock(new DecimalBlock('b1', 'b1', 1234, 'UInt16'))
  f.addBlock(new StringBlock('b2', 'b2', '12345'))
  let buff = f.encode()
  expect(buff!.length).toEqual(7)
  let v = buff?.readUint16BE()
  expect(v).toEqual(1234)
})