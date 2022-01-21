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
})