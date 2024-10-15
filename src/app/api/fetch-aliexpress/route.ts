import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  language: z.string(),
  url: z.string().url(),
  source: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { language, url, source } = requestSchema.parse(body);

    console.log('Language:', language);
    console.log('URL:', url);
    console.log('Source:', source);

    return NextResponse.json({
      message: 'Data received and logged successfully',
      clientData: {
        language,
        url,
        source,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
