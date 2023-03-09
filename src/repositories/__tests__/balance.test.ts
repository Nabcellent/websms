import { afterEach, beforeAll, describe, expect, it, SpyInstance, vi } from "vitest";
import { WebSms } from "../../client";
import { Balance } from "../balance";

let websms: WebSms, balance: Balance, makeRequest: SpyInstance;

describe('balance', () => {
    beforeAll(() => {
        websms = new WebSms({
            apiKey: "apiKey",
            accessKey: "accessKey",
            clientId: 'clientId',
            senderId: 'senderId'
        })
        balance = websms.balance
        makeRequest = vi.spyOn(websms, 'makeRequest')
    })

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('send', () => {
        it('should fetch account balance.', async () => {
            const request = makeRequest.mockResolvedValue({
                ErrorCode: 0,
                ErrorDescription: 'Success',
                Data: [{ PluginType: "SMS", Credits: "KSh7578560.8000" }]
            })

            const res = await balance.fetch()

            expect(res).toStrictEqual(7578560.80)
            expect(request).toHaveBeenNthCalledWith(1, {
                url: '/Balance',
                method: 'get',
                data: {
                    params: {
                        ApiKey: "apiKey",
                        ClientId: 'clientId',
                    }
                }
            })
        });
    })
})
