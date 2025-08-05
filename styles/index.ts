/* 모든 CSS 모듈을 한번에 import할 수 있는 인덱스 파일 */

// 개별 모듈 import
import ganttLayoutStyles from './gantt-layout.module.css'
import actionItemsStyles from './action-items.module.css'
import treeStructureStyles from './tree-structure.module.css'
import hoverEffectsStyles from './hover-effects.module.css'
import popupStyles from './popup.module.css'
import commonStyles from './common.module.css'

// 모든 스타일을 합친 객체
export const styles = {
  ...ganttLayoutStyles,
  ...actionItemsStyles,
  ...treeStructureStyles,
  ...hoverEffectsStyles,
  ...popupStyles,
  ...commonStyles
}

// 개별 모듈도 export (필요한 경우)
export {
  ganttLayoutStyles,
  actionItemsStyles,
  treeStructureStyles,
  hoverEffectsStyles,
  popupStyles,
  commonStyles
}

// 기본 export
export default styles
