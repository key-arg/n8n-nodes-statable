import type { ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { statableApiRequest } from '../shared/transport';

type Funnel = { id: number; name: string };

export async function getFunnels(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const siteId = this.getCurrentNodeParameter('site', { extractValue: true }) as string;
	if (!siteId) return { results: [] };

	const response = (await statableApiRequest.call(this, 'GET', '/funnels', {
		site_id: siteId,
	})) as { funnels?: Funnel[] };
	const needle = (filter ?? '').toLowerCase();

	const results = (response.funnels ?? [])
		.filter((funnel) => !needle || funnel.name.toLowerCase().includes(needle))
		.map((funnel) => ({ name: funnel.name, value: funnel.id }));

	return { results };
}
