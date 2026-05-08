import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function UsersPage() {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()

  const { data: roles } = await supabase
    .from('user_roles')
    .select('*')
    .order('created_at')

  const { data: { users } } = await adminSupabase.auth.admin.listUsers()

  const usersWithRoles = (roles ?? []).map((role) => {
    const authUser = users?.find((u) => u.id === role.user_id)
    return { ...role, email: authUser?.email ?? 'N/A' }
  })

  return (
    <div>
      <PageHeader title="Gerenciamento de Usuários" description="Gerencie os usuários do sistema e suas permissões." />
      <div className="bg-roof-sidebar border border-white/10 max-w-4xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-white font-bold">Usuários</h2>
          <p className="text-white/40 text-xs mt-1">Gerencie os usuários do sistema</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-white/40 text-xs px-6 py-3">Usuário</th>
              <th className="text-left text-white/40 text-xs px-6 py-3">Role</th>
              <th className="text-left text-white/40 text-xs px-6 py-3">Criado em</th>
            </tr>
          </thead>
          <tbody>
            {usersWithRoles.map((user) => (
              <tr key={user.id} className="border-b border-white/5">
                <td className="px-6 py-4 text-white text-sm">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="bg-roof-red text-white text-xs px-2 py-1 font-bold uppercase">{user.role}</span>
                </td>
                <td className="px-6 py-4 text-white/40 text-xs">
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
