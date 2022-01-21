import {AbstractChunk} from "./abstractChunk"

/**
 * A single chunk that stores the distance between dataless points instead of list elements.
 */
export class HollowChunk<D extends number> extends AbstractChunk<D> {
	toDebugString(): string {
		let result = "\n"
		const maxNumberOfLinksFromNode = AbstractChunk.indexBits
		const linkLengthPadWidth = 2
		for (let nodeIndex = 0; nodeIndex < AbstractChunk.maxSize; nodeIndex++) {
			let line = ""
			const linkLengths = this.linkLengths[nodeIndex]
			for (let linkDegree = maxNumberOfLinksFromNode - 1 as i32; linkDegree >= 0; linkDegree--) {
				if (linkDegree >= linkLengths.length) {
					line += " ".repeat(linkLengthPadWidth)
				} else {
					const linkLength = linkLengths[linkDegree]
					line += linkLength.toString().padStart(linkLengthPadWidth)
				}
				line += " "
			}
			line += nodeIndex.toString().padStart(i32(Math.ceil(Mathf.log10(AbstractChunk.maxSize - 1 as f32))))
			line += " "
			line += nodeIndex.toString(2).padStart(AbstractChunk.indexBits, '0')
			result += line
			result += "\n"
		}
		return result
	}
}