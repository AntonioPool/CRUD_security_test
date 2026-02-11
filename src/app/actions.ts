// app/actions.ts
'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres'),
})

export type ActionResult = { success?: boolean; error?: string };

export async function getUsers(): Promise<{users: {id: number; name: string}[]}> {
  const users = await prisma.user.findMany({
    orderBy: { id: 'desc' },
  });
  return { users };
}

export async function createUser(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const name = formData.get('name')?.toString().trim() ?? '';
  const parsed = userSchema.safeParse({ name });
  if (!parsed.success) {
    return { error: parsed.error.message };
  }

  try {
    await prisma.user.create({ data: { name } });
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: 'Error al crear usuario' };
  }
}

export async function updateUser(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = Number(formData.get('id'));
  const name = formData.get('name')?.toString().trim() ?? '';

  if (isNaN(id) || id <= 0) return { error: 'ID inválido~' };
  const parsed = userSchema.safeParse({ name });
  if (!parsed.success) {
    return { error: parsed.error.message };
  }

  try {
    await prisma.user.update({ where: { id }, data: { name } });
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: 'Error al actualizar usuario' };
  }
}

export async function deleteUser(formData: FormData): Promise<ActionResult> {
  const id = Number(formData.get('id'));

  if (isNaN(id) || id <= 0) return { error: 'ID inválido~' };

  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: 'Error al eliminar usuario' };
  }
}