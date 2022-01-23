import {DatafulChunk} from "./datafulChunk"
import {AbstractChunk} from "./abstractChunk";

/**
 * A dataful chunk in which two nodes form a single element.
 * One element of a RangeChunk is not positioned as a single node, but as a range between two nodes.
 * This means that only 128 elements can be stored in RangeChunks.
 */
export class RangeChunk<E, D extends number> extends DatafulChunk<E, D> {
	/**
	 * The elements that this {@link Chunk} contains
	 */
	elements: StaticArray<E> = new StaticArray<E>(AbstractChunk.maxSize / 2)

	getElementAt(index: u8): E {
		return this.elements[index >> 1];
	}

	setElementAt(index: u8, element: E): void {
		this.elements[index >> 1] = element
	}

	toDebugString(): string {
		return "RangeChunk.toDebugString() is not yet implemented";
	}
}