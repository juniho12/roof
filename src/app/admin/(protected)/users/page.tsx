import { createAdminClient } from '@/lib/supabase/admin'
import { PageHeader } from '@/components/admin/PageHeader'
import { UsersTable, type UserRow } from './UsersTable'

export default async function UsersPage() {
  const adminSupabase = createAdminClient()

  const { data: roles } = await adminSupabase
    .from('user_roles')
    .select('*')
    .order('created_at')

  const { data: { users } } = await adminSupabase.auth.admin.listUsers()

  const rows: UserRow[] = (roles ?? []).map((role) => {
    const authUser = users?.find((u) => u.id === role.user_id)
    return {
      id: role.user_id,
      email: authUser?.email ?? 'N/A',
      role: role.role,
      created_at: role.created_at,
    }
  })

  return (
    <div>
      <PageHeader
        title="Gerenciamento de Usuários"
        description="Gerencie usuários e permissões do sistema"
      />
      <UsersTable users={rows} />
    </div>
  )
}
