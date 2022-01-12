import {AbstractChunkedFlexList} from "./abstractChunkedFlexList"
import {DatafulChunk} from "./datafulChunk"

/**
 * Superclass for ChunkedFlexList and RangeChunkedFlexList
 */
export abstract class DatafulChunkedFlexList<E, D extends number, C extends DatafulChunk<E, D>> extends AbstractChunkedFlexList<D, DatafulChunk<E, D>> {
}