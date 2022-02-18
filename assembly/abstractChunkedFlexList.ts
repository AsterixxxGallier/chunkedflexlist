/**
 * Superclass for all ChunkedFlexLists
 */
import {AbstractChunk} from "./abstractChunk"
import {Chunk} from "./chunk"
import {TraversalResult} from "./traversalResult"

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
	firstChunk: AbstractChunk<D> | null = null
	size: u64 = 0
	totalLength: D

	/**
	 * Creates an empty ChunkedFlexList
	 * @param offset see {@link ChunkedFlexList.offset}
	 */
	constructor(offset: D = 0 as D) {
		this.offset = offset
		this.totalLength = offset
	}

	// /**
	//  * The distance from 0 to the last node
	//  */
	// get totalLength(): D {
	// 	let chunk = this.topChunk
	// 	if (this.topChunk == null)
	// 		return this.offset
	// 	for (let level = 0; level <; level++) {
	// 		chunk!.
	// 	}
	// }

	getChunkAt(index: u64): AbstractChunk<D> | null {
		let currentChunk = this.topChunk
		if (currentChunk == null) return null
		for (let level = this.depth - 1; level > 0; level--) {
			// noinspection SuspiciousTypeOfGuard
			if (currentChunk instanceof Chunk)
				currentChunk = (currentChunk as Chunk<AbstractChunk<D>, D>).getElementAt((index >> (level * AbstractChunk.indexBits)) as u8)
		}
		return currentChunk
	}

	getChunksAt(index: u64): Array<AbstractChunk<D>> {
		let currentChunk = this.topChunk
		if (currentChunk == null) return []
		let chunks = [currentChunk!]
		for (let level = this.depth - 1; level > 0; level--) {
			// noinspection SuspiciousTypeOfGuard
			if (currentChunk instanceof Chunk)
				currentChunk = (currentChunk as Chunk<AbstractChunk<D>, D>).getElementAt((index >> (level * AbstractChunk.indexBits)) as u8)
			chunks.unshift(currentChunk)
		}
		return chunks
	}

	/**
	 * Gets the length of the link of degree 0 starting at `index` at level `level`, returns 0 if link length could not be found
	 */
	getLinkLength(index: u64, level: u8 = 0): D {
		if (level == this.depth) return 0 as D
		const chunks = this.getChunksAt(index)
		// for (; level < this.depth; level++) {
		const localIndex = (index & (0xFF << (level * AbstractChunk.indexBits)) >> (level * AbstractChunk.indexBits)) as u8
		if (~localIndex) {
			return chunks[level].getLinkLengthUnchecked(localIndex, 0)
		} else {
			// return the link length one level above minus the total length of this chunk
			return this.getLinkLength(index, level + 1) - chunks[level].totalLength as D
		}
		// }
		// return null
	}

	/**
	 * Sets the length of the link of degree 0 starting at `index` to `length`
	 */
	setLinkLengthUnchecked(index: u64, length: D): void {
		throw new Error("not yet implemented")
	}

	appendNode(distanceFromEnd: D): void {
		this.makeSpace(0, distanceFromEnd)
		if (this.size == 0) {
			this.offset = this.offset + distanceFromEnd as D
			this.firstChunk = this.topChunk
		}
		this.lastChunks[0].appendNodeUnchecked(distanceFromEnd)
		this.size++
		this.totalLength = this.totalLength + distanceFromEnd as D
	}

	makeSpace(level: u8 = 0, distanceFromEnd: D = 0 as D): void {
		if (this.size == 0) {
			const chunk = this.createEmptyChunk()
			this.topChunk = chunk
			this.lastChunks[0] = chunk
			this.depth = 1
			return
		}
		if (level == this.depth) {
			const oldTop = this.topChunk
			const newTop = new Chunk<AbstractChunk<D>, D>()
			if (oldTop != null)
				newTop.appendElementUnchecked(oldTop, 0 as D)
			this.topChunk = newTop
			this.lastChunks[level] = newTop
			this.depth = level + 1
			return
		}
		const last = this.lastChunks[level]
		if (last.size == AbstractChunk.maxSize) {
			this.makeSpace(level + 1)
			const lastAbove = this.lastChunks[level + 1]
			const newLast = this.createEmptyChunk()
			// noinspection SuspiciousTypeOfGuard
			if (lastAbove instanceof Chunk)
				(lastAbove as Chunk<AbstractChunk<D>, D>).appendElementUnchecked(newLast, last.totalLength + distanceFromEnd as D)
			this.lastChunks[level] = newLast
		}
	}

	/**
	 * Systematically traverses this list to find the index of the node which is positioned just before the specified position
	 * and additionally returns the distance from the node to the position in a {@link TraversalResult}.
	 * @param position
	 */
	nodeBefore(position: D): TraversalResult<D, u64> | null {
		if (this.size == 0)
			return null
		if (position > this.totalLength)
			return new TraversalResult<D, u64>(this.size - 1 as u64, position - this.totalLength as D)
		let distanceTraversed = 0 as D
		let index = 0 as u64
		let degree = this.depth * AbstractChunk.indexBits - 1 as u8
		let level = this.depth - 1 as u8
		let levelDegree = level * AbstractChunk.indexBits as u64
		let chunk = this.topChunk!
		while (true) {
			const toNextIndex = 1 << degree as u64
			const nextIndex = index + toNextIndex
			if (nextIndex < this.size) {
				const localIndex = (index & (0xFF << levelDegree) >> levelDegree) as u8
				const localDegree = degree % AbstractChunk.indexBits
				const distanceToNext = chunk.getLinkLengthUnchecked(localIndex, localDegree)
				const nextDistanceTraversed = distanceTraversed + distanceToNext as D
				if (nextDistanceTraversed > position) {
					return new TraversalResult<D, u64>(index, position - distanceTraversed as D)
				}
				if (nextDistanceTraversed < position) {
					distanceTraversed = nextDistanceTraversed
					index = nextIndex
				}
			}
			if (degree == 0) {
				return null
			}
			if (degree % AbstractChunk.indexBits == 0) {
				level--
				levelDegree = levelDegree - AbstractChunk.indexBits
				// noinspection SuspiciousTypeOfGuard
				if (chunk instanceof Chunk) {
					chunk = (chunk as Chunk<AbstractChunk<D>, D>).getElementAt((index & (0xFF << levelDegree) >> levelDegree) as u8)
				}
			}
			degree--
		}
	}

	/**
	 * Systematically traverses this list to find the index of the node which is positioned at the specified position.
	 * @param position
	 */
	nodeAt(position: D): TraversalResult<D, u64> | null {
		if (this.size == 0)
			return null
		if (position == this.offset)
			return new TraversalResult<D, u64>(0 as u64, 0 as D)
		let distanceTraversed = 0 as D
		let index = 0 as u64
		let degree = this.depth * AbstractChunk.indexBits - 1 as u8
		let level = this.depth - 1 as u8
		let levelDegree = level * AbstractChunk.indexBits as u64
		let chunk = this.topChunk!
		while (true) {
			const toNextIndex = 1 << degree as u64
			const nextIndex = index + toNextIndex
			if (nextIndex < this.size) {
				const localIndex = (index & (0xFF << levelDegree) >> levelDegree) as u8
				const localDegree = degree % AbstractChunk.indexBits
				const distanceToNext = chunk.getLinkLengthUnchecked(localIndex, localDegree)
				const nextDistanceTraversed = distanceTraversed + distanceToNext as D
				if (nextDistanceTraversed == position) {
					return new TraversalResult<D, u64>(nextIndex, 0 as D)
				}
				if (nextDistanceTraversed < position) {
					distanceTraversed = nextDistanceTraversed
					index = nextIndex
				}
			}
			if (degree == 0) {
				return null
			}
			if (degree % AbstractChunk.indexBits == 0) {
				level--
				levelDegree = levelDegree - AbstractChunk.indexBits
				// noinspection SuspiciousTypeOfGuard
				if (chunk instanceof Chunk) {
					chunk = (chunk as Chunk<AbstractChunk<D>, D>).getElementAt((index & (0xFF << levelDegree) >> levelDegree) as u8)
				}
			}
			degree--
		}
	}

	/**
	 * Systematically traverses this list to find the index of the node which is positioned just after position
	 * and additionally returns the distance from the position to the node in a {@link TraversalResult}.
	 * @param position
	 */
	nodeAfter(position: D): TraversalResult<D, u64> | null {
		if (this.size == 0 || position >= this.totalLength)
			return null

		let currentPosition = this.totalLength
		let degree = this.depth * AbstractChunk.indexBits - 1 as u8
		let level = this.depth - 1 as u8
		let levelDegree = level * AbstractChunk.indexBits as u64
		let currentIndex = 1 << (degree + 1) as u64
		let chunk = this.topChunk!

		while (true) {
			// log(degree)
			const toPreviousIndex = 1 << degree as u64
			const previousIndex = currentIndex - toPreviousIndex
			// TODO add if statement maybe? dunno
			{
				// TODO get distanceToPrevious somehow
				const localCurrentIndex = (currentIndex & (0xFF << levelDegree) >> levelDegree) as u8
				const localPreviousIndex = (previousIndex & (0xFF << levelDegree) >> levelDegree) as u8
				if ((localPreviousIndex as i32) < chunk.size) {
					// log(localCurrentIndex)
					// log(localPreviousIndex)
					const localDegree = degree % AbstractChunk.indexBits
					log(`${degree.toString()} (${levelDegree.toString()} + ${localDegree.toString()}); `
						+ `current: ${currentIndex.toString()} (${localCurrentIndex.toString()}); previous: ${previousIndex.toString()} (${localPreviousIndex.toString()})`)
					// log(localDegree)
					// if (localDegree < AbstractChunk.numbersOfLinks[localPreviousIndex]) {
						log("no oob error")
						const distanceToPrevious = chunk.getLinkLengthUnchecked(localPreviousIndex, localDegree)
						const previousPosition = currentPosition - distanceToPrevious as D
						if (previousPosition < position) {
							return new TraversalResult<D, u64>(currentIndex, currentPosition - position as D)
						}
						if (previousPosition < position) {
							currentPosition = previousPosition
							currentIndex = previousIndex
						}
					// }
				}
			}
			if (degree == 0) {
				return null
			}
			if (degree % AbstractChunk.indexBits == 0) {
				level--
				levelDegree = levelDegree - AbstractChunk.indexBits
				// noinspection SuspiciousTypeOfGuard
				if (chunk instanceof Chunk) {
					chunk = (chunk as Chunk<AbstractChunk<D>, D>).getElementAt((currentIndex & (0xFF << levelDegree) >> levelDegree) as u8)
				}
			}
			degree--
		}

		/*// TODO GO BACKWARDS
		log(`looking for first node after ${position.toString()}, totalLength: ${this.totalLength.toString()}`)
		if (this.size == 0)
			return null
		if (position < this.offset)
			return new TraversalResult<D, u64>(0 as u64, this.offset - position as D)
		// the distance traversed backwards, starting from this.totalLength
		let distanceTraversed = 0 as D
		let degree = this.depth * AbstractChunk.indexBits - 1 as u8
		let level = this.depth - 1 as u8
		let levelDegree = level * AbstractChunk.indexBits as u64
		let index = 1 << (degree + 1) as u64
		let chunk = this.topChunk!
		while (true) {
			log(`degree: ${degree}`)
			const toNextIndex = 1 << degree as u64
			const nextIndex = index - toNextIndex
			log(`index: ${index.toString()}, nextIndex: ${nextIndex.toString()}, size: ${this.size.toString()}`)
			// TODO optimize these methods so that it starts at a degree which makes nextIndex start at just over this.size
			// if (nextIndex < this.size) {
			if (true) {
				const localIndex = (index & (0xFF << levelDegree) >> levelDegree) as u8
				const localDegree = degree % AbstractChunk.indexBits
				log(`localIndex: ${localIndex.toString()}, localDegree: ${localDegree.toString()}`)
				const distanceToPrevious = chunk.getLinkLengthUnchecked(localIndex, localDegree)
				const nextDistanceTraversed = distanceTraversed + distanceToPrevious as D
				log(`dist: ${distanceTraversed.toString()}, nextDist: ${nextDistanceTraversed.toString()}, pos: ${position.toString()}`)
				log(`dist: ${(this.totalLength - distanceTraversed).toString()}, nextDist: ${(this.totalLength - nextDistanceTraversed).toString()}, pos: ${position.toString()}`)



				/!*if (nextDistanceTraversed > position &&
					(degree == 0 ||
						(distanceTraversed + chunk.getLinkLengthUnchecked(localIndex, localDegree - 1) as D) <= position)) {
					return new TraversalResult<D, u64>(nextIndex, nextDistanceTraversed - position as D)
				}*!/

				if ((this.totalLength as i64 - (nextDistanceTraversed as i64)) > (position as i64)) {
					log("going backwards")
					distanceTraversed = nextDistanceTraversed
					index = nextIndex
				}
			}
			if (degree == 0) {
				return null
			}
			if (degree % AbstractChunk.indexBits == 0) {
				level--
				levelDegree = levelDegree - AbstractChunk.indexBits
				// noinspection SuspiciousTypeOfGuard
				if (chunk instanceof Chunk) {
					chunk = (chunk as Chunk<AbstractChunk<D>, D>).getElementAt((index & (0xFF << levelDegree) >> levelDegree) as u8)
				}
			}
			degree--
		}*/
	}

	/**
	 * Systematically traverses this list to find the index of the node which is positioned just before or at the specified position
	 * and additionally returns the "overshoot" distance in a {@link TraversalResult}.
	 * @param position
	 */
	lastNodeBefore(position: D): TraversalResult<D, u64> | null {
		if (this.size == 0 || position < this.offset)
			return null
		let toGo = position - this.offset as D
		let chunk = this.topChunk!
		let index: u64 = 0
		for (let level = this.depth - 1; level > 0; level--) {
			const traversalResult = chunk.lastNodeBefore(toGo)
			const subChunk = (chunk as Chunk<AbstractChunk<D>, D>).getElementAt(traversalResult.index)
			toGo = traversalResult.distance
			index |= (traversalResult.index as u64) << (AbstractChunk.indexBits * level)
			chunk = subChunk
		}
		const traversalResult = chunk.lastNodeBefore(toGo)
		return new TraversalResult<D, u64>(index | traversalResult.index, traversalResult.distance, chunk)
	}

	/**
	 * Systematically traverses this list to find the index of the node which is positioned just after position
	 * and additionally returns the distance from the node to the position in a {@link TraversalResult}.
	 * @param position
	 */
	firstNodeAfter(position: D): TraversalResult<D, u64> | null {
		if (position > this.totalLength || this.size == 0)
			return null
		if (position < this.offset)
			return new TraversalResult<D, u64>(0, this.offset - position as D, this.firstChunk!)
		let lastNodeBefore = this.lastNodeBefore(position)!
		let nextIndex = lastNodeBefore.index + 1
		// if (nextIndex & 0xFF) {
		// 	const chunk = lastNodeBefore.chunk
		// 	return new TraversalResult<D, u64>(nextIndex, chunk.getLinkLengthUnchecked(lastNodeBefore.index, 0) - lastNodeBefore.distance as D, chunk)
		// }
		// let chunk = nextIndex & 0xFF ? lastNodeBefore.chunk : this.getChunkAt(nextIndex)!
		return new TraversalResult<D, u64>(nextIndex, this.getLinkLength(lastNodeBefore.index) - lastNodeBefore.distance as D)
	}

	getSublistBefore(nodeIndex: u64): AbstractChunkedFlexList<D> | null {
		const chunk = this.getChunkAt(nodeIndex)
		if (chunk == null)
			return null
		return chunk!.getSublistBefore((nodeIndex & 0xFF) as u8)
	}

	abstract createEmptyChunk(): AbstractChunk<D>
}