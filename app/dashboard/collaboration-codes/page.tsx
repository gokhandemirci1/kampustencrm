'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, X, Check, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface CollaborationCode {
  id: string
  code: string
  isActive: boolean
  createdAt: string
}

export default function CollaborationCodesPage() {
  const [codes, setCodes] = useState<CollaborationCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCode, setSelectedCode] = useState<CollaborationCode | null>(null)
  const [newCode, setNewCode] = useState('')
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (session && !session.user.canManageCollaborationCodes) {
      router.push('/dashboard')
      return
    }
    if (status === 'authenticated') {
      fetchCodes()
    }
  }, [status, session, router])

  const fetchCodes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/collaboration-codes')
      if (response.ok) {
        const data = await response.json()
        setCodes(data)
      }
    } catch (error) {
      console.error('Error fetching codes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCode.trim()) return

    try {
      const response = await fetch('/api/collaboration-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: newCode.trim() }),
      })

      if (response.ok) {
        setShowModal(false)
        setNewCode('')
        fetchCodes()
      } else {
        const error = await response.json()
        alert(error.error || 'Kod eklenemedi')
      }
    } catch (error) {
      console.error('Error creating code:', error)
      alert('Bir hata oluştu')
    }
  }

  const handleDelete = async () => {
    if (!selectedCode) return

    try {
      const response = await fetch(`/api/collaboration-codes/${selectedCode.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setShowDeleteModal(false)
        setSelectedCode(null)
        fetchCodes()
      } else {
        alert('Kod silinemedi')
      }
    } catch (error) {
      console.error('Error deleting code:', error)
      alert('Bir hata oluştu')
    }
  }

  const handleToggleActive = async (code: CollaborationCode) => {
    try {
      const response = await fetch(`/api/collaboration-codes/${code.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !code.isActive }),
      })

      if (response.ok) {
        fetchCodes()
      } else {
        alert('Kod güncellenemedi')
      }
    } catch (error) {
      console.error('Error updating code:', error)
      alert('Bir hata oluştu')
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    )
  }

  if (!session?.user.canManageCollaborationCodes) {
    return null
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">İşbirliği Kodları</h1>
          <p className="text-gray-600 mt-2">İşbirliği kodlarını ekleyin ve yönetin</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Yeni Kod Ekle</span>
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
                    Kod
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oluşturulma Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {codes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Henüz kod eklenmemiş
                    </td>
                  </tr>
                ) : (
                  codes.map((code) => (
                    <tr key={code.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 font-mono">
                          {code.code}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(code)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            code.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {code.isActive ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Aktif
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3 mr-1" />
                              Pasif
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(code.createdAt).toLocaleDateString('tr-TR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedCode(code)
                            setShowDeleteModal(true)
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Code Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Yeni İşbirliği Kodu Ekle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kod *
                </label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="Örn: KAMPUS2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setNewCode('')
                  }}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Kodu Sil</h2>
            <p className="text-gray-600 mb-4">
              <span className="font-mono font-bold">{selectedCode.code}</span> kodunu silmek istediğinize emin misiniz?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedCode(null)
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
