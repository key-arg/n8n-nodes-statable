import type { INodeProperties } from 'n8n-workflow';
import { dateRangeFields, filtersField, siteSelect } from '../../shared/descriptions';
import { checkApiError, buildFunnelReportBody } from '../../shared/request';

const showOnlyForFunnels = {
	resource: ['funnel'],
};

const showOnlyForReport = {
	resource: ['funnel'],
	operation: ['getReport'],
};

export const funnelDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForFunnels },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many funnels',
				description: 'List the saved funnels of a site',
				routing: {
					request: {
						method: 'GET',
						url: '/funnels',
						qs: {
							site_id: '={{$parameter.site}}',
						},
					},
					output: {
						postReceive: [
							checkApiError,
							{ type: 'rootProperty', properties: { property: 'funnels' } },
						],
					},
				},
			},
			{
				name: 'Get Report',
				value: 'getReport',
				action: 'Run a funnel report',
				description: 'Run a saved funnel and get visitors, conversion and drop-off per step',
				routing: {
					request: {
						method: 'POST',
						url: '=/funnels/{{$parameter.funnel}}/report',
					},
					send: {
						preSend: [buildFunnelReportBody],
					},
					output: {
						postReceive: [checkApiError],
					},
				},
			},
		],
		default: 'getReport',
	},
	{
		...siteSelect,
		displayOptions: { show: showOnlyForFunnels },
	},
	{
		displayName: 'Funnel',
		name: 'funnel',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: { show: showOnlyForReport },
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a funnel...',
				typeOptions: {
					searchListMethod: 'getFunnels',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 45',
			},
		],
	},
	...dateRangeFields(showOnlyForReport),
	filtersField(
		showOnlyForReport,
		'Session fields only, such as country, device or source. Page, event and status code filters are rejected.',
	),
];
