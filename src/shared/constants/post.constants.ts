
/** 금칙어 목록 */
export const FORBIDDEN_WORDS = ['캄보디아', '프놈펜', '불법체류', '텔레그램'] as const

/** 정렬 옵션 */
export const SORT_OPTIONS = [
    { value: '', label: '선택' },
    { value: 'title', label: '제목' },
    { value: 'createdAt', label: '생성일자' },
]

/** 정렬 순서 옵션 */
export const ORDER_OPTIONS = [
    { value: '', label: '선택' },
    { value: 'asc', label: '오름차순' },
    { value: 'desc', label: '내림차순' },
]

/** 카테고리 옵션 */
export const CATEGORY_OPTIONS = [
    { value: '', label: '선택' },
    { value: 'NOTICE', label: '공지사항' },
    { value: 'QNA', label: '질문' },
    { value: 'FREE', label: '자유게시판' },
]

/** 게시글 테이블 컬럼 */
export const POST_TABLE_COLUMNS = [
    { key: 'title', label: '제목' },
    { key: 'body', label: '본문' },
    { key: 'tags', label: '태그' },
    { key: 'category', label: '카테고리' },
    { key: 'userId', label: '작성자' },
    { key: 'createdAt', label: '작성일' },
    { key: 'actions', label: '작업' },
] as Array<{ key: string; label: string }>