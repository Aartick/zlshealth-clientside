import formData from 'form-data';
import Mailgun from 'mailgun.js';

/**
 * Send email using Mailgun
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param html - HTML content of the email
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  // Validate environment variables
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;

  if (!apiKey || !domain) {
    const missingVars = [];
    if (!apiKey) missingVars.push('MAILGUN_API_KEY');
    if (!domain) missingVars.push('MAILGUN_DOMAIN');

    console.error(`Missing Mailgun environment variables: ${missingVars.join(', ')}`);
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Log for debugging (first/last 4 chars of API key only)
  console.log('Mailgun Configuration:', {
    domain,
    apiKeyPrefix: apiKey.substring(0, 4),
    apiKeySuffix: apiKey.substring(apiKey.length - 4),
    recipient: to,
  });

  try {
    const mailgun = new Mailgun(formData);

    // Determine API URL based on region (default to US)
    // EU regions need https://api.eu.mailgun.net
    const apiUrl = process.env.MAILGUN_REGION === 'eu'
      ? 'https://api.eu.mailgun.net'
      : 'https://api.mailgun.net';

    console.log('Using Mailgun API URL:', apiUrl);

    // Initialize Mailgun client
    const mg = mailgun.client({
      username: 'api',
      key: apiKey,
      url: apiUrl,
    });

    // Send email
    const result = await mg.messages.create(domain, {
      from: `Zealous Health <noreply@${domain}>`,
      to: [to],
      subject: subject,
      html: html,
    });

    console.log('Email sent successfully:', result);
    return result;
  } catch (error: any) {
    // Enhanced error logging
    if (error.status === 401) {
      console.error('❌ Mailgun 401 Error - Possible causes:');
      console.error('1. Wrong API key - Check you are using the PRIVATE API key (starts with key-)');
      console.error('2. Wrong region - If your domain is in EU, set MAILGUN_REGION=eu in .env');
      console.error('3. Check your API key at: https://app.mailgun.com/settings/api_security');
    }
    if (error.status === 403) {
      console.error('❌ Mailgun 403 Error - Possible causes:');
      console.error('1. Recipient not authorized for sandbox domain');
      console.error('2. Go to: Sending → Domains → [Your Domain] → Authorized Recipients');
      console.error(`3. Add and verify: ${to}`);
    }
    console.error('Error sending email:', error);
    throw error;
  }
}
