export type WebSmsConfig = {
    apiKey: string,
    accessKey: string,
    clientId: string,
    senderId: string,
}

export type WebSmsPayload = {
    to: string | string[],
    from: string | number | null,
    message: string
}