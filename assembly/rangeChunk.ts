import {DatafulChunk} from "./datafulChunk"
import {AbstractChunk} from "./abstractChunk";

export class RangeChunk<E, D extends number> extends DatafulChunk<E, D> {
	/**
	 * The elements that this {@link Chunk} contains
	 */
	elements: StaticArray<E> = new StaticArray<E>(AbstractChunk.maxSize / 2)

	getElementAt(index: u8): E {
		return this.elements[index >> 1];
	}

	toDebugString(): string {
		return "RangeChunk.toDebugString() is not yet implemented";
	}
}