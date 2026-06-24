import AfricasTalking from 'africastalking';
import { config } from '../config/config';

const at = AfricasTalking({
  apiKey:   config.AT_API_KEY,
  username: config.AT_USERNAME,
});

const sms = at.SMS;

export async function sendSMS(to: string, message: string): Promise<void> {
  await sms.send({
    to:      [to],
    message,
    from:    config.AT_SENDER_ID,
  });
}
