/**
 * Superclass for all ChunkedFlexLists
 */
import {AbstractChunk} from "./abstractChunk"

export abstract class AbstractChunkedFlexList<D extends number, C extends AbstractChunk<D>> {
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