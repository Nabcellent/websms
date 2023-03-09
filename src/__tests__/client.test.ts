import { beforeAll, describe, expect, it, vi } from "vitest";
import { WebSms } from "../client";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { UnauthorizedErr } from "../exceptions/unauthorized.err";
import { NotFoundError } from "../exceptions/not-found.err";

let websms: WebSms;

vi.mock('../utils/logger', () => ({
    log: {
        info: vi.fn(),
        error: vi.fn()
    }
}));

describe('client', () => {
    beforeAll(() => {
        websms = new WebSms({
            apiKey: "apiKey",
            accessKey: "accessKey",
            clientId: 'clientId',
            senderId: 'senderId'
        })
    })

    describe('makeRequest', () => {
        it('should call axios', async function () {
            vi.spyOn(axios, 'create').mockReturnValue({
                get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
                    return Promise.resolve(<R>{ data: { Data: [{ Credits: 'Ksh1.00', PluginType: 'SMS' }] } })
                }
            } as AxiosInstance)

            await websms.balance.fetch()

            expect(axios.create).toHaveBeenCalledOnce()
        });

        it('should throw an unauthorized error', async function () {
            vi.spyOn(axios, 'create').mockReturnValue({
                get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
                    return Promise.reject(new UnauthorizedErr)
                }
            } as AxiosInstance)

            await expect(websms.balance.fetch()).rejects.toThrow('Unauthorized!')
        });

        it('should throw a not found error', async function () {
            vi.spyOn(axios, 'create').mockReturnValue({
                get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
                    return Promise.reject(new NotFoundError)
                }
            } as AxiosInstance)

            await expect(websms.balance.fetch()).rejects.toThrow('Not Found!')
        });
    })
})