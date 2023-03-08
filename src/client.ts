import { Balance } from './repositories/balance';
import { SMS } from './repositories/SMS';
import axios, { AxiosError } from 'axios';
import { WebSmsConfig } from "./utils";
import { NotFoundError } from "./exceptions/not-found.err";
import { UnauthorizedErr } from "./exceptions/unauthorized.err";
import { ValidationErr } from "./exceptions/validation.err";
import { log } from "./utils/logger";
import { BadRequestError } from "./exceptions/bad-request.err";

export class WebSms {
    public config: WebSmsConfig;
    public baseUrl = process.env.WEBSMS_API_URL || 'https://api.onfonmedia.co.ke/v1/sms';
    sms: SMS = new SMS(this)
    balance: Balance = new Balance(this)

    constructor(config: WebSmsConfig) {
        this.config = config;
    }

    makeRequest = async ({ url, method = 'post', data = {} }: { url: string, method?: 'get' | 'post', data?: any }) => {
        log.info('...[LIB WEBSMS] - REQ:', { url, method, data })

        const http = axios.create({
            baseURL: this.baseUrl,
            headers: {
                Accept: 'application/json',
                AccessKey: this.config.accessKey,
                ContentType: 'application/json'
            }
        });

        return http[method](url, data).then(({ data }) => {
            log.info('...[LIB WEBSMS] - RES:', { data })

            return data
        }).catch(e => {
            log.error(`...[LIB WEBSMS] - ERR:`, { error: e })

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
