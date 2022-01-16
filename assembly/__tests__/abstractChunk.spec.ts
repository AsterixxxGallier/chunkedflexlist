import {AbstractChunk} from "../abstractChunk"

describe("AbstractChunk initialisation", () => {
	AbstractChunk.init()
	test("AbstractChunk.indexBits", () => {
		expect<i32>(AbstractChunk.indexBits).toBe(8)
	})
	test("AbstractChunk.maxSize", () => {
		expect<i32>(AbstractChunk.maxSize).toBe(256)
	})
	test("AbstractChunk.numbersOfLinks", () => {
		expect<StaticArray<u8>>(
			StaticArray.fromArray<u8>([
				4,
				1,
				2,
				1,
				3,
				1,
				2,
				1,
				3,
				1,
				2,
				1,
				2,
				1,
				1,
				0
			]))
	})
	test("AbstractChunk.linkIndexesAbove", () => {
		for (let i = 0; i < 256; i++) {
			const linkIndexesAbove = AbstractChunk.linkIndexesAbove[i]
			for (let j = 0; j < linkIndexesAbove.length; j++) {
				let linkIndex = linkIndexesAbove[j]
				expect(linkIndex.degree).toBe(j as u8)
				expect(linkIndex.nodeIndex).toBeLessThan(i as u8)
				expect(linkIndex.nodeIndex as i32 + 1 << j).toBeGreaterThanOrEqual(i)
			}
		}
	})
})