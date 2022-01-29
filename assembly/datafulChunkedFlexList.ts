import {AbstractChunkedFlexList} from "./abstractChunkedFlexList"
import {DatafulChunk} from "./datafulChunk"

/**
 * Superclass for ChunkedFlexList and RangeChunkedFlexList
 */
export abstract class DatafulChunkedFlexList<E, D extends number> extends AbstractChunkedFlexList<D> {
	appendElement(element: E, distanceFromEnd: D): void {
		if (this.size == 0)
			this.offset = this.offset + distanceFromEnd as D
		this.makeSpace();
		(this.lastChunks[0] as DatafulChunk<E, D>).appendElementUnchecked(element, distanceFromEnd)
		this.size++
	}
}