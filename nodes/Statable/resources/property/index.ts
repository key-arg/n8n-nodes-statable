import { checkApiError } from '../../shared/request';
import type { INodeProperties } from 'n8n-workflow';
import { siteSelect } from '../../shared/descriptions';

const showOnlyForProperties = {
	resource: ['property'],
};

export const propertyDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForProperties },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many custom properties',
				description: 'List the custom property keys a site has recorded, per event',
				routing: {
					request: {
						method: 'GET',
						url: '/props',
						qs: {
							site_id: '={{$parameter.site}}',
						},
					},
					output: {
						postReceive: [
							checkApiError,
							{ type: 'rootProperty', properties: { property: 'props' } },
						],
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		...siteSelect,
		displayOptions: { show: showOnlyForProperties },
	},
	{
		displayName: 'Period',
		name: 'period',
		type: 'options',
		displayOptions: { show: showOnlyForProperties },
		options: [
			{ name: 'Current Month', value: 'month' },
			{ name: 'Last 30 Days', value: '30d' },
			{ name: 'Last 7 Days', value: '7d' },
			{ name: 'Last 90 Days', value: '90d' },
		],
		default: '30d',
		description: 'Only keys recorded in this window are listed',
		routing: {
			send: {
				type: 'query',
				property: 'date_range',
			},
		},
	},
];
