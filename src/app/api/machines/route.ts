import { createMachineHandler } from '@/api/CreateMachine';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  return createMachineHandler(req);
}

export const runtime = 'nodejs'; 