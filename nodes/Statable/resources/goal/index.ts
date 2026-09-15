import { checkApiError } from '../../shared/request';
import type { INodeProperties } from 'n8n-workflow';
import { siteSelect } from '../../shared/descriptions';

const showOnlyForGoals = {
	resource: ['goal'],
};

export const goalDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForGoals },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many goals',
				description: 'List the goals configured for a site',
				routing: {
					request: {
						method: 'GET',
						url: '=/sites/{{$parameter.site}}/goals',
					},
					output: {
						postReceive: [
							checkApiError,
							{ type: 'rootProperty', properties: { property: 'goals' } },
						],
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		...siteSelect,
		displayOptions: { show: showOnlyForGoals },
	},
];
