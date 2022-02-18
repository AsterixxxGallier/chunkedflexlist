import {LinkIndex} from "./linkIndex"
import {TraversalResult} from "./traversalResult"
import {AbstractChunkedFlexList} from "./abstractChunkedFlexList"

/**
 * Superclass for all Chunks
 */
export abstract class AbstractChunk<D extends number> {
	// region static stuff
	static isInitialised: boolean = false
	static indexBits: u8 = 8
	static maxSize: i32 = 1 << AbstractChunk.indexBits
	static maxLastIndex: u8 = AbstractChunk.maxSize - 1 as u8
	static numbersOfLinks: StaticArray<u8> = new StaticArray<u8>(AbstractChunk.maxSize)
	static linkIndexesAbove: StaticArray<Array<LinkIndex>> =
		new StaticArray<Array<LinkIndex>>(AbstractChunk.maxSize)

	@inline
	static calculateNumberOfLinks(index: u8): u8 {
		let trailingZeros = ctz(index)
		if (trailingZeros > this.indexBits)
			trailingZeros = this.indexBits
		// const ones = popcnt(index)
		// return AbstractChunk.indexBits - trailingZeros > ones ? trailingZeros + 1 : trailingZeros
		return trailingZeros + 1
	}

	@inline
	static calculateLinkIndexesAbove(nodeIndex: u8): Array<LinkIndex> {
		if (nodeIndex == 0) return new Array<LinkIndex>(0)
		const linkIndexes = new Array<LinkIndex>(this.indexBits as i32)
		let index = nodeIndex
		for (let degree = 0 as u8; degree < this.indexBits; degree++) {
			// if ((1 << degree) + nodeIndex > this.maxSize) {
			// 	linkIndexes.length = degree
			// 	return linkIndexes
			// }
			if (degree == 0) index--
			linkIndexes[degree] = new LinkIndex(index, degree)
			index = index & ~(1 << degree)
		}
		return linkIndexes
	}

	static init(): void {
		if (this.isInitialised)
			return
		for (let i = 0; i < AbstractChunk.maxSize; i++) {
			this.numbersOfLinks[i] = this.calculateNumberOfLinks(i as u8)
			this.linkIndexesAbove[i] = this.calculateLinkIndexesAbove(i as u8)
		}
		this.isInitialised = true
	}

	// endregion

	// region fields
	/**
	 * The distance from zero to the last element/node
	 */
	totalLength: D

	/**
	 * The number of elements/nodes in this chunk
	 */
	size: i32 = 0

	/**
	 * The lengths of the links between elements/nodes, by local index of the from-element and degree
	 */
	linkLengths: StaticArray<StaticArray<D>> = new StaticArray<StaticArray<D>>(AbstractChunk.maxSize)

	/**
	 * The sublist at some index is to be understood as being positioned just before the node at the same index
	 */
	sublists: StaticArray<AbstractChunkedFlexList<D> | null> = new StaticArray(AbstractChunk.maxSize)

	// endregion

	constructor() {
		for (let i = 0; i < this.linkLengths.length; i++) {
			this.linkLengths[i] = new StaticArray(AbstractChunk.numbersOfLinks[i])
		}
	}

	/**
	 * Appends a dataless node to this chunk, distanceFromEnd away from the last element/node.
	 * Does not append an element, only changes the size and link lengths stored in this chunk.
	 * If this chunk is empty, only the size will be changed, and no link lengths will be modified.
	 * @param distanceFromEnd
	 */
	appendNodeUnchecked(distanceFromEnd: D): void {
		if (this.size == 0) {
			this.size = 1
			return
		}
		const linkIndexes = AbstractChunk.linkIndexesAbove[this.size]
		for (let i = 0; i < linkIndexes.length; i++) {
			const linkIndex = linkIndexes[i]
			this.setLinkLengthUncheckedByLinkIndex(linkIndex, this.getLinkLengthUncheckedByLinkIndex(linkIndex) + distanceFromEnd as D)
		}
		this.size++
		this.totalLength = this.totalLength + distanceFromEnd as D
	}

	/**
	 * Systematically traverses this chunk to find the index of the node which is positioned just before the specified position
	 * and additionally returns the distance from the node to the position in a {@link TraversalResult}.
	 * @param position
	 */
	nodeBefore(position: D): TraversalResult<D, u8> | null {
		let distanceTraversed = 0 as D
		let index = 0 as u8
		let degree = AbstractChunk.indexBits - 1
		while (true) {
			const toNextIndex = 1 << degree as u8
			const nextIndex = index + toNextIndex
			if (nextIndex < this.size) {
				const distanceToNext = this.getLinkLengthUnchecked(index, degree)
				const nextDistanceTraversed = distanceTraversed + distanceToNext as D
				if (nextDistanceTraversed > position) {
					return new TraversalResult<D, u8>(index, position - distanceTraversed as D, this)
				}
				distanceTraversed = nextDistanceTraversed
			}
			if (degree == 0) {
				return null
			}
			index = nextIndex
			degree--
		}
	}

