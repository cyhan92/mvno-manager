import React from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  Chip,
  Alert,
  AlertTitle
} from '@mui/material'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'

const ExcelUploadGuideSection: React.FC = () => {
  return (
    <Card variant="outlined" sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <CloudUploadIcon color="primary" />
          <Typography variant="h6" color="primary.main" fontWeight={600}>
            Excel 파일 업로드 가이드
          </Typography>
        </Box>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip label="1" color="primary" size="small" />
            <Box display="flex" alignItems="center" gap={1}>
              <Typography component="span">상단의</Typography>
              <Chip label="📁 Excel → DB" color="success" size="small" />
              <Typography component="span">버튼 클릭</Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip label="2" color="primary" size="small" />
            <Typography>파일 선택 다이얼로그에서 Excel 파일(.xlsx, .xls) 선택</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip label="3" color="primary" size="small" />
            <Typography>경고 메시지 확인 후 "확인" 클릭</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip label="4" color="primary" size="small" />
            <Typography>업로드 완료 후 자동으로 페이지 새로고침</Typography>
          </Box>
          <Alert severity="warning" sx={{ mt: 2 }}>
            <AlertTitle>주의사항</AlertTitle>
            기존 데이터베이스의 모든 데이터가 삭제되고 Excel 데이터로 교체됩니다!
          </Alert>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ExcelUploadGuideSection
