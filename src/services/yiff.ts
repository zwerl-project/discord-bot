import axios from 'axios';

type Post = [id: number, url: string];

const client = axios.create({
	baseURL: 'https://e621.net',
	headers: {
		'User-Agent': '@zwerl/discord-bot/1.0 (DownloadableFox)',
	},
});

export const getRandomPost = async (): Promise<Post> => {
	const { data } = await client.get('/posts/random.json');
	return [data.post.id, data.post.file.url];
};

export const searchPosts = async (tags: string): Promise<Post | null> => {
	const { data } = await client.get(
		'/posts.json', 
		{ params: { tags } }
	);

	if (data.posts.length === 0) return null;

	const post = data.posts[Math.floor(Math.random() * data.posts.length)];

	return [
		post.id,
		post.file.url as string
	];
};

export const getPost = async (id: string): Promise<Post | null> => {
	const { data } = await client.get(`/posts/${id}.json`);

	if (!data.post) return null;
	return [data.post.id, data.post.file.url];
};