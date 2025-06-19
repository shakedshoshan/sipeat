import { createContactHandler } from '@/api/CreateContact';

export async function POST(req: Request) {
  return createContactHandler(req);
} 