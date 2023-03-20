import { WebSms } from '../client';
import { ValidationErr } from "../exceptions/validation.err";
import { WebSmsRawResponse, WebSMSRequest, WebSmsResponse } from "../utils";
import moment, { Moment } from "moment";
import { isValidPhoneNumber } from "libphonenumber-js";

export class Sms {
    #client: WebSms;
    #message: string = "";
    #phones: (string | number)[] = [];

    constructor(client: WebSms) {
        this.#client = client;
    }

    public text(message: string) {
        this.#message = message;

        return this;
    }

    public to(to: string | number | (string | number)[]) {
        this.#phones = Array.isArray(to) ? to : [to];

        return this;
    }

    public async send(schedule?: Date | Moment): Promise<WebSmsResponse> {
        if (!this.#message) throw new ValidationErr('Text is required.')
        if (this.#phones.length <= 0) throw new ValidationErr('Phone number is required.')

        const MessageParameters = this.#phones.map(phone => {
            if (!isValidPhoneNumber(String(phone), 'KE')) {
                throw new ValidationErr(`${phone} is an invalid Kenyan phone number.`)
            }

            return {
                Number: phone,
                Text: this.#message
            }
        })

        const data: WebSMSRequest = {
            ApiKey: this.#client.config.apiKey,
            ClientId: this.#client.config.clientId,
            SenderId: this.#client.config.senderId,
            MessageParameters
        }

        if (schedule) {
            schedule = moment(schedule)

            if (schedule.isBefore()) {
                throw new ValidationErr('Scheduled time must be after current time.')
            }

            data.ScheduleDateTime = schedule.format('YYYY-MM-D')
        }

        const res: WebSmsRawResponse = await this.#client.makeRequest({
            url: '/SendBulkSMS', data
        });

        const result: WebSmsResponse = {
            code: res.ErrorCode,
            description: res.ErrorDescription,
        }

        if (res.Data) {
            result.data = res.Data?.map(d => ({
                message_id: d.MessageId,
                code: d.MessageErrorCode,
                description: d.MessageErrorDescription,
                phone: d.MobileNumber,
                cost: this.cost(this.#message),
                custom: d.Custom
            }))
        }

        return result
    }

    public cost(text: string): number {
        console.log(`TEXT:\n"${text}"`, `\n\nLENGTH: ${text.length}`)

        let cost = Number(process.env.WEBSMS_COST || .3);
        const rawCost = (text.length * cost) / 160

        if (rawCost > 0) {
            cost = Math.ceil(rawCost / cost) * cost;
        } else if (rawCost < 0) {
            cost = Math.floor(rawCost / cost) * cost;
        }

        return Number(cost.toFixed(4))
    }
}
