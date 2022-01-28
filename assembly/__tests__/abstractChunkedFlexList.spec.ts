import {HollowChunkedFlexList} from "../hollowChunkedFlexList"
import {AbstractChunk} from "../abstractChunk";

describe("AbstractChunkedFlexList", () => {
	beforeAll(AbstractChunk.init)
	test("AbstractChunkedFlexList.makeSpace", () => {
		const list = new HollowChunkedFlexList<u64>()
		expect(list.size).toBe(0)
		expect(list.depth).toBe(0)
		expect(list.topChunk).toBeNull()
		expect(list.lastChunks.length).toBe(0)

		list.makeSpace()
		expect(list.size).toBe(0)
		expect(list.depth).toBe(1)
		expect(list.topChunk).not.toBeNull()
		expect(list.lastChunks.length).toBe(1)
		expect(list.lastChunks[0]).toBe(list.topChunk!)

		while (list.size < (AbstractChunk.maxSize as u64)) {
			list.appendNode(1)
		}
		list.makeSpace()
		expect(list.size).toBe(256)
		expect(list.depth).toBe(2)
		expect(list.topChunk).not.toBeNull()
		expect(list.lastChunks.length).toBe(2)
		expect(list.lastChunks[0]).not.toBe(list.topChunk!)
		expect(list.lastChunks[0].size).toBe(0)
		expect(list.lastChunks[1]).toBe(list.topChunk!)
		expect(list.lastChunks[1].size).toBe(2)

		const list2 = new HollowChunkedFlexList<u64>()
		const max = 1 << ((AbstractChunk.indexBits as u64) * 2) as u64;
		while (list2.size < max) {
			list2.appendNode(1)
		}
	})
})