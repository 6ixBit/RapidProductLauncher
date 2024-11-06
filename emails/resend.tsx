import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_7m48ZN3z_KphoH4ZWFwPJQT2Vx4mQj9wM');

export { resend };
