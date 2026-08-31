import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const secret = searchParams.get('secret');
  const redirectUrl = searchParams.get('redirect') || '/';

  // Validar el secret contra la variable de entorno
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new NextResponse('Invalid preview secret', { status: 401 });
  }

  // Habilitar draft mode
  const draft = await draftMode();
  draft.enable();

  // Redirigir a la URL solicitada
  redirect(redirectUrl);
}