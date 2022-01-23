import {AbstractChunk} from "./abstractChunk"

/**
 * Superclass for Chunk and RangeChunk
 */
export abstract class DatafulChunk<E, D extends number> extends AbstractChunk<D> {
	abstract getElementAt(index: u8): E
}