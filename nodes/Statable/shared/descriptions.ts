import type { INodeProperties } from 'n8n-workflow';

export const siteSelect: INodeProperties = {
	displayName: 'Site',
	name: 'site',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	required: true,
	description: 'The site to read',
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			placeholder: 'Select a site...',
			typeOptions: {
				searchListMethod: 'getSites',
				searchable: true,
			},
		},
		{
			displayName: 'By ID',
			name: 'id',
			type: 'string',
			placeholder: 'e.g. 3093477',
			validation: [
				{
					type: 'regex',
					properties: {
						regex: '^[0-9]+$',
						errorMessage: 'A site ID is a number',
					},
				},
			],
		},
	],
};

export function dateRangeFields(show: { [key: string]: string[] }): INodeProperties[] {
	return [
		{
			displayName: 'Date Range',
			name: 'dateRange',
			type: 'options',
			displayOptions: { show },
			options: [
				{ name: 'Current Month', value: 'month' },
				{ name: 'Custom Range', value: 'custom' },
				{ name: 'Last 30 Days', value: '30d' },
				{ name: 'Last 7 Days', value: '7d' },
				{ name: 'Last N Days', value: 'lastNDays' },
				{ name: 'Realtime (Last 30 Minutes)', value: 'realtime' },
			],
			default: '7d',
			description: 'Windows follow the site timezone',
		},
		{
			displayName: 'Days',
			name: 'days',
			type: 'number',
			displayOptions: { show: { ...show, dateRange: ['lastNDays'] } },
			typeOptions: { minValue: 1, maxValue: 90 },
			default: 14,
			description: 'Number of days back from today, 1 to 90',
		},
		{
			displayName: 'Start Date',
			name: 'startDate',
			type: 'dateTime',
			required: true,
			displayOptions: { show: { ...show, dateRange: ['custom'] } },
			default: '',
			description: 'First day of the range, inclusive',
		},
		{
			displayName: 'End Date',
			name: 'endDate',
			type: 'dateTime',
			required: true,
			displayOptions: { show: { ...show, dateRange: ['custom'] } },
			default: '',
			description: 'Last day of the range, inclusive. Up to 366 days after the start date.',
		},
	];
}

const filterFieldOptions = [
	'browser',
	'browser_version',
	'channel',
	'city',
	'code',
	'country',
	'device',
	'entry_page',
	'event',
	'exit_page',
	'hostname',
	'os',
	'os_version',
	'page',
	'referrer',
	'region',
	'source',
	'utm_campaign',
	'utm_content',
	'utm_medium',
	'utm_source',
	'utm_term',
].map((field) => ({ name: field, value: field }));

export function filtersField(
	show: { [key: string]: string[] },
	description: string,
): INodeProperties {
	return {
		displayName: 'Filters',
		name: 'filters',
		type: 'fixedCollection',
		placeholder: 'Add Filter',
		typeOptions: { multipleValues: true },
		displayOptions: { show },
		default: {},
		description,
		options: [
			{
				displayName: 'Filter',
				name: 'filter',
				values: [
					{
						displayName: 'Field',
						name: 'field',
						type: 'options',
						options: filterFieldOptions,
						default: 'country',
						description:
							'Geo fields take codes, e.g. US for country. The event field accepts only the Is operator and one value.',
					},
					{
						displayName: 'Operator',
						name: 'operator',
						type: 'options',
						options: [
							{ name: 'Contains', value: 'contains' },
							{ name: 'Does Not Contain', value: 'does_not_contain' },
							{ name: 'Is', value: 'is' },
							{ name: 'Is Not', value: 'is_not' },
						],
						default: 'is',
					},
					{
						displayName: 'Values',
						name: 'values',
						type: 'string',
						default: '',
						placeholder: 'e.g. US, DE',
						description: 'One or more values separated by commas, matched with OR',
					},
				],
			},
		],
	};
}
