import _ from "lodash";
import type { Readable } from "stream";
import { nanoid } from "nanoid";

export function generateId(name: string): string {
  return _.kebabCase(name.replace(/&/g,"-and-")) + "-" + nanoid(6);
}


/**
 * Reads a binary stream in memory and store it in a buffer
 * 
 * @param stream The readable stream to read
 * @returns {Buffer}
 */
export async function streamToBuffer(stream: Readable): Promise<Buffer> {
	const chunks: Buffer[] = [];
	for await (const chunk of stream) {
		chunks.push(chunk);
	}

  return Buffer.concat(chunks);
}