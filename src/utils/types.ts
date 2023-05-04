export type WebSmsConfig = {
    apiKey: string,
    accessKey: string,
    clientId: string,
    senderId: string,
}

export type MessageParameters = {
    Number: number|string,
    Text: string
}

export type WebSMSRequest = {
    ApiKey: string,
    ClientId: string
    SenderId: string,
    ScheduleDateTime?: string,
    MessageParameters: MessageParameters[],
}


export type WebSmsRawResponse = {
    ErrorCode: number,
    ErrorDescription: string | null
    Data: WebSmsRawResponseData[]
}

export type WebSmsRawResponseData = {
    MessageErrorCode: number,
    MessageErrorDescription: string,
    MobileNumber: string,
    MessageId: string,
    Custom: string
}

export type WebSmsResponse = {
    code: number,
    description: string | null
    data?: WebSmsResponseData[]
}

export type WebSmsResponseData = {
    code: number,
    description: string,
    phone?: string,
    cost: number,
    message_id?: string,
    custom?: string
}