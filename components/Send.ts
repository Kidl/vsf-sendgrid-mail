import { adjustMultistoreApiUrl } from '@vue-storefront/core/lib/multistore';
import config from 'config';
import { TaskQueue } from '@vue-storefront/core/lib/sync'

export const Send = {

  methods: {
    async sendEmail(action: string, body: any) {

      const base = config.api.url.endsWith('/') ? config.api.url : config.api.url+'/'
      const url = adjustMultistoreApiUrl(`${base}api/ext/sendgrid-mails/${action}`)

      try {
        let { code } = await TaskQueue.execute({
          url,
          payload: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(body)
          },
          silent: true
        })
        return code === 200
      } catch (err) {
        console.log(err, 'FAIL')
        return false
      }

    }
  }
};
