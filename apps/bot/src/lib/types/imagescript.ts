export interface ImagescriptOutput {
	image?: Buffer;
	format?: ImagescriptFormat;
}

export enum ImagescriptFormat {
	PNG = "png",
	GIF = "gif",
}
