'use client'

import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import TaskStatusManager from '../../components/TaskStatusManager'
import BackupManager from '../../components/BackupManager'

export default function AdminPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4} textAlign="center">
        <Typography variant="h3" fontWeight={700} gutterBottom>
          🛠️ 관리자 페이지
        </Typography>
        <Typography variant="h6" color="text.secondary">
          시스템 관리 도구 모음
        </Typography>
      </Box>

      <BackupManager />
      <TaskStatusManager />
    </Container>
  )
}
