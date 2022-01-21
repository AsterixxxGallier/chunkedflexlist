import {AbstractChunk} from "../abstractChunk"

describe("AbstractChunk initialisation", () => {
	beforeAll(AbstractChunk.init)
	test("AbstractChunk.indexBits", () => {
		expect<i32>(AbstractChunk.indexBits).toBe(8)
	})
	test("AbstractChunk.maxSize", () => {
		expect<i32>(AbstractChunk.maxSize).toBe(256)
	})
	test("AbstractChunk.numbersOfLinks", () => {
		for (let i = 0; i < 256; i++) {
			const numberOfLinks = AbstractChunk.numbersOfLinks[i]
			for (let j = 0; j < (numberOfLinks as i32); j++) {
				let destination = i + (1 << j)
				expect(destination).toBeLessThan(256)
				let ones = popcnt(i ^ destination)
				expect(ones).toBeGreaterThanOrEqual(1)
				expect(ones).toBeLessThanOrEqual(ctz(destination) + 1)
			}
		}
	})
	test("AbstractChunk.linkIndexesAbove", () => {
		for (let i = 0; i < 256; i++) {
			const linkIndexesAbove = AbstractChunk.linkIndexesAbove[i]
			for (let j = 0; j < linkIndexesAbove.length; j++) {
				const linkIndex = linkIndexesAbove[j]
				expect(linkIndex.degree).toBe(j as u8)
				expect(linkIndex.nodeIndex).toBeLessThan(i as u8)
				expect(linkIndex.nodeIndex as i32 + (1 << j)).toBeGreaterThanOrEqual(i)
			}
		}
	})
})