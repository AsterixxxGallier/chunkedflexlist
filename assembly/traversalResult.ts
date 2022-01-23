import {AbstractChunk} from "./abstractChunk";

export class TraversalResult<D extends number> {
	index: i32
	/**
	 * The distance that was already traversed from this node; always smaller than the full distance to the next node in this {@link Chunk}
	 */
	distance: D

	constructor(index: i32, distance: D) {
		this.index = index
		this.distance = distance
	}

	toString(): string {
		return `[traversal result: node ${this.index.toString(2).padStart(AbstractChunk.indexBits, '0')} distance ${this.distance}]`
	}
}