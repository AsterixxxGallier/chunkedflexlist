/**
 * Superclass for all ChunkedFlexLists
 */
abstract class AbstractChunkedFlexList<D extends number, C extends AbstractChunk<D>> {
	/**
	 * Offsets all elements (distance between zero and the first element)
	 */
	offset: D

	/**
	 * Creates an empty ChunkedFlexList
	 * @param offset see {@link ChunkedFlexList.offset}
	 */
	protected constructor(offset: D) {
		this.offset = offset
	}
}

/**
 * Superclass for ChunkedFlexList and RangeChunkedFlexList
 */
abstract class DatafulChunkedFlexList<E, D extends number, C extends DatafulChunk<E, D>> {
	/**
	 * Offsets all elements (distance between zero and the first element)
	 */
	offset: D

	/**
	 * Creates an empty ChunkedFlexList
	 * @param offset see {@link ChunkedFlexList.offset}
	 */
	protected constructor(offset: D) {
		this.offset = offset
	}
}

/**
 * A list-like data structure that stores the distance between its elements.
 * - Separates data into nested chunks of 256 elements/chunks each.
 * - Each chunk is allocated at once, so for 256 elements only one allocation is needed.
 * - Has a structure akin to binary trees which allows for very fast traversal (O(log₂ n)).
 * - Doesn't store absolute position of elements so moving them (changing their position, not their index) is very fast and O(1).
 * - Very fast and O(1) addition of new elements, although every 256th addition will necessitate the allocation of a new chunk.
 * - Splicing elements into the list does not move the other elements in any way and is O(log₂ n), but makes the structure slightly less efficient
 *   because it inserts a sublist between two indices.
 * - Every element will stay at the same index for the lifetime of the list.
 * - Because of sublists, references to elements should be stored as a chain of indices.
 * - Stores reference to last chunk for speed.
 * - Stores positional offset for the whole list that offsets all elements.
 * - E is the type of data to be stored, D is the number type to be used for storing distances between elements and the list offset.
 */
class ChunkedFlexList<E, D extends number> extends DatafulChunkedFlexList<E, D, Chunk<E, D>> {
	constructor(offset: D = 0 as D) {
		super(offset)
	}
}

/**
 * Stores the "index" of a link, determined by the index of the node the link starts from and the degree of that link.
 */
class LinkIndex {
	nodeIndex: u8
	degree: u8

	constructor(nodeIndex: u8, degree: u8) {
		this.nodeIndex = nodeIndex
		this.degree = degree
	}

	toString(): string {
		return `[node ${this.nodeIndex.toString(2).padStart(AbstractChunk.indexBits, '0')} degree ${this.degree}]`
	}
}

abstract class AbstractChunk<D extends number> {
	static indexBits: i32 = 8
	static maxSize: i32 = 1 << AbstractChunk.indexBits
	static numbersOfLinks: StaticArray<u8> = new StaticArray<u8>(AbstractChunk.maxSize)
	static linkIndexesAbove: StaticArray<Array<LinkIndex>> =
		new StaticArray<Array<LinkIndex>>(AbstractChunk.maxSize)

	@inline
	static calculateLinkIndexesAbove(nodeIndex: u8): Array<LinkIndex> {
		if (nodeIndex == 0) return new Array<LinkIndex>(0)
		const linkIndexes = new Array<LinkIndex>(this.indexBits as i32)
		let index = nodeIndex
		for (let degree = 0 as u8; degree < (this.indexBits as u8); degree++) {
			if ((nodeIndex as i32) + (1 << degree) > this.maxSize) {
				linkIndexes.length = degree
				return linkIndexes
			}
			if (degree == 0) index--
			linkIndexes[degree] = new LinkIndex(index, degree)
			index = index & ~(1 << degree)
		}
		return linkIndexes
	}

	@inline
	static calculateNumberOfLinks(index: u8): u8 {
		const trailingZeros = ctz(index)
		const ones = popcnt(index)
		return AbstractChunk.indexBits - trailingZeros > (ones as i32) ? trailingZeros + 1 : trailingZeros
	}

	static init(): void {
		for (let i = 0; i < AbstractChunk.maxSize; i++) {
			this.numbersOfLinks[i] = this.calculateNumberOfLinks(i as u8)
			this.linkIndexesAbove[i] = this.calculateLinkIndexesAbove(i as u8)
		}
	}
}

/**
 * Superclass for Chunk and RangeChunk
 */
abstract class DatafulChunk<E, D extends number> extends AbstractChunk<D> {

}

/**
 * A single chunk that stores elements (not other chunks) and the distance between them.
 */
class Chunk<E, D extends number> extends DatafulChunk<E, D> {

}
