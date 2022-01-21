import {LinkIndex} from "./linkIndex"

/**
 * Superclass for all Chunks
 */
export abstract class AbstractChunk<D extends number> {
	// region static stuff
	static isInitialised: boolean = false
	static indexBits: u8 = 8
	static maxSize: i32 = 1 << AbstractChunk.indexBits
	static numbersOfLinks: StaticArray<u8> = new StaticArray<u8>(AbstractChunk.maxSize)
	static linkIndexesAbove: StaticArray<Array<LinkIndex>> =
		new StaticArray<Array<LinkIndex>>(AbstractChunk.maxSize)

	@inline
	static calculateNumberOfLinks(index: u8): u8 {
		let trailingZeros = ctz(index)
		if (trailingZeros > this.indexBits)
			trailingZeros = this.indexBits
		const ones = popcnt(index)
		return AbstractChunk.indexBits - trailingZeros > ones ? trailingZeros + 1 : trailingZeros
	}

	@inline
	static calculateLinkIndexesAbove(nodeIndex: u8): Array<LinkIndex> {
		if (nodeIndex == 0) return new Array<LinkIndex>(0)
		const linkIndexes = new Array<LinkIndex>(this.indexBits as i32)
		let index = nodeIndex
		for (let degree = 0 as u8; degree < this.indexBits; degree++) {
			if ((1 << degree) + nodeIndex > this.maxSize) {
				linkIndexes.length = degree
				return linkIndexes
			}
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
	 * The distance from zero to the last element/point
	 */
	totalLength: D

	/**
	 * The number of elements/points in this chunk
	 */
	size: u8 = 0

	/**
	 * The lengths of the links between elements/points, by local index of the from-element and degree
	 */
	linkLengths: StaticArray<StaticArray<D>> = new StaticArray<StaticArray<D>>(AbstractChunk.maxSize)
	// endregion

	constructor() {
		for (let i = 0; i < this.linkLengths.length; i++) {
			this.linkLengths[i] = new StaticArray(AbstractChunk.numbersOfLinks[i])
		}
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
	 * @param index the local index of node a
	 * @param degree the degree of the link
	 */
	@inline
	getLinkLengthUnchecked(index: i32, degree: u8): D {
		return this.linkLengths[index][degree]
	}

	/**
	 * Sets the length of the link starting at `index` of degree `degree` to `length`
	 * @param index the local index of node a
	 * @param degree the degree of the link
	 * @param length the new length of the link
	 */
	@inline
	setLinkLengthUnchecked(index: i32, degree: u8, length: D): void {
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