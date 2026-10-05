import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { publishDueScheduledStories } from '@/server/services/story';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.AUTH_SECRET || 'secret';

  // Protect cron endpoint
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const publishedCount = await publishDueScheduledStories();

    if (publishedCount > 0) {
      revalidatePath('/');
      revalidatePath('/stories');
    }

    return NextResponse.json({
      success: true,
      published: publishedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Scheduled publish failed:', err);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
