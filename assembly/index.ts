import {AbstractChunk} from "./abstractChunk"
import "wasi"

export function init(): void {
	console.log("INITIALISING")
	AbstractChunk.init()
}