import {AbstractChunk} from "./abstractChunk"

/**
 * Superclass for Chunk and RangeChunk
 */
export abstract class DatafulChunk<E, D extends number> extends AbstractChunk<D> {
	abstract getElementAt(index: u8): E

	abstract setElementAt(index: u8, element: E): void

	/**
	 * Appends an element to this chunk, distanceFromEnd away from the last element.
	 * Internally calls {@link appendNodeUnchecked} after storing the given element using {@link setElementAt}.
	 * @param distanceFromEnd
	 * @param element
	 */
	appendElementUnchecked(element: E, distanceFromEnd: D): void {
		this.setElementAt(this.size, element)
		this.appendNodeUnchecked(distanceFromEnd)
	}
}