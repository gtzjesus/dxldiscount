import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  try {
    // 1. Obtenemos el userId y el token usando la plantilla 'supabase' que creamos en Clerk
    const session = await auth();
    const userId = session.userId;
    
    if (!userId) {
      return NextResponse.json({ error: 'No estás logueado en Clerk' }, { status: 401 });
    }

    // Obtenemos el token JWT firmado específicamente para Supabase
    const token = await session.getToken({ template: 'supabase' });

    // 2. Creamos el cliente de Supabase pasándole el token en los headers de autorización
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // 3. Intentamos insertar la orden de prueba con los campos originales
    const { data, error } = await supabase
      .from('orders')
      .insert([
        { 
          user_id: userId, 
          amount: 99.99, 
          status: 'test_success' 
        }
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: '¡Conexión Clerk + Supabase validada con éxito!',
      data 
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}