'use client'

import { useState, useTransition } from 'react'
import { Plus, UserX, ShieldOff, ShieldCheck, CheckCircle2, X } from 'lucide-react'
import { createUser, deleteUser, toggleUserRole } from './actions'
import { useRouter } from 'next/navigation'

export type UserRow = {
  id: string
  email: string
  role: string
  created_at: string
}

export function UsersTable({ users }: { users: UserRow[] }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  function reset() {
    setEmail('')
    setPassword('')
    setDisplayName('')
    setIsAdmin(false)
    setFormError(null)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    startTransition(async () => {
      const res = await createUser({ email, password, displayName, isAdmin })
      if (res?.error) {
        setFormError(res.error)
        return
      }
      reset()
      setOpen(false)
      router.refresh()
    })
  }

  async function onDelete(id: string) {
    if (!confirm('Deletar usuário? Esta ação é irreversível.')) return
    startTransition(async () => {
      const res = await deleteUser(id)
      if (res?.error) alert(res.error)
      router.refresh()
    })
  }

  async function onToggleRole(id: string, role: string) {
    const action = role === 'admin' ? 'remover a permissão de administrador' : 'promover a administrador'
    if (!confirm(`Deseja ${action} deste usuário?`)) return
    startTransition(async () => {
      const res = await toggleUserRole(id, role)
      if (res?.error) alert(res.error)
      router.refresh()
    })
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-8 border-b border-gray-200 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-gray-900 mb-1">Usuários</h2>
            <p className="text-gray-500 text-sm">
              Gerencie os usuários do sistema, suas permissões e status de acesso
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-roof-red text-white rounded-md px-5 py-2.5 text-sm font-bold hover:bg-red-700 transition-colors"
          >
            <Plus size={16} />
            Novo Usuário
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left text-gray-600 text-xs font-semibold uppercase tracking-wider px-8 py-4">Usuário</th>
              <th className="text-left text-gray-600 text-xs font-semibold uppercase tracking-wider px-8 py-4">Role</th>
              <th className="text-left text-gray-600 text-xs font-semibold uppercase tracking-wider px-8 py-4">Status</th>
              <th className="text-left text-gray-600 text-xs font-semibold uppercase tracking-wider px-8 py-4">Criado em</th>
              <th className="text-right text-gray-600 text-xs font-semibold uppercase tracking-wider px-8 py-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100 last:border-b-0">
                <td className="px-8 py-5 text-gray-900 text-sm font-medium">{u.email}</td>
                <td className="px-8 py-5">
                  <span className="bg-roof-red text-white rounded-md text-xs px-3 py-1 font-bold uppercase">
                    {u.role}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span className="inline-flex items-center gap-1 rounded-md text-xs px-2.5 py-1 font-bold uppercase bg-green-100 text-green-700">
                    <CheckCircle2 size={12} />
                    Ativo
                  </span>
                </td>
                <td className="px-8 py-5 text-gray-500 text-sm">
                  {new Date(u.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onToggleRole(u.id, u.role)}
                      disabled={pending}
                      title={u.role === 'admin' ? 'Remover permissão de admin' : 'Promover a admin'}
                      className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                    >
                      {u.role === 'admin' ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                    </button>
                    <button
                      onClick={() => onDelete(u.id)}
                      disabled={pending}
                      title="Deletar"
                      className="p-2 text-gray-500 hover:text-roof-red hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                    >
                      <UserX size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={submit}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="flex items-start justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="font-display text-2xl text-gray-900">Criar Novo Usuário</h3>
                <p className="text-gray-500 text-sm mt-1">Preencha os dados para criar um novo usuário no sistema.</p>
              </div>
              <button
                type="button"
                onClick={() => { reset(); setOpen(false) }}
                className="text-gray-400 hover:text-gray-700"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Email <span className="text-roof-red">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@email.com"
                  className="w-full bg-white text-gray-900 text-sm px-3 py-2.5 border border-gray-300 rounded-md outline-none focus:border-roof-red"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Senha <span className="text-roof-red">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-white text-gray-900 text-sm px-3 py-2.5 border border-gray-300 rounded-md outline-none focus:border-roof-red"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Nome de Exibição</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nome do usuário"
                  className="w-full bg-white text-gray-900 text-sm px-3 py-2.5 border border-gray-300 rounded-md outline-none focus:border-roof-red"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="accent-roof-red w-4 h-4"
                />
                <span className="text-gray-700 text-sm">Criar como Administrador</span>
              </label>
              {formError && <p className="text-roof-red text-sm">{formError}</p>}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => { reset(); setOpen(false) }}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={pending}
                className="px-5 py-2.5 text-sm font-bold text-white bg-roof-red rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {pending ? 'Criando...' : 'Criar Usuário'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
