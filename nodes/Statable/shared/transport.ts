import type {
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
} from 'n8n-workflow';

export const BASE_URL = 'https://statable.com/api/v1';

export async function statableApiRequest(
	this: ILoadOptionsFunctions | IExecuteSingleFunctions,
	method: IHttpRequestMethods,
	resource: string,
	qs: IDataObject = {},
	body: IDataObject | undefined = undefined,
) {
	const options: IHttpRequestOptions = {
		method,
		qs,
		body,
		url: `${BASE_URL}${resource}`,
		json: true,
	};

	return this.helpers.httpRequestWithAuthentication.call(this, 'statableApi', options);
}
