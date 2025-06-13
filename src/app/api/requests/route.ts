import { createRequestHandler } from '@/api/CreateRequest';

export async function POST(req: Request) {
  return createRequestHandler(req);
} 