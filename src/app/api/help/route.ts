import HelpTicketEmail from '@emails/HelpEmail';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(
  process.env.RESEND_API_KEY || 're_7m48ZN3z_KphoH4ZWFwPJQT2Vx4mQj9wM',
);

const ticketSchema = z.object({
  type: z.enum(['help', 'feature']),
  message: z.string(),
  email: z.string().email(),
  timestamp: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { type, message, email, timestamp } = ticketSchema.parse(payload);

    await resend.emails.send({
      from: 'help@rapidproductlauncher.ai',
      to: 'hamzacarew@gmail.com',
      subject: `New ${type} request from ${email}`,
      react: HelpTicketEmail({
        userEmail: email,
        requestType: type,
        message: message,
        submittedAt: timestamp,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ticket submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
