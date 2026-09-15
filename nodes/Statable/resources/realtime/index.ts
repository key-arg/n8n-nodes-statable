import { checkApiError } from '../../shared/request';
import type { INodeProperties } from 'n8n-workflow';
import { siteSelect } from '../../shared/descriptions';

const showOnlyForRealtime = {
	resource: ['realtime'],
};

export const realtimeDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForRealtime },
		options: [
			{
				name: 'Get Current Visitors',
				value: 'getCurrentVisitors',
				action: 'Get current visitors',
				description: 'Unique visitors active in the last five minutes',
				routing: {
					request: {
						method: 'GET',
						url: '/current-visitors',
						qs: {
							site_id: '={{$parameter.site}}',
						},
					},
					output: {
						postReceive: [checkApiError],
					},
				},
			},
		],
		default: 'getCurrentVisitors',
	},
	{
		...siteSelect,
		displayOptions: { show: showOnlyForRealtime },
	},
];
