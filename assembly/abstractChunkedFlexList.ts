/**
 * Superclass for all ChunkedFlexLists
 */
import {AbstractChunk} from "./abstractChunk"
import {Chunk} from "./chunk"

export abstract class AbstractChunkedFlexList<D extends number> {
	/**
	 * Offsets all elements (distance between zero and the first element)
	 */
	offset: D

	topChunk: AbstractChunk<D> | null = null
	depth: u8 = 0
	/**
	 * The last chunk of each level, where the index corresponds to the chunk level
	 */
	lastChunks: Array<AbstractChunk<D>> = []
	size: u64 = 0

	/**
	 * Creates an empty ChunkedFlexList
	 * @param offset see {@link ChunkedFlexList.offset}
	 */
	constructor(offset: D = 0 as D) {
		this.offset = offset
	}

	appendNode(distanceFromEnd: D): void {
		if (this.size == 0)
			this.offset = this.offset + distanceFromEnd as D
		this.makeSpace()
		this.lastChunks[0].appendNodeUnchecked(distanceFromEnd)
		this.size++
	}

	makeSpace(level: u8 = 0): void {
		if (level == this.depth) {
			const oldTop = this.topChunk
			const newTop = new Chunk<AbstractChunk<D>, D>()
			if (oldTop != null)
				newTop.appendElementUnchecked(oldTop, 0 as D)
			this.topChunk = newTop
			this.lastChunks[level] = newTop
			this.depth++
			return
		}
		const last = this.lastChunks[level]
		if (last.size == AbstractChunk.maxSize) {
			this.makeSpace(level + 1)
			const lastAbove = this.lastChunks[level + 1]
			let newLast = this.createEmptyChunk();
			(lastAbove as Chunk<AbstractChunk<D>, D>).appendElementUnchecked(newLast, last.totalLength)
			this.lastChunks[level] = newLast
		}
	}

	abstract createEmptyChunk(): AbstractChunk<D>
}