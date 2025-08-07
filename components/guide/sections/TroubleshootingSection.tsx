import React from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  Divider
} from '@mui/material'
import { Build as BuildIcon } from '@mui/icons-material'

const TroubleshootingSection: React.FC = () => {
  return (
    <Card variant="outlined" sx={{ bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.300' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <BuildIcon color="action" />
          <Typography variant="h6" color="text.primary" fontWeight={600}>
            문제 해결
          </Typography>
        </Box>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>팝업이 열리지 않음</Typography>
            <Typography variant="body2" color="text.secondary">
              항목을 더블클릭하거나 적절한 요소를 클릭했는지 확인
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>데이터가 표시되지 않음</Typography>
            <Typography variant="body2" color="text.secondary">
              페이지 새로고침 또는 브라우저 캐시 삭제 후 재시도
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>편집이 저장되지 않음</Typography>
            <Typography variant="body2" color="text.secondary">
              네트워크 연결 상태 확인 후 재시도
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>Gantt 차트가 안 보임</Typography>
            <Typography variant="body2" color="text.secondary">
              브라우저 호환성 확인 및 JavaScript 활성화 상태 점검
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default TroubleshootingSection
