import React from 'react'
import AdminPanel from '../../pages/AdminPanel'

const UsersPage = () => {
  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      <div className="flex-grow p-6 overflow-auto">
        <AdminPanel/>
      </div>
    </div>
  )
}

export default UsersPage