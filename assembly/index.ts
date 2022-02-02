import {AbstractChunk} from "./abstractChunk"
import { console } from "as-console"

export function init(log: boolean = true): void {
	if (log) console.log("Initialising chunkedflexlist library")
	AbstractChunk.init()
}