import { useEffect, useState } from 'react'
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Search,
  KeyRound,
  Pencil,
  Trash2,
  RefreshCw,
  Mail,
  Calendar,
  AlertTriangle,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import {
  UserItem,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  adminResetUserPassword,
} from '@/services/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'corretor'>('all')

  // Dialogs state
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [resetPassOpen, setResetPassOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  // Target user for actions
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null)

  // Forms state
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [formRole, setFormRole] = useState<'admin' | 'corretor'>('corretor')
  const [actionLoading, setActionLoading] = useState(false)

  const fetchUsersList = async () => {
    setLoading(true)
    try {
      const list = await getUsers()
      setUsers(list)
    } catch (err: any) {
      toast({
        title: 'Erro ao carregar usuários',
        description: err.message || 'Verifique se você possui permissões de administrador.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsersList()
  }, [])

  // Handler: Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formEmail || !formPassword) return
    if (formPassword.length < 8) {
      toast({
        title: 'Senha muito curta',
        description: 'A senha deve possuir pelo menos 8 caracteres.',
        variant: 'destructive',
      })
      return
    }

    setActionLoading(true)
    try {
      await createUser({
        name: formName.trim() || 'Usuário',
        email: formEmail.trim(),
        password: formPassword,
        role: formRole,
      })
      toast({
        title: 'Usuário cadastrado com sucesso!',
        description: `O usuário ${formEmail} foi adicionado como ${formRole}.`,
      })
      setCreateOpen(false)
      resetForm()
      fetchUsersList()
    } catch (err: any) {
      toast({
        title: 'Falha ao criar usuário',
        description: err.message || 'Erro ao salvar novo registro no backend.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Handler: Open Edit User
  const openEditModal = (u: UserItem) => {
    setSelectedUser(u)
    setFormName(u.name || '')
    setFormEmail(u.email || '')
    setFormRole((u.role as 'admin' | 'corretor') || 'corretor')
    setEditOpen(true)
  }

  // Handler: Save Edit User
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    setActionLoading(true)
    try {
      await updateUser(selectedUser.id, {
        name: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
      })
      toast({
        title: 'Usuário atualizado com sucesso!',
      })
      setEditOpen(false)
      fetchUsersList()
    } catch (err: any) {
      toast({
        title: 'Erro ao atualizar usuário',
        description: err.message || 'Não foi possível salvar as alterações.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Handler: Open Password Reset Modal
  const openResetPasswordModal = (u: UserItem) => {
    setSelectedUser(u)
    setFormPassword('')
    setResetPassOpen(true)
  }

  // Handler: Confirm Password Reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    if (formPassword.length < 8) {
      toast({
        title: 'Senha inválida',
        description: 'A nova senha precisa ter pelo menos 8 caracteres.',
        variant: 'destructive',
      })
      return
    }

    setActionLoading(true)
    try {
      await adminResetUserPassword(selectedUser.id, formPassword)
      toast({
        title: 'Senha alterada com sucesso!',
        description: `A nova senha para ${selectedUser.email} foi salva com sucesso.`,
      })
      setResetPassOpen(false)
      setFormPassword('')
    } catch (err: any) {
      toast({
        title: 'Erro ao alterar senha',
        description: err.message || 'Falha ao redefinir a credencial do usuário.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Handler: Open Delete Confirm
  const openDeleteModal = (u: UserItem) => {
    setSelectedUser(u)
    setDeleteConfirmOpen(true)
  }

  // Handler: Confirm Delete
  const handleDeleteUser = async () => {
    if (!selectedUser) return
    if (selectedUser.id === currentUser?.id) {
      toast({
        title: 'Ação não permitida',
        description:
          'Você não pode apagar sua própria conta de administrador enquanto estiver conectado.',
        variant: 'destructive',
      })
      return
    }

    setActionLoading(true)
    try {
      await deleteUser(selectedUser.id)
      toast({
        title: 'Usuário excluído',
        description: `A conta de ${selectedUser.email} foi removida definitivamente.`,
      })
      setDeleteConfirmOpen(false)
      fetchUsersList()
    } catch (err: any) {
      toast({
        title: 'Erro ao excluir usuário',
        description: err.message || 'Não foi possível apagar o usuário.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const resetForm = () => {
    setFormName('')
    setFormEmail('')
    setFormPassword('')
    setFormRole('corretor')
    setSelectedUser(null)
  }

  // Filter users
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase()
    const matchesTerm =
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term))
    const matchesRole =
      roleFilter === 'all'
        ? true
        : roleFilter === 'admin'
          ? u.role === 'admin' || u.email === 'pauloac1000@gmail.com'
          : u.role !== 'admin' && u.email !== 'pauloac1000@gmail.com'

    return matchesTerm && matchesRole
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Gestão de Usuários e Acessos
            </h1>
            <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 gap-1 text-[11px]">
              <Shield className="h-3 w-3" />
              Painel Admin
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Gerencie os corretores e administradores com permissão de acesso à plataforma
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsersList}
            disabled={loading}
            className="border-slate-800 text-slate-300 hover:bg-slate-800 gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button
            size="sm"
            onClick={() => {
              resetForm()
              setCreateOpen(true)
            }}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold hover:from-amber-400 hover:to-amber-500 gap-1.5 shadow-sm"
          >
            <UserPlus className="h-4 w-4" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Total de Usuários</p>
              <h3 className="text-2xl font-bold text-white mt-1">{users.length}</h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Administradores</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-1">
                {
                  users.filter((u) => u.role === 'admin' || u.email === 'pauloac1000@gmail.com')
                    .length
                }
              </h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Corretores Ativos</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">
                {
                  users.filter((u) => u.role !== 'admin' && u.email !== 'pauloac1000@gmail.com')
                    .length
                }
              </h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Buscar por nome ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-amber-500"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={roleFilter} onValueChange={(val: any) => setRoleFilter(val)}>
                <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-200">
                  <SelectValue placeholder="Filtrar por Papel" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                  <SelectItem value="all">Todos os papéis</SelectItem>
                  <SelectItem value="admin">Apenas Administradores</SelectItem>
                  <SelectItem value="corretor">Apenas Corretores</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-slate-900 border-slate-800 overflow-hidden">
        <CardHeader className="p-4 border-b border-slate-800">
          <CardTitle className="text-base text-white">Lista de Contas Cadastradas</CardTitle>
          <CardDescription className="text-xs text-slate-400">
            {filteredUsers.length} usuário(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Usuário
                  </th>
                  <th scope="col" className="px-4 py-3">
                    E-mail
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Papel / Função
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Criado em
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-amber-400" />
                      Carregando usuários do sistema...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      Nenhum usuário localizado com os filtros atuais.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isAdminUser = u.role === 'admin' || u.email === 'pauloac1000@gmail.com'
                    const isSelf = u.id === currentUser?.id

                    return (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-amber-400">
                              {u.name ? u.name.substring(0, 2).toUpperCase() : 'US'}
                            </div>
                            <div>
                              <p className="font-medium text-white flex items-center gap-1.5">
                                {u.name || 'Sem nome'}
                                {isSelf && (
                                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded border border-slate-700">
                                    você
                                  </span>
                                )}
                              </p>
                              <span className="text-xs text-slate-500 font-mono">ID: {u.id}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Mail className="h-3.5 w-3.5 text-slate-500" />
                            <span>{u.email}</span>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          {isAdminUser ? (
                            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30 gap-1 font-semibold text-xs">
                              <ShieldCheck className="h-3 w-3" />
                              Administrador
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-slate-800 text-slate-300 border border-slate-700 font-normal text-xs"
                            >
                              Corretor
                            </Badge>
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-xs text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-500" />
                            <span>
                              {u.created
                                ? new Date(u.created).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                  })
                                : '—'}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openResetPasswordModal(u)}
                              title="Redefinir senha"
                              className="h-8 px-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                            >
                              <KeyRound className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(u)}
                              title="Editar usuário"
                              className="h-8 px-2 text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isSelf}
                              onClick={() => openDeleteModal(u)}
                              title={
                                isSelf
                                  ? 'Você não pode excluir sua própria conta'
                                  : 'Apagar usuário'
                              }
                              className="h-8 px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal: Criar Usuário */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-amber-400" />
              Novo Usuário
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Cadastre um novo usuário com perfil de administrador ou corretor no sistema.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">Nome Completo</Label>
              <Input
                placeholder="Ex: João Silva"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">E-mail Corporativo</Label>
              <Input
                type="email"
                placeholder="usuario@empresa.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">Senha Inicial</Label>
              <Input
                type="password"
                placeholder="Mínimo de 8 caracteres"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100"
                required
                minLength={8}
              />
              <p className="text-[11px] text-slate-500">
                O usuário poderá redefinir essa senha posteriormente.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">Papel / Nível de Acesso</Label>
              <Select value={formRole} onValueChange={(val: any) => setFormRole(val)}>
                <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                  <SelectItem value="corretor">
                    <span className="font-medium text-white">Corretor</span> — Acesso a imóveis,
                    leads e radar
                  </SelectItem>
                  <SelectItem value="admin">
                    <span className="font-medium text-amber-400">Administrador</span> — Acesso total
                    e gestão de usuários
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setCreateOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={actionLoading}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500"
              >
                {actionLoading ? 'Salvando...' : 'Cadastrar Usuário'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Editar Usuário */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Pencil className="h-5 w-5 text-amber-400" />
              Editar Usuário
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Atualize o nome, e-mail ou nível de acesso de{' '}
              {selectedUser?.name || selectedUser?.email}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditUser} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">Nome Completo</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">E-mail</Label>
              <Input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">Papel / Nível de Acesso</Label>
              <Select value={formRole} onValueChange={(val: any) => setFormRole(val)}>
                <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                  <SelectItem value="corretor">Corretor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={actionLoading}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500"
              >
                {actionLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Redefinir Senha */}
      <Dialog open={resetPassOpen} onOpenChange={setResetPassOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-amber-400" />
              Redefinir Senha do Usuário
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Defina uma nova senha para a conta{' '}
              <strong className="text-white">{selectedUser?.email}</strong>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleResetPassword} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">Nova Senha</Label>
              <Input
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100"
                required
                minLength={8}
              />
              <p className="text-[11px] text-slate-400">
                A nova senha entrará em vigor imediatamente.
              </p>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setResetPassOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={actionLoading}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500"
              >
                {actionLoading ? 'Salvando...' : 'Atualizar Senha'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Confirmar Exclusão */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-rose-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="text-slate-300 text-xs">
              Tem certeza que deseja apagar a conta de{' '}
              <strong className="text-white">{selectedUser?.name || selectedUser?.email}</strong>?
              Esta ação é definitiva e removerá as permissões de acesso deste usuário.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteConfirmOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={actionLoading}
              onClick={handleDeleteUser}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              {actionLoading ? 'Excluindo...' : 'Sim, Apagar Usuário'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
