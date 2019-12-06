import { apiStatus } from '../../../lib/util';
import { Router } from 'express';
import { merge } from 'lodash';

const sgMail = require('@sendgrid/mail');
const Ajv = require('ajv');
const fs = require('fs');

module.exports = ({ config, db }) => {
  let mcApi = Router();
  sgMail.setApiKey(config.extensions.sendgrid.key);

  mcApi.post('/:action', async (req, res) => {
    const { action } = req.params;
    const { storeCode } = req.query

    const ajv = new Ajv();

    const contactSchema = require(`./models/${action}.schema.json`)
    let contactSchemaExtension = {};
    if (fs.existsSync(`./models/${action}.schema.extension.json`)) {
      contactSchemaExtension = require(`./models/${action}.schema.extension.json`);
    }
    const validate = ajv.compile(merge(contactSchema, contactSchemaExtension))

    if (!validate(req.body)) {
      console.dir(validate.errors);
      apiStatus(res, validate.errors, 500);
      return;
    }

    try {
      const actionModule = await import(`./actions/${action}.js`);

      const msg = actionModule.default({
        ...req.body,
        ...(!!storeCode ? { storeCode } : {}),
        currency: !!storeCode ? config.storeViews[storeCode].i18n.currencySign : config.i18n.currencySign,
        headers: config.extensions.sendgrid.headers,
        subject: (!!storeCode && config.extensions.sendgrid.subjects.hasOwnProperty(action) && config.extensions.sendgrid.subjects[action].hasOwnProperty(storeCode)
          ? config.extensions.sendgrid.subjects[action][storeCode]
          : config.extensions.sendgrid.subjects[action].default)
      });
      msg.to = !!storeCode && config.extensions.sendgrid.mails.hasOwnProperty(storeCode)
        ? config.extensions.sendgrid.mails[storeCode]
        : config.extensions.sendgrid.mails.default;

      await Promise.all([
        sgMail.send(msg),
        sgMail.send({ 
          ...msg,
          to: msg.from,
          from: msg.to
        })
      ])
      apiStatus(res, 'Email sent', 200);

    } catch (err) {
      console.error(err);
      apiStatus(res, err.message, 500);
    }
  });

  return mcApi;
};
