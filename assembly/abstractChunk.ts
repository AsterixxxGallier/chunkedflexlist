import {LinkIndex} from "./linkIndex"

/**
 * Superclass for all Chunks
 */
export abstract class AbstractChunk<D extends number> {
	static indexBits: i32 = 8
	static maxSize: i32 = 1 << AbstractChunk.indexBits
	static numbersOfLinks: StaticArray<u8> = new StaticArray<u8>(AbstractChunk.maxSize)
	static linkIndexesAbove: StaticArray<Array<LinkIndex>> =
		new StaticArray<Array<LinkIndex>>(AbstractChunk.maxSize)

	@inline
	static calculateNumberOfLinks(index: u8): u8 {
		const trailingZeros = ctz(index)
		const ones = popcnt(index)
		return AbstractChunk.indexBits - trailingZeros > (ones as i32) ? trailingZeros + 1 : trailingZeros
	}

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

	static init(): void {
		for (let i = 0; i < AbstractChunk.maxSize; i++) {
			this.numbersOfLinks[i] = this.calculateNumberOfLinks(i as u8)
			this.linkIndexesAbove[i] = this.calculateLinkIndexesAbove(i as u8)
		}
	}
}