import {
  DecimalBlock,
  StringBlock
} from '../frame/Block'

test('decimal bocks int8/uint8', () => {
  //
  let d1 = new DecimalBlock('1', 'd1', 2)
  let buff = d1.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(1)
  expect(buff!.readInt8()).toEqual(2)
  //
  let d2 = new DecimalBlock('1', 'd2', -123, 'Int8', 'BigEndian', 'ASCII', 5, 'Start', ' ')
  buff = d2.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(5)
  expect(buff!.toString('ascii')).toEqual(' -123')
  //
  let d3 = new DecimalBlock('1', 'd3', -123, 'Int8', 'LittleEndian', 'Hex', 5, 'End', 0)
  buff = d3.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(5)
  expect(buff!.readInt8()).toEqual(-123)
  //
  let d4 = new DecimalBlock('1', 'd4', -123, 'Int8', 'BigEndian', 'Hex', 6, 'Start', 0)
  buff = d4.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(6)
  expect(buff!.readInt8(5)).toEqual(-123)
  //
  let d5 = new DecimalBlock('1', 'd5', 123, 'UInt8', 'BigEndian', 'Hex', 6, 'Start', 0)
  buff = d5.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(6)
  expect(buff!.readInt8(5)).toEqual(123)
})

test('decimal bocks int16/uint16', () => {
  //
  let d1 = new DecimalBlock('1', 'd1', 1234, 'Int16')
  let buff = d1.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(2)
  expect(buff!.readInt16BE()).toEqual(1234)
  //
  let d2 = new DecimalBlock('1', 'd2', -123, 'Int16', 'BigEndian', 'ASCII', 5, 'Start', ' ')
  buff = d2.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(5)
  expect(buff!.toString('ascii')).toEqual(' -123')
  //
  let d3 = new DecimalBlock('1', 'd3', -123, 'Int16', 'LittleEndian', 'Hex', 5, 'End', 0)
  buff = d3.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(5)
  expect(buff!.readInt16LE()).toEqual(-123)
  //
  let d4 = new DecimalBlock('1', 'd4', -123, 'Int16', 'BigEndian', 'Hex', 6, 'Start', 0)
  buff = d4.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(6)
  expect(buff!.readInt16BE(4)).toEqual(-123)
})

test('decimal bocks int32/uint32', () => {
  //
  let d1 = new DecimalBlock('1', 'd1', 1234, 'Int32')
  let buff = d1.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(4)
  expect(buff!.readInt32BE()).toEqual(1234)
  //
  let d2 = new DecimalBlock('1', 'd2', -123, 'Int32', 'BigEndian', 'ASCII', 5, 'Start', ' ')
  buff = d2.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(5)
  expect(buff!.toString('ascii')).toEqual(' -123')
  //
  let d3 = new DecimalBlock('1', 'd3', -123, 'Int32', 'LittleEndian', 'Hex', 5, 'End', 0)
  buff = d3.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(5)
  expect(buff!.readInt32LE()).toEqual(-123)
  //
  let d4 = new DecimalBlock('1', 'd4', -123, 'Int32', 'BigEndian', 'Hex', 6, 'Start', 0)
  buff = d4.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(6)
  expect(buff!.readInt32BE(2)).toEqual(-123)
})

test('decimal bocks int64/uint64', () => {
  //
  let d1 = new DecimalBlock('1', 'd1', 1234n, 'Int64')
  let buff = d1.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(8)
  expect(buff!.readBigInt64BE()).toEqual(1234n)
  //
  let d2 = new DecimalBlock('1', 'd2', -123, 'Int64', 'BigEndian', 'ASCII', 5, 'Start', ' ')
  buff = d2.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(5)
  expect(buff!.toString('ascii')).toEqual(' -123')
  //
  let d3 = new DecimalBlock('1', 'd3', -123, 'Int64', 'LittleEndian', 'Hex', 5, 'End', 0)
  buff = d3.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(8)
  expect(buff!.readBigInt64LE()).toEqual(-123n)
  //
  let d4 = new DecimalBlock('1', 'd4', -123, 'Int64', 'BigEndian', 'Hex', 6, 'Start', 0)
  buff = d4.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(8)
  expect(buff!.readBigInt64BE()).toEqual(-123n)
  //
  let d5 = new DecimalBlock('1', 'd5', 123n, 'UInt64', 'LittleEndian', 'Hex', 10, 'Start', 0)
  buff = d5.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(10)
  expect(buff!.readBigInt64LE(2)).toEqual(123n)
})

test('decimal bocks float', () => {
  //
  let d1 = new DecimalBlock('1', 'd1', 1243.1, 'Float')
  let buff = d1.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(4)
  expect(buff!.readFloatBE() - 1243.1).toBeLessThan(0.0001)
  //
  let d2 = new DecimalBlock('1', 'd2', 1243.1, 'Float', 'LittleEndian', 'ASCII', 10, 'Start', ' ')
  buff = d2.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(10)
  expect(buff!.toString('ascii', 4)).toEqual('1243.1')
  //
  let d3 = new DecimalBlock('1', 'd3', 1243.1, 'Float', 'LittleEndian', 'Hex', 10, 'End', '0')
  buff = d3.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(10)
  expect(buff!.readFloatLE() - 1243.1).toBeLessThan(0.0001)
})

test('decimal bocks double', () => {
  //
  let d1 = new DecimalBlock('1', 'd1', 1243.1, 'Double')
  let buff = d1.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(8)
  expect(buff!.readDoubleBE() - 1243.1).toBeLessThan(0.0001)
  //
  let d2 = new DecimalBlock('2', 'd2', 1243.1, 'Double', 'LittleEndian', 'ASCII', 10, 'Start', ' ')
  buff = d2.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(10)
  expect(buff!.toString('ascii', 4)).toEqual('1243.1')
  //
  let d3 = new DecimalBlock('3', 'd3', 1243.1, 'Double', 'LittleEndian', 'Hex', 10, 'End', '0')
  buff = d3.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(10)
  expect(buff!.readDoubleLE() - 1243.1).toBeLessThan(0.0001)
})

test('string bocks hex data', () => {
  //
  let d1 = new StringBlock('1', 'd1', 'ABCDEF', 'Hex')
  let buff = d1.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(3)
  expect(buff!.toString('hex').toUpperCase()).toEqual('ABCDEF')
})

test('string bocks hex data as ascii string', () => {
  //
  let d1 = new StringBlock('1', 'd1', 'ABCDEF', 'ASCII')
  let buff = d1.encode()
  expect(buff).not.toBeUndefined()
  expect(buff!.length).toEqual(6)
  expect(buff!.toString()).toEqual('ABCDEF')
})
