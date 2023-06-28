import axios from 'axios';

type Post = [id: number, url: string];

const client = axios.create({
	baseURL: 'https://e621.net',
	headers: {
		'User-Agent': '@zwerl/discord (DownloadableFox)',
	},
});

export const getRandomPost = async (): Promise<Post> => {
	const { data } = await client.get('/posts/random.json');
	return [data.post.id, data.post.file.url];
};

export const searchPosts = async (tags: string, limit: number = 10, page: number = 1): Promise<Post[] | null> => {
	const { data } = await client.get(
		`/posts.json`, 
		{ params: { tags } }
	);

	if (data.posts.length === 0) return null;
	
	// Array of posts with [id, url] format
	const posts = data.posts.map((post: any) => [post.id, post.file.url] as Post) as Post[];
	return posts;
};

export const getPost = async (id: string): Promise<Post | null> => {
	const { data } = await client.get(`/posts/${id}.json`);

	if (!data.post) return null;
	return [data.post.id, data.post.file.url];
};