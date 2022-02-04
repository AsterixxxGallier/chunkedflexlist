import {AbstractChunk} from "./abstractChunk"

export class TraversalResult<D extends number, I extends number> {
	index: I
	/**
	 * The distance that was already traversed from this node; always smaller than the full distance to the next node in this {@link Chunk}
	 */
	distance: D
	chunk: AbstractChunk<D>

	constructor(index: I, distance: D, chunk: AbstractChunk<D>) {
		this.index = index
		this.distance = distance
		this.chunk = chunk
	}

	toString(): string {
		return `[traversal result: node ${this.index.toString(2).padStart(AbstractChunk.indexBits, '0')} distance ${this.distance}]`
	}
}