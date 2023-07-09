import axios from 'axios';
import https from 'https';

interface Post {
	id: string;
	url: string;
	ext: string;
}

interface E621PostResponse {
	id: string;
	file: {
		url: string;
		ext: string;
	}
}

const client = axios.create({
	baseURL: 'https://e621.net',
	httpsAgent: new https.Agent({ keepAlive: true }),
	timeout: 25000,
	headers: {
		'User-Agent': '@zwerl/discord (DownloadableFox)',
		'Content-Type': 'application/json',
	},
});

export const getRandomPost = async (): Promise<Post> => {
	const { data } = await client.get('/posts/random.json');

	return { 
		id: data.post.id,
		url: data.post.file.url,
		ext: data.post.file.ext
	};
};

export const searchPosts = async (tags: string, limit = 10, page = 1): Promise<Post[] | null> => {
	const { data } = await client.get(
		'/posts.json', 
		{ params: { tags, limit, page } }
	);

	if (data.posts.length === 0) return null;
	
	// Array of posts with [id, url] format
	const posts = data.posts.map((post: E621PostResponse) => ({
		id: post.id,
		url: post.file.url,
		ext: post.file.ext
	})) as Post[];

	return posts.filter(post => post.url !== null);
};

export const getPost = async (id: string): Promise<Post | null> => {
	const { data } = await client.get(`/posts/${id}.json`);
	if (!data.post) return null;

	return {
		id: data.post.id,
		url: data.post.file.url,
		ext: data.post.file.ext
	};
};