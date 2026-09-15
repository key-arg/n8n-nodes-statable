import type {
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	IN8nHttpFullResponse,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

type FilterInput = { field: string; operator: string; values: string };

function siteId(ctx: IExecuteSingleFunctions): number {
	const value = ctx.getNodeParameter('site', undefined, { extractValue: true }) as string | number;
	return Number(value);
}

function dateRange(ctx: IExecuteSingleFunctions): string | string[] {
	const range = ctx.getNodeParameter('dateRange') as string;
	if (range === 'lastNDays') return `${ctx.getNodeParameter('days') as number}d`;
	if (range !== 'custom') return range;

	const day = (name: string) => String(ctx.getNodeParameter(name) ?? '').slice(0, 10);
	const start = day('startDate');
	const end = day('endDate');
	if (!start || !end) {
		throw new NodeOperationError(
			ctx.getNode(),
			'Start Date and End Date are required for a custom range',
		);
	}
	return [start, end];
}

function filters(ctx: IExecuteSingleFunctions): IDataObject[] {
	const input = ctx.getNodeParameter('filters', {}) as { filter?: FilterInput[] };
	return (input.filter ?? [])
		.map((f) => ({
			field: f.field,
			operator: f.operator,
			values: f.values
				.split(',')
				.map((v) => v.trim())
				.filter(Boolean),
		}))
		.filter((f) => f.values.length > 0);
}

export async function buildQueryBody(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body: IDataObject = {
		site_id: siteId(this),
		metrics: this.getNodeParameter('metrics') as string[],
		date_range: dateRange(this),
	};

	let dimension = this.getNodeParameter('dimension') as string;
	if (dimension === 'event:props') {
		dimension = `event:props:${(this.getNodeParameter('propertyKey') as string).trim()}`;
	}
	if (dimension !== 'none') {
		body.dimensions = [dimension];
	}
	if (dimension !== 'none' && !dimension.startsWith('time')) {
		body.limit = this.getNodeParameter('limit') as number;
		body.offset = this.getNodeParameter('offset') as number;
	}

	const compare = this.getNodeParameter('compare') as boolean;
	if (compare) body.compare = 'previous_period';

	const list = filters(this);
	if (list.length) body.filters = list;

	requestOptions.body = body;
	return requestOptions;
}

export async function buildFunnelReportBody(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body: IDataObject = {
		site_id: siteId(this),
		date_range: dateRange(this),
	};
	const list = filters(this);
	if (list.length) body.filters = list;

	requestOptions.body = body;
	return requestOptions;
}

/**
 * Turns the query envelope into one item per row, with dimensions, labels and
 * metrics merged flat. Rows of an aggregate carry metrics only.
 */
export async function simplifyQueryResponse(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
	response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	if (!(this.getNodeParameter('simplify', true) as boolean)) return items;

	const data = response.body as { results?: IDataObject[] };
	return (data.results ?? []).map((row) => {
		const flat: IDataObject = {};
		const dimensions = (row.dimensions ?? {}) as IDataObject;
		const labels = (row.labels ?? {}) as IDataObject;
		for (const [key, value] of Object.entries(dimensions)) {
			flat[key] = value;
			if (labels[key] !== undefined) flat[`${key}:label`] = labels[key];
		}
		Object.assign(flat, row.metrics as IDataObject);
		if (row.compare !== undefined) flat.compare = row.compare;
		return { json: flat };
	});
}

/**
 * Surfaces the API's own error. Requests run with ignoreHttpStatusErrors, so
 * the body ({ code, error, request_id }) reaches this hook instead of being
 * replaced by a generic "Bad request" message.
 */
export async function checkApiError(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
	response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	if (response.statusCode < 400) return items;

	const body = (response.body ?? {}) as { code?: string; error?: string; request_id?: string };
	const details = [body.code, body.request_id && `request ${body.request_id}`]
		.filter(Boolean)
		.join(', ');
	throw new NodeApiError(this.getNode(), body as JsonObject, {
		message: body.error ?? `Statable API returned HTTP ${response.statusCode}`,
		description: details || undefined,
		httpCode: String(response.statusCode),
	});
}
