import { WebSms } from '../client';

export class Balance {
    private client: WebSms;

    constructor(client: WebSms) {
        this.client = client;
    }

    public async fetch(pluginType: 'SMS' = 'SMS'): Promise<number> {
        const { Data } = await this.client.makeRequest({
            url: '/Balance',
            method: 'get',
            data: {
                params: {
                    ApiKey: this.client.config.apiKey,
                    ClientId: this.client.config.clientId,
                }
            }
        })

        const { Credits } = Data.find((data: any) => data.PluginType === pluginType)

        return Number(Number(Credits.slice(3)).toFixed(2));
    }
}
