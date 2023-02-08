import glob from 'glob';

export type ModuleValidator = (module: unknown, filename: string) => Promise<boolean>

export interface SearchParams {
	folder: string,
	extension: string,
	recursive: boolean
}

export const searchFiles = async (params: SearchParams): Promise<string[]> => {
	const { folder, extension, recursive } = params;
	const recursiveFlag = recursive ? '**' : '.';

	const query = `${__dirname}/../${folder}/${recursiveFlag}/*${extension}`;

	// Using glob to search for files
	const files = await new Promise<string[]>((resolve, reject) => {
		glob(query, (err, files) => {
			if (err) reject(err);
			else resolve(files);
		});
	});

	return files;
};

export const searchModules = async (params: SearchParams, validate: ModuleValidator): Promise<unknown[]> => {
	const modules = [];
	const files = await searchFiles(params);

	for (const file of files) {
		const module = await import(file);
		if (await validate(module, file)) modules.push(module);
	}

	return modules;
};