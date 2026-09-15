import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { getFunnels } from './listSearch/getFunnels';
import { getSites } from './listSearch/getSites';
import { accountDescription } from './resources/account';
import { funnelDescription } from './resources/funnel';
import { goalDescription } from './resources/goal';
import { propertyDescription } from './resources/property';
import { realtimeDescription } from './resources/realtime';
import { reportDescription } from './resources/report';
import { siteDescription } from './resources/site';
import { BASE_URL } from './shared/transport';

export class Statable implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Statable',
		name: 'statable',
		icon: { light: 'file:../../icons/statable.svg', dark: 'file:../../icons/statable.dark.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Read privacy-first web analytics from Statable',
		defaults: {
			name: 'Statable',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'statableApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: BASE_URL,
			ignoreHttpStatusErrors: true,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Funnel', value: 'funnel' },
					{ name: 'Goal', value: 'goal' },
					{ name: 'Property', value: 'property' },
					{ name: 'Realtime', value: 'realtime' },
					{ name: 'Report', value: 'report' },
					{ name: 'Site', value: 'site' },
				],
				default: 'report',
			},
			...reportDescription,
			...siteDescription,
			...realtimeDescription,
			...propertyDescription,
			...goalDescription,
			...funnelDescription,
			...accountDescription,
		],
	};

	methods = {
		listSearch: {
			getFunnels,
			getSites,
		},
	};
}
