'use server';

import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function createUser(formData: FormData) {
    const name = formData.get('name')?.toString().trim();

    if (!name || name.length < 1 || name.length > 100) {
        return
    } 

    try {
        await prisma.user.create({ data: { name }});
        revalidatePath('/');
        return 
    } catch (error) {
        throw new Error('Error al crear el usuario');
    }
}

export async function updateUser(formData: FormData) {
    const id = Number(formData.get('id'));
    const name = formData.get('name')?.toString().trim();

    if (isNaN(id) || id <= 0) throw new Error('ID inválido');

    if (!name || name.length < 1 || name.length > 100) {
        return
    }
    try {
        await prisma.user.update({
            where: { id: Number(id) },
            data: { name },
        });
        revalidatePath('/');
        return
    } catch (error) {
        throw new Error('Error al actualizar el usuario'); 
    }
}

export async function deleteUser(formData: FormData) {
    const id = Number(formData.get('id'));

    if (isNaN(id) || id <= 0) throw new Error('ID inválido');

    try {
        await prisma.user.delete({
            where: { id },
        });
        revalidatePath('/');
        return
    }
    catch (error) {
        throw new Error('Error al eliminar el usuario');
    }
}