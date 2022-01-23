import {AbstractChunk} from "./abstractChunk"
import {DatafulChunkedFlexList} from "./datafulChunkedFlexList";

/**
 * Superclass for Chunk and RangeChunk
 */
export abstract class DatafulChunk<E, D extends number, L extends DatafulChunkedFlexList<E, D>> extends AbstractChunk<D, L> {
	abstract getElementAt(index: u8): E

	abstract setElementAt(index: u8, element: E): void

	/**
	 * Appends an element to this chunk, distanceFromEnd away from the last element.
	 * Internally calls {@link appendNodeUnchecked} after storing the given element using {@link setElementAt}.
	 * @param distanceFromEnd
	 * @param element
	 */
	appendElementUnchecked(element: E, distanceFromEnd: D) {
		this.setElementAt(this.size, element)
		this.appendNodeUnchecked(distanceFromEnd)
	}
}