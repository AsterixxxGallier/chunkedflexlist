import {DatafulChunk} from "./datafulChunk"
import {AbstractChunk} from "./abstractChunk"
import {ChunkedFlexList} from "./chunkedFlexList";

/**
 * A single chunk that stores elements (not other chunks) and the distance between them.
 */
export class Chunk<E, D extends number> extends DatafulChunk<E, D, ChunkedFlexList<E, D>> {
	/**
	 * The elements that this {@link Chunk} contains
	 */
	elements: StaticArray<E> = new StaticArray<E>(AbstractChunk.maxSize)

	getElementAt(index: u8): E {
		return this.elements[index];
	}

	setElementAt(index: u8, element: E): void {
		this.elements[index] = element
	}

	/**
	 * The local index of the last stored element
	 */
	@inline
	get lastIndex(): u8 {
		return this.size - 1
	}

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
			line += nodeIndex.toString().padStart(i32(Math.ceil(Mathf.log10(AbstractChunk.maxLastIndex as f32))))
			line += " "
			line += nodeIndex.toString(2).padStart(AbstractChunk.indexBits, '0')
			line += " "
			if (nodeIndex >= this.size) {
				line += "/"
			} else {
				const element = this.elements[nodeIndex]
				// @ts-ignore
				if (isDefined(element.toString)) {
					// @ts-ignore
					line += element.toString()
				} else {
					line += "[no string representation available]"
				}
			}
			result += line
			result += "\n"
		}
		return result
	}
}