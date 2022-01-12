import {DatafulChunkedFlexList} from "./datafulChunkedFlexList"
import {Chunk} from "./chunk"

/**
 * A list-like data structure that stores the distance between its elements.
 * - Separates data into nested chunks of 256 elements/chunks each.
 * - Each chunk is allocated at once, so for 256 elements only one allocation is needed.
 * - Has a structure akin to binary trees which allows for very fast traversal (O(log₂ n)).
 * - Doesn't store absolute position of elements so moving them (changing their position, not their index) is very fast and O(1).
 * - Very fast and O(1) addition of new elements, although every 256th addition will necessitate the allocation of a new chunk.
 * - Splicing elements into the list does not move the other elements in any way and is O(log₂ n), but makes the structure slightly less efficient
 *   because it inserts a sublist between two indices.
 * - Every element will stay at the same index for the lifetime of the list.
 * - Because of sublists, references to elements should be stored as a chain of indices.
 * - Stores reference to last chunk for speed.
 * - Stores positional offset for the whole list that offsets all elements.
 * - E is the type of data to be stored, D is the number type to be used for storing distances between elements and the list offset.
 */
export class ChunkedFlexList<E, D extends number> extends DatafulChunkedFlexList<E, D, Chunk<E, D>> {
	constructor(offset: D = 0 as D) {
		super(offset)
	}
}