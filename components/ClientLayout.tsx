'use client'

import { ReactNode } from 'react'
import AutoBackupScheduler from './AutoBackupScheduler'

interface ClientLayoutProps {
  children: ReactNode
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <>
      <AutoBackupScheduler />
      {children}
    </>
  )
}

export default ClientLayout
