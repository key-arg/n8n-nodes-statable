# n8n-nodes-statable

This is an n8n community node for [Statable](https://statable.com), privacy-first cookieless web analytics. It reads your analytics inside n8n workflows: visitors, pageviews, sources, pages, countries, goals and funnels.

Use it to post a weekly traffic summary to Slack, alert on a spike in current visitors, copy daily numbers into a spreadsheet, or give an AI agent read access to your analytics.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

- [Installation](#installation)
- [Credentials](#credentials)
- [Operations](#operations)
- [Usage](#usage)
- [Compatibility](#compatibility)
- [Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

On self-hosted n8n: **Settings → Community Nodes → Install**, then enter `n8n-nodes-statable`.

## Credentials

The node authenticates with a Statable API key.

1. In Statable, open **Settings → API keys** and select **Create API key**.
2. Choose **All sites** or a single site. The **Read analytics** permission is enough for every operation in this node.
3. Copy the key. It starts with `stbl_` and is shown only once.
4. In n8n, create a **Statable API** credential and paste the key.

See [Authentication](https://statable.com/docs/developers/stats-api/authentication/) for key expiry, rotation and permissions.

## Operations

| Resource | Operation | What it returns |
|---|---|---|
| Report | Query | Totals, a time series or a ranked breakdown for any metrics, date range, grouping and filters |
| Site | Get Many | The sites the key can read, optionally with headline numbers |
| Realtime | Get Current Visitors | Unique visitors active in the last five minutes |
| Property | Get Many | Custom property keys a site has recorded, per event |
| Goal | Get Many | Goals configured for a site |
| Funnel | Get Many | Saved funnels of a site |
| Funnel | Get Report | Visitors, conversion rate and drop-off for each step of a saved funnel |
| Account | Get Subscription | Plan state of the account that owns the key |

The node is available as a tool for the n8n AI Agent.

### Report → Query

- **Metrics**: visitors, pageviews, visits, visit duration, bounce rate, views per visit, engagement time, and breakdown-only metrics such as time on page, scroll depth, events and conversion rate.
- **Date Range**: last 7 or 30 days, current month, last N days (1 to 90), realtime, or a custom range of up to 366 days. Windows follow the site timezone.
- **Group By**: nothing for totals; minute, hour, day, week or month for a series; or a breakdown by page, source, channel, country, device, UTM parameter, goal, custom event, custom property and more.
- **Filters**: narrow by country, device, source, page, hostname, UTM parameters, status code or a custom event. Multiple filters combine with AND; comma-separated values within one filter combine with OR.
- **Compare to Previous Period**: adds the previous value and percent change to each row.
- **Simplify** (on by default): returns one flat item per row, for example `{ "visit:country": "US", "visit:country:label": "United States", "visitors": 206 }`. Turn it off to get the raw response with the query echo and paging meta.

Which metrics each breakdown computes is listed in the [query reference](https://statable.com/docs/developers/stats-api/query/#breakdowns). An unsupported combination fails with the API's own error message.

## Usage

**Weekly top pages to Slack.** Schedule Trigger (Mondays) → Statable (Report → Query, Metrics: Visitors and Pageviews, Date Range: Last 7 Days, Group By: Page, Limit: 10, Compare to Previous Period on) → Slack.

**Traffic history to a sheet.** Schedule Trigger (weekly) → Statable (Report → Query, Metrics: Visitors, Pageviews, Bounce Rate, Date Range: Last 7 Days, Group By: Day) → Google Sheets (Append Row), one row per day.

**Where did sign-ups come from?** Statable (Report → Query, Group By: Source, Filters: `event` is `Signup`) answers where the visitors who fired the `Signup` event arrived from.

**Custom property breakdown.** Use Property → Get Many to find a key, then Report → Query with Group By: Custom Property, Property Key: `plan`, and a filter `event` is the event that carries it.

## Compatibility

Tested with n8n 2.38. Requires n8n with community nodes API version 1.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Statable Stats API overview](https://statable.com/docs/developers/stats-api/overview/)
- [Query reference](https://statable.com/docs/developers/stats-api/query/)
- [Rate limits](https://statable.com/docs/developers/stats-api/rate-limits/)

## License

[MIT](LICENSE)
