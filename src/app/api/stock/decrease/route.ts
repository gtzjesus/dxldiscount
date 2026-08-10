import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.items || !Array.isArray(body.items)) {
      return NextResponse.json({ error: 'Items inválidos' }, { status: 400 });
    }

    const { items } = body;

    for (const item of items) {
      const productId = item._id;

      if (!productId) {
        console.error('El item no trae _id de Sanity:', item);
        continue;
      }

      console.log(`Bajando ${item.quantity} unidades al stock del producto: ${productId}`);

      await sanityClient
        .patch(productId)
        .dec({ stock: item.quantity })
        .commit();
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error al actualizar stock en Sanity:', err);
    return NextResponse.json({ error: err.message || 'Error interno' }, { status: 500 });
  }
}