import {AbstractChunkedFlexList} from "./abstractChunkedFlexList"
import {HollowChunk} from "./hollowChunk"

/**
 * A data structure that stores the distances between dataless points instead of list elements.
 */
export class HollowChunkedFlexList<D extends number> extends AbstractChunkedFlexList<D, HollowChunk<D>> {

}