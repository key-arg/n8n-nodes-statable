import type { ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { statableApiRequest } from '../shared/transport';

type Site = { site_id: number; name: string };

export async function getSites(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = (await statableApiRequest.call(this, 'GET', '/sites')) as { sites?: Site[] };
	const needle = (filter ?? '').toLowerCase();

	const results = (response.sites ?? [])
		.filter((site) => !needle || site.name.toLowerCase().includes(needle))
		.map((site) => ({ name: site.name, value: site.site_id }));

	return { results };
}
