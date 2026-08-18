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
      // Si el item manda la variante separada o usa el formato ID-KEY
      const itemId = item._id;
      const quantity = item.quantity || 1;

      // Verificamos si tiene una variante asociada (asumiendo que guardas variantKey o viene en el ID)
      // Si en tu carrito el ID viene como "productId_variantKey" usando un guion bajo o un separador único:
      const separatorIndex = itemId.indexOf('_'); // Cambiamos a guion bajo para evitar conflictos con títulos con guiones

      if (separatorIndex !== -1) {
        // --- CASO VARIANTES ---
        const productId = itemId.substring(0, separatorIndex);
        const variantKey = itemId.substring(separatorIndex + 1);

        console.log(`Bajando ${quantity} unidades a la variante [${variantKey}] del producto: ${productId}`);

        // Patch atómico directo al stock de esa variante en Sanity
        await sanityClient
          .patch(productId)
          .dec({ [`variants[_key=="${variantKey}"].stock`]: quantity })
          .commit();
      } else {
        // --- CASO PRODUCTO NORMAL ---
        console.log(`Bajando ${quantity} unidades al stock del producto normal: ${itemId}`);

        await sanityClient
          .patch(itemId)
          .dec({ stock: quantity })
          .commit();
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error al actualizar stock en Sanity:', err);
    return NextResponse.json({ error: err.message || 'Error interno' }, { status: 500 });
  }
}