export interface MDNResponse {
	color: string;
	title: string;
	url: string;
	author: MDNResponseAuthor;
	description: string;
}

export interface MDNResponseAuthor {
	name: string;
	icon_url: string;
	url: string;
}
