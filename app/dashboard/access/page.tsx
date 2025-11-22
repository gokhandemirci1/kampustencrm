'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Save, X, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface User {
  id: string
  email: string
  canManageCustomers: boolean
  canManageFinancial: boolean
  canManageCollaborationCodes: boolean
  canViewCollaborationStats: boolean
  canManageAccess: boolean
  canDeleteUsers: boolean
  createdAt: string
}

export default function AccessPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    canManageCustomers: false,
    canManageFinancial: false,
    canManageCollaborationCodes: false,
    canViewCollaborationStats: false,
    canManageAccess: false,
    canDeleteUsers: false,
  })
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (session && !session.user.canManageAccess) {
      router.push('/dashboard')
      return
    }
    if (status === 'authenticated') {
      fetchUsers()
    }
  }, [status, session, router])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowModal(false)
        setFormData({
          email: '',
          password: '',
          canManageCustomers: false,
          canManageFinancial: false,
          canManageCollaborationCodes: false,
          canViewCollaborationStats: false,
          canManageAccess: false,
          canDeleteUsers: false,
        })
        fetchUsers()
      } else {
        const error = await response.json()
        alert(error.error || 'Kullanıcı eklenemedi')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Bir hata oluştu')
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      password: '',
      canManageCustomers: user.canManageCustomers,
      canManageFinancial: user.canManageFinancial,
      canManageCollaborationCodes: user.canManageCollaborationCodes,
      canViewCollaborationStats: user.canViewCollaborationStats,
      canManageAccess: user.canManageAccess,
      canDeleteUsers: user.canDeleteUsers,
    })
    setShowEditModal(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      const updateData: any = { ...formData }
      if (!updateData.password) {
        delete updateData.password
      }

      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        setShowEditModal(false)
        setEditingUser(null)
        setFormData({
          email: '',
          password: '',
          canManageCustomers: false,
          canManageFinancial: false,
          canManageCollaborationCodes: false,
          canViewCollaborationStats: false,
          canManageAccess: false,
          canDeleteUsers: false,
        })
        fetchUsers()
      } else {
        const error = await response.json()
        alert(error.error || 'Kullanıcı güncellenemedi')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Bir hata oluştu')
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setShowDeleteModal(false)
        setSelectedUser(null)
        fetchUsers()
      } else {
        const error = await response.json()
        alert(error.error || 'Kullanıcı silinemedi')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Bir hata oluştu')
    }
  }

  const canDelete = (user: User) => {
    return session?.user.canDeleteUsers && 
           user.email !== 'gokhan@kampus.com' && 
           user.email !== 'emre@kampus.com'
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    )
  }

  if (!session?.user.canManageAccess) {
    return null
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Erişim Yönetimi</h1>
          <p className="text-gray-600 mt-2">Kullanıcıları ekleyin, yetkilerini düzenleyin ve yönetin</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Yeni Kullanıcı</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-600">Yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    E-posta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Müşteri Yönetimi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Finansal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kod Yönetimi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İstatistikler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Erişim Yönetimi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.email}
                        {(user.email === 'gokhan@kampus.com' || user.email === 'emre@kampus.com') && (
                          <span className="ml-2 text-xs text-gray-500">(Silinemez)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.canManageCustomers
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.canManageCustomers ? 'Var' : 'Yok'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.canManageFinancial
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.canManageFinancial ? 'Var' : 'Yok'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.canManageCollaborationCodes
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.canManageCollaborationCodes ? 'Var' : 'Yok'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.canViewCollaborationStats
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.canViewCollaborationStats ? 'Var' : 'Yok'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.canManageAccess
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.canManageAccess ? 'Var' : 'Yok'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        {canDelete(user) && (
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setShowDeleteModal(true)
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Yeni Kullanıcı Ekle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-3">Yetkiler</h3>
                <div className="space-y-2">
                  {[
                    { key: 'canManageCustomers', label: 'Müşteri Yönetimi' },
                    { key: 'canManageFinancial', label: 'Finansal Veriler' },
                    { key: 'canManageCollaborationCodes', label: 'İşbirliği Kodları Yönetimi' },
                    { key: 'canViewCollaborationStats', label: 'İşbirliği İstatistikleri' },
                    { key: 'canManageAccess', label: 'Erişim Yönetimi' },
                    { key: 'canDeleteUsers', label: 'Kullanıcı Silme Yetkisi' },
                  ].map((permission) => (
                    <label key={permission.key} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData[permission.key as keyof typeof formData] as boolean}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [permission.key]: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{permission.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Kullanıcıyı Düzenle</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yeni Şifre (Değiştirmek istemiyorsanız boş bırakın)
                </label>
                <input
                  type="password"
                  minLength={6}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-3">Yetkiler</h3>
                <div className="space-y-2">
                  {[
                    { key: 'canManageCustomers', label: 'Müşteri Yönetimi' },
                    { key: 'canManageFinancial', label: 'Finansal Veriler' },
                    { key: 'canManageCollaborationCodes', label: 'İşbirliği Kodları Yönetimi' },
                    { key: 'canViewCollaborationStats', label: 'İşbirliği İstatistikleri' },
                    { key: 'canManageAccess', label: 'Erişim Yönetimi' },
                    { key: 'canDeleteUsers', label: 'Kullanıcı Silme Yetkisi' },
                  ].map((permission) => (
                    <label key={permission.key} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData[permission.key as keyof typeof formData] as boolean}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [permission.key]: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{permission.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingUser(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Kullanıcıyı Sil</h2>
            <p className="text-gray-600 mb-4">
              <span className="font-bold">{selectedUser.email}</span> adlı kullanıcıyı silmek istediğinize emin misiniz?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedUser(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
