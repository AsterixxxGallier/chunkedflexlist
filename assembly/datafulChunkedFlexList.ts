import {AbstractChunkedFlexList} from "./abstractChunkedFlexList"
import {DatafulChunk} from "./datafulChunk"

/**
 * Superclass for ChunkedFlexList and RangeChunkedFlexList
 */
export abstract class DatafulChunkedFlexList<E, D extends number> extends AbstractChunkedFlexList<D> {
}