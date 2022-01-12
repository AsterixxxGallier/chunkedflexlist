/**
 * Stores the "index" of a link, determined by the index of the node the link starts from and the degree of that link.
 */
import {AbstractChunk} from "./abstractChunk"

export class LinkIndex {
	nodeIndex: u8
	degree: u8

	constructor(nodeIndex: u8, degree: u8) {
		this.nodeIndex = nodeIndex
		this.degree = degree
	}

	toString(): string {
		return `[node ${this.nodeIndex.toString(2).padStart(AbstractChunk.indexBits, '0')} degree ${this.degree}]`
	}
}