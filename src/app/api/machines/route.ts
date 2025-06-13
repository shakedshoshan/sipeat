import { createMachineHandler } from '@/api/CreateMachine';

export async function POST(req: Request) {
  return createMachineHandler(req);
} 