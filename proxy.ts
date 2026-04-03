import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default async function proxy(request: NextRequest) {
  // Only block /orders routes from non-local IPs
  if (request.nextUrl.pathname.startsWith('/orders') || request.nextUrl.pathname.startsWith('/api/orders')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
               request.headers.get('x-real-ip') ||
               '127.0.0.1';

    // Allow localhost/127.0.0.1
    if (ip === '127.0.0.1' || ip === 'localhost') {
      return NextResponse.next();
    }

    // Block external access to orders
    return NextResponse.json(
      { error: '❌ Orders page is only accessible from local network' },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/orders/:path*', '/api/orders/:path*'],
};