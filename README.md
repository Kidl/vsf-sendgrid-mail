# vsf-sendgrid

✉️ SendGrid module for Vue Storefront 📪

## Installation
Clone repo:
```shell
git clone https://github.com/new-fantastic/vsf-sendgrid-mail.git src/modules/vsf-sendgrid-mail
```

Copy api catalog to the VSF-API `src/api/extensions` and rename directory to `sendgrid-mails`.   

Open config and add `"sendgrid-mails"` to the `registeredExtensions`. Also in the extensions add following (it is compatibile with our Sendgrid Newsletter module):
```json
"sendgrid": {
      "key": "<your_secret_key>",
      "mails": {
        "default": "fallbackemail@mycompany.com",
        "eu": "europeemail@mycompany.com",
        "fr": "franceemail@mycompany.com",
      },
      "subjects": {
        "contact": {
          "default": "Contact",
          "es": "Contacto",
          "it": "Contatto",
          "fr": "Contact",
          "gb": "Contact",
          "nl": "Contact",
          "de": "Kontakt"
        }
      },
      "headers": {
        "email": {
          "default": "Email address",
          "es": "Dirección de correo electrónico",
          "it": "Indrizzo email",
          "fr": "Adresse e-mail",
          "gb": "Email address",
          "nl": "E-mailadres",
          "de": "E-Mail-Addresse"
        },
        "fullName": {
          "default": "Full name",
          "es": "Nombre completo",
          "it": "Nome e cognome",
          "fr": "Nom complet",
          "gb": "Full name",
          "nl": "Voor-en achternaam",
          "de": "Vollständiger Name"
        },
        "subject": {
          "default": "Subject",
          "es": "Tema",
          "it": "Soggetto",
          "fr": "Assujettir",
          "gb": "Subject",
          "nl": "Onderwerpen",
          "de": "Gegenstand"
        },
        "message": {
          "default": "Message",
          "es": "Mensaje",
          "it": "Messaggio",
          "fr": "Message",
          "gb": "Message",
          "nl": "Bericht",
          "de": "Botschaft"
        }
      }
    }
```

There you can add translations for different storeCodes and set emails for each storeCode. Default key will be used if there is no storeCode or there is no config for the current storeCode.

Inside `actions/contact.js` you have simple function that prepares HTML output of email. Customize it if you need.

After that, run `yarn` to fetch dependencies for `sendgrid-mails`.

Let's back to the PWA...

## Components/mixins
### Send
This simple mixins provides `sendEmail` method which has that signature:
```ts
sendEmail(action: string, body: any): void
```

*action* - Name of prepared action in the API. Basicly we have only `contact`
*body* - Payload that will be sent to the API

#### How to use it?
```js
import { Send } from 'src/modules/vsf-sendgrid-mail/components/Send'

export default {
  // ...
  mixins: [Send],

  mounted () {
    // I'll sent email after 5s
    const time = 5 * 1000;
    setTimeout(async () => {

      if (await this.sendEmail('contact', {
        email: 'fifciuu@gmail.com',
        message: 'Hello I would like to offer you promoting in the Social Media',
        fullName: 'John Snow'
      })) {
        console.log('It succeed, do what you want')
      } else {
        console.log('It failed, do what you want')
      }

    }, time)
  }
}
```

For error, there will be also invoked, in the catch block:
```js
console.log(err, 'FAIL')
```