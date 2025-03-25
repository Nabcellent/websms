import { Balance } from './repositories/balance';
import { Sms } from './repositories/sms';
import axios, { AxiosError } from 'axios';
import { WebSmsConfig } from "./utils";
import { NotFoundError } from "./exceptions/not-found.err";
import { UnauthorizedErr } from "./exceptions/unauthorized.err";
import { ValidationErr } from "./exceptions/validation.err";
import { BadRequestError } from "./exceptions/bad-request.err";

export class WebSms {
    public config: WebSmsConfig;
    public baseUrl = process.env.WEBSMS_API_URL || 'https://api.onfonmedia.co.ke/v1/sms';
    sms: Sms = new Sms(this)
    balance: Balance = new Balance(this)

    constructor(config: WebSmsConfig) {
        this.config = config;
    }

    makeRequest = async ({ url, method = 'post', data = {} }: { url: string, method?: 'get' | 'post', data?: any }) => {
        console.info('...[LIB WEBSMS] - REQ:', { url, method, data })

        const http = axios.create({
            baseURL: this.baseUrl,
            headers: {
                Accept: 'application/json',
                AccessKey: this.config.accessKey,
                ContentType: 'application/json'
            }
        });

        return http[method](url, data).then(({ data }) => {
            console.info('...[LIB WEBSMS] - RES:', { data })

            return data
        }).catch(e => {
            console.error(`...[LIB WEBSMS] - ERR:`, { error: e })

            if (e instanceof AxiosError) {
                if (e.response?.status === 422) {
                    throw new ValidationErr(e.response.data.errors)
                }
                if (e.response?.status === 401) {
                    throw new UnauthorizedErr(e.response.data.message)
                }
                if (e.response?.status === 404) {
                    throw new NotFoundError()
                }
            }

            throw new BadRequestError(e.message || 'Something went wrong')
        })
    }
}
