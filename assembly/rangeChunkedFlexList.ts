import {DatafulChunkedFlexList} from "./datafulChunkedFlexList"
import {RangeChunk} from "./rangeChunk"

export class RangeChunkedFlexList<E, D extends number> extends DatafulChunkedFlexList<E, D> {
	createEmptyChunk(): RangeChunk<E, D> {
		return new RangeChunk<E, D>()
	}
}