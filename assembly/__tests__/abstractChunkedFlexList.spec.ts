import {HollowChunkedFlexList} from "../hollowChunkedFlexList"
import {AbstractChunk} from "../abstractChunk"

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
		const max = 1 << ((AbstractChunk.indexBits as u64) * 2) as u64
		while (list2.size < max) {
			list2.appendNode(1)
		}
	})

	test("AbstractChunkedFlexList.traverse", () => {
		const list = new HollowChunkedFlexList<u64>()
		list.appendNode(0)
		while (list.size <= 1000) {
			list.appendNode(2)
		}
		for (let d = 2 as u64; d <= (2000 as u64); d++) {
			log(d)

			// const traversalResultAt = list.nodeAt(d)
			// if (d % 2) {
			// 	expect(traversalResultAt).toBeNull()
			// } else {
			// 	expect(traversalResultAt).not.toBeNull()
			// 	expect(traversalResultAt!.index).toBe(d / 2)
			// 	expect(traversalResultAt!.distance).toBe(0)
			// }

			// const traversalResultBefore = list.nodeBefore(d)
			// if (d == 2000) {
			// 	expect(traversalResultBefore).toBeNull()
			// } else {
			// 	expect(traversalResultBefore).not.toBeNull()
			// 	log(traversalResultBefore!.toString())
			// 	expect(traversalResultBefore!.index).toBe(d / 2)
			// 	expect(traversalResultBefore!.distance).toBe(d % 2)
			// }

			const traversalResultAfter = list.nodeAfter(d)
			if (d == 2000) {
				expect(traversalResultAfter).toBeNull()
			} else {
				expect(traversalResultAfter).not.toBeNull()
				log(traversalResultAfter!.toString())
				expect(traversalResultAfter!.index).toBe(d / 2 + 1)
				expect(traversalResultAfter!.distance).toBe(2 - d % 2)
			}
		}
		// while (list.size < 1000) {
		// 	list.appendNode(2)
		// }
		// for (let d = 0 as u64; d < (2000 as u64); d++) {
		// 	const traversalResultBefore = list.lastNodeBefore(d)!
		// 	log(d.toString() + traversalResultBefore.toString())
		// 	expect(traversalResultBefore.index).toBe(d / 2)
		// 	expect(traversalResultBefore.distance).toBe(d % 2)
		//
		// 	const traversalResultAfter = list.firstNodeAfter(d)!
		// 	log(d.toString() + traversalResultAfter.toString())
		// 	expect(traversalResultAfter.index).toBe(d / 2 + 1)
		// 	expect(traversalResultAfter.distance).toBe(2 - d % 2)
		// }
		// expect(1).toBe(2)
	})
})