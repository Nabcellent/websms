import { WebSms } from '../client';
import { ValidationErr } from "../exceptions/validation.err";
import { WebSmsRawResponse, WebSMSRequest, WebSmsResponse } from "../utils";
import moment, { Moment } from "moment";

export class SMS {
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
        if (!this.#message) throw new ValidationErr('Please provide a message.')
        if (this.#phones.length <= 0) throw new ValidationErr('Please provide at least one phone number.')

        const MessageParameters = this.#phones.map(phone => {
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

            data.ScheduleDateTime = moment(schedule).format('YYYY-MM-DD HH:mm:ss')
        }

        const res: WebSmsRawResponse = await this.#client.makeRequest({
            url: '/SendBulkSMS', data
        });

        return {
            code: res.ErrorCode,
            description: res.ErrorDescription,
            data: res.Data.map(d => ({
                message_id: d.MessageId,
                code: d.MessageErrorCode,
                description: d.MessageErrorDescription,
                phone: d.MobileNumber,
                custom: d.Custom
            }))
        }
    }
}
