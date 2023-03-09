import { afterEach, beforeAll, describe, expect, it, SpyInstance, vi } from "vitest";
import { WebSms } from "../../client";
import { Sms } from "../sms";
import moment from "moment";
import { ValidationErr } from "../../exceptions/validation.err";

let websms: WebSms, sms: Sms, makeRequest: SpyInstance;
const validPhone = 254110039317, invalidPhone = '82547123456789'

describe('sms', () => {
    beforeAll(() => {
        websms = new WebSms({
            apiKey: "apiKey",
            accessKey: "accessKey",
            clientId: 'clientId',
            senderId: 'senderId'
        })
        sms = websms.sms
        makeRequest = vi.spyOn(websms, 'makeRequest')
    })

    afterEach(() => {
        vi.restoreAllMocks();

        websms = new WebSms({
            apiKey: "apiKey",
            accessKey: "accessKey",
            clientId: 'clientId',
            senderId: 'senderId'
        })
        sms = websms.sms
        makeRequest = vi.spyOn(websms, 'makeRequest')
    });

    describe('send', () => {
        it('should reject invalid phone numbers', () => {
            let phoneNumbers = ['+254713', '+2547XXXXXXXX', '0712345678', '+25571234567890', ''];

            expect(() => sms.text('#WebSMSTest').send()).rejects.toThrow('Phone number is required.')
            expect(() => sms.text('#WebSMSTest').to(invalidPhone).send()).rejects.toThrow(`${invalidPhone} is an invalid Kenyan phone number.`)
            expect(() => sms.text('#WebSMSTest').to(phoneNumbers).send()).rejects.toThrow(`+254713 is an invalid Kenyan phone number.`)
        });

        it('should reject empty messages', () => {
            expect(() => sms.to(validPhone).send()).rejects.toThrow(ValidationErr)
            expect(() => sms.text('').to(validPhone).send()).rejects.toThrow('Text is required.')
        });

        it('should reject messages scheduled for the past.', async () => {
            expect(() => sms.text('#WebSMSTest').to(validPhone).send(moment().subtract(1, 's')))
                .rejects.toThrow('Scheduled time must be after current time.')
        });

        it('should send SMS if data is valid.', async () => {
            const request = makeRequest.mockResolvedValue({
                ErrorCode: 0,
                ErrorDescription: 'Success'
            })

            const res = await sms.text('#WebSMSTest').to(validPhone).send()

            expect(res).toStrictEqual({ code: 0, description: 'Success' })
            expect(request).toHaveBeenNthCalledWith(1, {
                url: '/SendBulkSMS', data: {
                    ApiKey: "apiKey",
                    ClientId: 'clientId',
                    SenderId: 'senderId',
                    MessageParameters: [{
                        Number: validPhone,
                        Text: '#WebSMSTest'
                    }]
                }
            })
        });

        it('should send a scheduled SMS if data is valid.', async () => {
            const request = makeRequest.mockResolvedValue({
                ErrorCode: 0,
                ErrorDescription: 'Success'
            })

            const schedule = moment().add(1, "d")

            const res = await sms.text('#WebSMSTest').to(validPhone).send(schedule)

            expect(res).toStrictEqual({ code: 0, description: 'Success' })
            expect(request).toHaveReturnedWith({
                ErrorCode: 0,
                ErrorDescription: 'Success'
            })
            expect(request).toHaveBeenNthCalledWith(1, {
                url: '/SendBulkSMS', data: {
                    ApiKey: "apiKey",
                    ClientId: 'clientId',
                    SenderId: 'senderId',
                    MessageParameters: [{
                        Number: validPhone,
                        Text: '#WebSMSTest'
                    }],
                    ScheduleDateTime: schedule.format('YYYY-MM-D')
                }
            })
        });
    })
})