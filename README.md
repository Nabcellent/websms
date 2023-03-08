# WebSMS Api

This is a <i>Typescript</i> package that interfaces with the [WebSMS](https://websms.co.ke/) Api.
The API enables you to initiate mobile SMS notifications.

Check out their [api documentation](https://www.docs.onfonmedia.co.ke/).

## Documentation

### Installation

You can install the package via npm or yarn:
```bash
yarn add @nabcellent/websms
```
### Getting Started
Initialize the WebSMS class with your config.
```js
import { WebSMS, WebSMSConfig } from '@nabcellent/websms';

let config: WebSMSConfig = {
    accessKey: process.env.WEBSMS_ACCESS_KEY,
    apiKey   : process.env.WEBSMS_API_KEY,
    clientId : process.env.WEBSMS_CLIENT_ID,
    senderId : process.env.WEBSMS_SENDER_ID
};

const web = new WebSMS(config);
```

- ### SMS
Enables you to send text messages

#### 1. Send SMS
```js
const response = await web.sms.text('#WebSMSTest').to(254123456789).send()
    //  OR
const response = await web.sms.text('#WebSMSTest').to([254123456789]).send()

//  Expected responses
{
    code: 0,
    description: null,
    data: [
        {
            message_id: "7444f504-6760-43fd-9b40-2708da61d114",
            code: 0,
            description: "Success",
            phone: "254123456789",
            custom: ""
        },
        {
            message_id: "",
            code: 801,
            description: "Country not found in master data",
            phone: "89254736388405", //   Invalid phone number
            custom: ""
        }
    ]
}
```

#### 2. Schedule SMS
Provide a Moment or Date instance to the send method.
```js
const response = await web.sms.text('#WebSMSTest').to([254123456789]).send(moment().add(1, 'm'))
```
<small><i>PS: The date must be after current time.</i>🌚</small>

---

- ### Account
Enables you to check the balance of your account

1. Account balance
```js
const response = await web.balance.fetch()

//  Expected response(number)
7.33
```
## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Security

If you discover any security related issues, please email [nabcellent.dev@gmail.com](mailto:nabcellent.dev@gmail.com) instead of using the issue tracker.

## Credits

- [Nabcellent](https://github.com/Nabcellent)

[comment]: <> (- [All Contributors]&#40;../../contributors&#41;)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.