	/**
	 * Systematically traverses this chunk to find the index of the node which is positioned just before or at the specified position
	 * and additionally returns the distance from the node to the position in a {@link TraversalResult}.
	 * @param position
	 */
	nodeBeforeOrAt(position: D): TraversalResult<D, u8> | null {
		let distanceTraversed = 0 as D
		let index = 0 as u8
		let degree = AbstractChunk.indexBits - 1
		while (true) {
			const toNextIndex = 1 << degree as u8
			const nextIndex = index + toNextIndex
			if (nextIndex < this.size) {
				const distanceToNext = this.getLinkLengthUnchecked(index, degree)
				const nextDistanceTraversed = distanceTraversed + distanceToNext as D
				if (nextDistanceTraversed > position) {
					return new TraversalResult<D, u8>(index, position - distanceTraversed as D, this)
				} else if (nextDistanceTraversed == position) {
					return new TraversalResult<D, u8>(nextIndex, 0 as D, this)
				}
				distanceTraversed = nextDistanceTraversed
			}
			if (degree == 0) {
				return null
			}
			index = nextIndex
			degree--
		}
	}

	/**
	 * Systematically traverses this chunk to find the index of the node which is positioned at the specified position.
	 * @param position
	 */
	nodeAt(position: D): TraversalResult<D, u8> | null {
		let distanceTraversed = 0 as D
		let index = 0 as u8
		let degree = AbstractChunk.indexBits - 1
		while (true) {
			const toNextIndex = 1 << degree as u8
			const nextIndex = index + toNextIndex
			if (nextIndex < this.size) {
				const distanceToNext = this.getLinkLengthUnchecked(index, degree)
				const nextDistanceTraversed = distanceTraversed + distanceToNext as D
				if (nextDistanceTraversed == position) {
					return new TraversalResult<D, u8>(nextIndex, 0 as D, this)
				}
				distanceTraversed = nextDistanceTraversed
			}
			if (degree == 0) {
				return null
			}
			index = nextIndex
			degree--
		}
	}

	/**
	 * Systematically traverses this chunk to find the index of the node which is positioned just after or at position
	 * and additionally returns the distance from the position to the node in a {@link TraversalResult}.
	 * @param position
	 */
	nodeAfterOrAt(position: D): TraversalResult<D, u8> | null {
		let distanceTraversed = 0 as D
		let index = 0 as u8
		let degree = AbstractChunk.indexBits - 1
		while (true) {
			const toNextIndex = 1 << degree as u8
			const nextIndex = index + toNextIndex
			if (nextIndex < this.size) {
				const distanceToNext = this.getLinkLengthUnchecked(index, degree)
				const nextDistanceTraversed = distanceTraversed + distanceToNext as D
				if (nextDistanceTraversed > position) {
					return new TraversalResult<D, u8>(nextIndex, nextDistanceTraversed - position as D, this)
				} else if (nextDistanceTraversed == position) {
					return new TraversalResult<D, u8>(nextIndex, 0 as D, this)
				}
				distanceTraversed = nextDistanceTraversed
			}
			if (degree == 0) {
				return null
			}
			index = nextIndex
			degree--
		}
	}

	/**
	 * Systematically traverses this chunk to find the index of the node which is positioned just after position
	 * and additionally returns the distance from the position to the node in a {@link TraversalResult}.
	 * @param position
	 */
	nodeAfter(position: D): TraversalResult<D, u8> | null {
		let distanceTraversed = 0 as D
		let index = 0 as u8
		let degree = AbstractChunk.indexBits - 1
		while (true) {
			const toNextIndex = 1 << degree as u8
			const nextIndex = index + toNextIndex
			if (nextIndex < this.size) {
				const distanceToNext = this.getLinkLengthUnchecked(index, degree)
				const nextDistanceTraversed = distanceTraversed + distanceToNext as D
				if (nextDistanceTraversed > position) {
					return new TraversalResult<D, u8>(nextIndex, nextDistanceTraversed - position as D, this)
				}
				distanceTraversed = nextDistanceTraversed
			}
			if (degree == 0) {
				return null
			}
			index = nextIndex
			degree--
		}
	}

	/**
	 * Systematically traverses this chunk to find the index of the node which is positioned just before or at the specified position
	 * and additionally returns the "overshoot" distance in a {@link TraversalResult}.
	 * @param position
	 */
	lastNodeBefore(position: D): TraversalResult<D, u8> {
		let toGo = position
		let index: u8 = 0
		for (let degree = AbstractChunk.indexBits - 1; degree < 255; degree--) {
			const toNext = this.getLinkLengthUnchecked(index, degree as u8)
			if (toGo >= toNext) {
				let toNextIndex = 1 << degree as u8
				if ((index + toNextIndex as i32) >= this.size) {
					continue
				}
				toGo = toGo - toNext as D
				index += toNextIndex
			}
		}
		return new TraversalResult(index, toGo, this)
	}

	getSublistBefore(nodeIndex: u8): AbstractChunkedFlexList<D> | null {
		return this.sublists[nodeIndex]
	}

	// region link length accessors
	@inline
	getLinkLengthUncheckedByLinkIndex(localIndex: LinkIndex): D {
		return this.getLinkLengthUnchecked(localIndex.nodeIndex, localIndex.degree)
	}

	@inline
	setLinkLengthUncheckedByLinkIndex(localIndex: LinkIndex, value: D): void {
		this.setLinkLengthUnchecked(localIndex.nodeIndex, localIndex.degree, value)
	}

	/**
	 * Gets the length of the link starting at `index` of degree `degree`
	 */
	@inline
	getLinkLengthUnchecked(index: u8, degree: u8): D {
		return this.linkLengths[index][degree]
	}

	/**
	 * Sets the length of the link starting at `index` of degree `degree` to `length`
	 */
	@inline
	setLinkLengthUnchecked(index: u8, degree: u8, length: D): void {
		this.linkLengths[index][degree] = length
	}

	// endregion

	// region abstract methods
	/**
	 * Returns a human-readable string representation of this chunk
	 */
	abstract toDebugString(): string

	// endregion
}