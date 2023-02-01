export const getRandomPost = async () => {
	const response = await fetch('https://e621.net/posts/random.json');
	if (response.status !== 200)
		throw new Error(`Failed to get random post from e621. Status code: ${response.status}`);

	const { post } = await response.json();
	return post.file.url;
};

export const searchPosts = async (tags: string) => {
	const response = await fetch(`https://e621.net/posts.json?tags=${tags}`);

	if (response.status !== 200)
		throw new Error(`Failed to search for post with tags "${tags}" on e621. Status code: ${response.status}`);

	const { posts } = await response.json();

	if (posts.length === 0) return null;
	return posts[Math.floor(Math.random() * posts.length)].file.url as string;
};