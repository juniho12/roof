'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function assertCallerIsAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const admin = createAdminClient()
  const { data: role } = await admin
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (role?.role !== 'admin') throw new Error('Acesso negado')
  return { admin, callerId: user.id }
}

export async function createUser(formData: {
  email: string
  password: string
  displayName?: string
  isAdmin: boolean
}) {
  const { admin } = await assertCallerIsAdmin()

  const { data, error } = await admin.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    email_confirm: true,
    user_metadata: formData.displayName ? { display_name: formData.displayName } : undefined,
  })

  if (error) return { error: error.message }
  if (!data.user) return { error: 'Falha ao criar usuário' }

  if (formData.isAdmin) {
    await admin
      .from('user_roles')
      .update({ role: 'admin' })
      .eq('user_id', data.user.id)
  }

  revalidatePath('/admin/users')
  return { ok: true }
}

export async function deleteUser(userId: string) {
  const { admin, callerId } = await assertCallerIsAdmin()
  if (userId === callerId) return { error: 'Você não pode deletar a si mesmo' }

  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) return { error: error.message }

  revalidatePath('/admin/users')
  return { ok: true }
}

export async function toggleUserRole(userId: string, currentRole: string) {
  const { admin, callerId } = await assertCallerIsAdmin()
  if (userId === callerId) return { error: 'Você não pode alterar sua própria permissão' }

  const newRole = currentRole === 'admin' ? 'user' : 'admin'
  const { error } = await admin
    .from('user_roles')
    .update({ role: newRole })
    .eq('user_id', userId)
  if (error) return { error: error.message }

  revalidatePath('/admin/users')
  return { ok: true }
}
