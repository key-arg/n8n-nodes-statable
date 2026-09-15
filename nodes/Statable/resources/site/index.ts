import { checkApiError } from '../../shared/request';
import type { IExecuteSingleFunctions, IHttpRequestOptions, INodeProperties } from 'n8n-workflow';

async function addStatsRange(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const range = this.getNodeParameter('includeStats') as string;
	if (range !== 'none') {
		requestOptions.qs = { ...(requestOptions.qs ?? {}), date_range: range };
	}
	return requestOptions;
}

const showOnlyForSites = {
	resource: ['site'],
};

export const siteDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForSites },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many sites',
				description: 'List the sites this API key can read',
				routing: {
					request: {
						method: 'GET',
						url: '/sites',
					},
					output: {
						postReceive: [
							checkApiError,
							{ type: 'rootProperty', properties: { property: 'sites' } },
						],
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Include Stats',
		name: 'includeStats',
		type: 'options',
		displayOptions: { show: { ...showOnlyForSites, operation: ['getAll'] } },
		options: [
			{ name: 'Current Month', value: 'month' },
			{ name: 'Last 30 Days', value: '30d' },
			{ name: 'Last 7 Days', value: '7d' },
			{ name: 'No', value: 'none' },
		],
		default: 'none',
		description:
			'Whether to add approximate headline numbers to every site. Use Report → Query when the exact window matters.',
		routing: {
			send: {
				preSend: [addStatsRange],
			},
		},
	},
];
