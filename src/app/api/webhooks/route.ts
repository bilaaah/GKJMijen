import { NextResponse } from 'next/server';

/**
 * Route Handler Webhook Scaffolding
 * Digunakan jika terdapat integrasi event eksternal atau auth hook Supabase.
 */
export async function POST() {
  return NextResponse.json(
    { message: 'SIM GKJ Mijen Webhook endpoint scaffold' },
    { status: 200 }
  );
}
