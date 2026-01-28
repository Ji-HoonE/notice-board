
/**
 * 공통 유틸리티
 */
export class CommonUtil {
    /**
     * @description 오늘 날짜를 YYYY-MM-DD 형식으로 반환
     */
    static getTodayDateYYYYMMDD() {
        const today = new Date()
        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const day = String(today.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }
    /**
     * @description 날짜를 YYYY-MM-DDTHH:mm:ss.SSSZ 형식으로 변환
     */
    static getDateISOString(dateString: string, timeString: string = '00:00:00') {
        const date = new Date(`${dateString}T${timeString}`)
        return date.toISOString()
    }

    /**
     * @description ISO 날짜 문자열을 YYYY-MM-DD 형식으로 변환 (T 뒤는 제거)
     */
    static formatDateOnly(isoString: string): string {
        if (!isoString) return ''
        return isoString.split('T')[0]
    }

    /**
     * @description 카테고리 코드를 한글 라벨로 변환
     */
    static getCategoryLabel(category: string): string {
        const categoryMap: Record<string, string> = {
            NOTICE: '공지사항',
            QNA: '질문',
            FREE: '자유게시판',
        }
        return categoryMap[category] || category
    }
}
