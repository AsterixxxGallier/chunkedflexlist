import {HollowChunk} from "../hollowChunk"
import {AbstractChunk} from "../abstractChunk";
import {LinkIndex} from "../linkIndex";

describe("HollowChunk", () => {
	beforeAll(AbstractChunk.init)
	test("HollowChunk link length accessors", () => {
		const chunk = new HollowChunk<f64>()
		for (let nodeIndex = 0 as u8; nodeIndex < (chunk.linkLengths.length as u8); nodeIndex++) {
			const linkLengths = chunk.linkLengths[nodeIndex]
			for (let degree = 0 as u8; degree < (linkLengths.length as u8); degree++) {
				const linkIndex = new LinkIndex(nodeIndex, degree)
				expect(chunk.getLinkLengthUnchecked(nodeIndex, degree)).toBe(0.0)
				expect(chunk.getLinkLengthUncheckedByLinkIndex(linkIndex)).toBe(0.0)

				const firstLength = Math.random() * 2000000 - 1000000
				chunk.setLinkLengthUnchecked(nodeIndex, degree, firstLength)
				expect(chunk.getLinkLengthUnchecked(nodeIndex, degree)).toBe(firstLength)
				expect(chunk.getLinkLengthUncheckedByLinkIndex(linkIndex)).toBe(firstLength)

				const secondLength = Math.random() * 2000000 - 1000000
				chunk.setLinkLengthUncheckedByLinkIndex(linkIndex, secondLength)
				expect(chunk.getLinkLengthUnchecked(nodeIndex, degree)).toBe(secondLength)
				expect(chunk.getLinkLengthUncheckedByLinkIndex(linkIndex)).toBe(secondLength)
			}
		}
	})
	test("HollowChunk.appendPointUnchecked", () => {
		const chunk = new HollowChunk<f64>()
		expect(chunk.size).toBe(0)
		expect(chunk.totalLength).toBe(0.0)

		chunk.appendPointUnchecked(Math.random())
		expect(chunk.size).toBe(1)
		expect(chunk.totalLength).toBe(0.0)
		{
			let nodeIndex = 0 as u8
			do {
				for (let degree = 0 as u8; degree < AbstractChunk.numbersOfLinks[nodeIndex]; degree++) {
					expect(chunk.getLinkLengthUnchecked(nodeIndex, degree)).toBe(0)
				}
				nodeIndex++
			} while (nodeIndex <= AbstractChunk.maxLastIndex)
		}

		let random1 = Math.random();
		chunk.appendPointUnchecked(random1)
		expect(chunk.size).toBe(2)
		expect(chunk.totalLength).toBe(random1)
		for (let degree = 0 as u8; degree < AbstractChunk.numbersOfLinks[0]; degree++) {
			expect(chunk.getLinkLengthUnchecked(0, degree)).toBe(random1)
		}
		{
			let nodeIndex = 1 as u8
			do {
				for (let degree = 0 as u8; degree < AbstractChunk.numbersOfLinks[nodeIndex]; degree++) {
					expect(chunk.getLinkLengthUnchecked(nodeIndex, degree)).toBe(0)
				}
				nodeIndex++
			} while (nodeIndex <= AbstractChunk.maxLastIndex)
		}

		let random2 = Math.random();
		chunk.appendPointUnchecked(random2)
		expect(chunk.size).toBe(3)
		expect(chunk.totalLength).toBe(random1 + random2)
		expect(chunk.getLinkLengthUnchecked(0, 0)).toBe(random1)
		for (let degree = 1 as u8; degree < AbstractChunk.numbersOfLinks[0]; degree++) {
			expect(chunk.getLinkLengthUnchecked(0, degree)).toBe(random1 + random2)
		}
		expect(chunk.getLinkLengthUnchecked(1, 0)).toBe(random2)
		{
			let nodeIndex = 2 as u8
			do {
				for (let degree = 0 as u8; degree < AbstractChunk.numbersOfLinks[nodeIndex]; degree++) {
					expect(chunk.getLinkLengthUnchecked(nodeIndex, degree)).toBe(0)
				}
				nodeIndex++
			} while (nodeIndex <= AbstractChunk.maxLastIndex)
		}
	})
})