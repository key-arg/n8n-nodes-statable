import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class StatableApi implements ICredentialType {
	name = 'statableApi';

	displayName = 'Statable API';

	icon: Icon = { light: 'file:../icons/statable.svg', dark: 'file:../icons/statable.dark.svg' };

	documentationUrl = 'https://statable.com/docs/developers/stats-api/authentication/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			placeholder: 'stbl_...',
			description:
				'Create a key in Statable under Settings → API keys. Read analytics permission is enough for every operation of this node.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://statable.com/api/v1',
			url: '/sites',
			method: 'GET',
		},
	};
}
