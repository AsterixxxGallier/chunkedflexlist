/**
 * Superclass for all ChunkedFlexLists
 */
import {AbstractChunk} from "./abstractChunk"
import {Chunk} from "./chunk"
import {TraversalResult} from "./traversalResult";

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
			let newLast = this.createEmptyChunk()
			// noinspection SuspiciousTypeOfGuard
			if (lastAbove instanceof Chunk)
				(<Chunk<AbstractChunk<D>, D>> lastAbove).appendElementUnchecked(newLast, last.totalLength)
			this.lastChunks[level] = newLast
		}
	}

	traverse(distanceFromStart: D): TraversalResult<D, u64> | null {
		// log("traversing, distanceFromStart: " + distanceFromStart.toString())
		if (this.size == 0)
			return null
		if (distanceFromStart < this.offset)
			return new TraversalResult(0 as u64, this.offset - distanceFromStart as D)
		// log("for real")
		let toGo = distanceFromStart - this.offset as D
		let chunk = this.topChunk!
		let index: u64 = 0
		for (let level = this.depth - 1; level > 0; level--) {
			// log("at level " + level.toString() + " now, index " + index.toString() + ", toGo " + toGo.toString())
			const traversalResult = chunk.traverse(toGo)
			// log(traversalResult.toString())
			const subChunk = (chunk as Chunk<AbstractChunk<D>, D>).getElementAt(traversalResult.index)
			toGo = traversalResult.distance
			index |= traversalResult.index << (AbstractChunk.indexBits * level)
			chunk = subChunk
		}
		const traversalResult = chunk.traverse(toGo)
		return new TraversalResult<D, u64>(index | traversalResult.index, traversalResult.distance)
	}

	abstract createEmptyChunk(): AbstractChunk<D>
}