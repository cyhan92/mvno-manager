import React from 'react'
import {
  CloudUpload as CloudUploadIcon,
  TableChart as TableChartIcon,
  Edit as EditIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Storage as StorageIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  PlayArrow as PlayArrowIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material'

const iconMap = {
  CloudUpload: CloudUploadIcon,
  TableChart: TableChartIcon,
  Edit: EditIcon,
  People: PeopleIcon,
  Assignment: AssignmentIcon,
  Warning: WarningIcon,
  Build: BuildIcon,
  CheckCircle: CheckCircleIcon,
  Info: InfoIcon,
  Storage: StorageIcon,
  Schedule: ScheduleIcon,
  TrendingUp: TrendingUpIcon,
  PlayArrow: PlayArrowIcon,
  Lightbulb: LightbulbIcon
}

export const getIcon = (
  iconType: string, 
  color?: 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'error'
) => {
  const IconComponent = iconMap[iconType as keyof typeof iconMap]
  if (!IconComponent) {
    return <InfoIcon color={color} />
  }
  return <IconComponent color={color} />
}
