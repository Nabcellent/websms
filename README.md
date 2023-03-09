# WebSMS Api

[![build status][build-badge]][build]
[![code coverage][coverage-badge]][coverage]
[![npm version][version-badge]][package]
[![bundle size][minzip-badge]][bundlephobia]
[![npm downloads][downloads-badge]][npmtrends]
[![apache license][license-badge]][license]

[build-badge]: https://img.shields.io/github/actions/workflow/status/nabcellent/websms/test.yml?branch=main&logo=github&style=flat-square
[build]: https://github.com/paypal/paypal-js/actions?query=workflow%3Avalidate
[coverage-badge]: https://img.shields.io/codecov/c/github/paypal/paypal-js.svg?style=flat-square
[coverage]: https://codecov.io/github/paypal/paypal-js/
[version-badge]: https://img.shields.io/npm/v/@paypal/paypal-js.svg?style=flat-square
[package]: https://www.npmjs.com/package/@paypal/paypal-js
[minzip-badge]: https://img.shields.io/bundlephobia/minzip/@paypal/paypal-js.svg?style=flat-square
[bundlephobia]: https://bundlephobia.com/result?p=@paypal/paypal-js
[downloads-badge]: https://img.shields.io/npm/dm/@paypal/paypal-js.svg?style=flat-square
[npmtrends]: https://www.npmtrends.com/@paypal/paypal-js
[license-badge]: https://img.shields.io/npm/l/@paypal/paypal-js.svg?style=flat-square
[license]: https://github.com/paypal/paypal-js/blob/main/LICENSE

This is a <i>Typescript</i> package that interfaces with the [WebSMS](https://websms.co.ke/) Api.
The API enables you to initiate mobile Sms notifications.

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

- ### Sms
Enables you to send text messages

#### 1. Send Sms
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

#### 2. Schedule Sms
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