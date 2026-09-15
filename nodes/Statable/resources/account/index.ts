import { checkApiError } from '../../shared/request';
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAccount = {
	resource: ['account'],
};

export const accountDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForAccount },
		options: [
			{
				name: 'Get Subscription',
				value: 'getSubscription',
				action: 'Get subscription',
				description: 'Get the plan state of the account that owns the API key',
				routing: {
					request: {
						method: 'GET',
						url: '/subscription',
					},
					output: {
						postReceive: [checkApiError],
					},
				},
			},
		],
		default: 'getSubscription',
	},
];
