import { useState, useRef, useCallback, useEffect } from "react"

/**
 * 컬럼 너비 조절 훅의 옵션 인터페이스
 */
interface UseColumnResizeOptions {
    /** 컬럼 키 목록 */
    columnKeys: string[]
    /** 각 컬럼의 초기 너비 (퍼센트). 지정하지 않으면 균등 분배 */
    initialWidths?: Record<string, number>
    /** 최소 컬럼 너비 (퍼센트, 기본값: 5) */
    minWidth?: number
    /** 최대 컬럼 너비 (퍼센트, 기본값: 80) */
    maxWidth?: number
}



/**
 * 테이블 컬럼의 너비를 조절할 수 있는 커스텀 훅
 * @param options - 컬럼 너비 조절 옵션
 * @returns 컬럼 너비 상태 및 리사이즈 핸들러
 * ```
 */
export const useColumnResize = ({
    columnKeys,
    initialWidths,
    minWidth = 5,
    maxWidth = 80,
}: UseColumnResizeOptions) => {
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
        if (initialWidths) {
            return columnKeys.reduce((acc, columnKey) => {
                acc[columnKey] = initialWidths[columnKey] ?? 100 / columnKeys.length
                return acc
            }, {} as Record<string, number>)
        }
        const initialWidth = 100 / columnKeys.length
        return columnKeys.reduce((acc, columnKey) => {
            acc[columnKey] = initialWidth
            return acc
        }, {} as Record<string, number>)
    })

    /**  현재 리사이징 중인 컬럼의 키 */
    const [isResizing, setIsResizing] = useState<string | null>(null)
    /** 리사이즈 시작 시점의 마우스 X 좌표 */
    const [resizeStartX, setResizeStartX] = useState(0)
    /** 리사이즈 시작 시점의 컬럼 너비 */
    const [resizeStartWidth, setResizeStartWidth] = useState(0)
    /** 테이블 컨테이너의 ref (테이블 너비 계산에 사용) */
    const tableRef = useRef<HTMLDivElement>(null)

    /** 컬럼 리사이즈 핸들에 마우스를 눌렀을 때 호출되는 핸들러 */
    const handleMouseDown = useCallback(
        (columnKey: string, e: React.MouseEvent) => {
            e.preventDefault()
            setIsResizing(columnKey)
            setResizeStartX(e.clientX)
            setResizeStartWidth(columnWidths[columnKey])
        },
        [columnWidths]
    )

    /** 마우스 이동 및 업 이벤트를 처리하는 effect */
    useEffect(() => {
        if (!isResizing) return
        /** 마우스 이동 이벤트 핸들러 */
        const handleMouseMove = (e: MouseEvent) => {
            if (!tableRef.current) return
            const tableWidth = tableRef.current.offsetWidth
            const deltaX = e.clientX - resizeStartX
            const deltaPercent = (deltaX / tableWidth) * 100
            setColumnWidths((prev) => {
                const newWidths = { ...prev }
                const currentIndex = columnKeys.findIndex((col) => col === isResizing)
                if (currentIndex === -1) return prev
                const currentColumnKey = columnKeys[currentIndex]
                const nextColumnKey = columnKeys[currentIndex + 1]
                if (!nextColumnKey) return prev
                const totalWidth = prev[currentColumnKey] + prev[nextColumnKey]
                const adjustedCurrentWidth = Math.max(
                    minWidth,
                    Math.min(maxWidth, resizeStartWidth + deltaPercent)
                )
                const adjustedNextWidth = totalWidth - adjustedCurrentWidth
                if (
                    adjustedNextWidth >= minWidth &&
                    adjustedNextWidth <= maxWidth
                ) {
                    newWidths[currentColumnKey] = adjustedCurrentWidth
                    newWidths[nextColumnKey] = adjustedNextWidth
                }

                return newWidths
            })
        }
        /** 마우스 업 이벤트 핸들러 */
        const handleMouseUp = () => {
            setIsResizing(null)
        }
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
        return () => {
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
        }
    }, [isResizing, resizeStartX, resizeStartWidth, columnKeys, minWidth, maxWidth])

    return {
        columnWidths,
        tableRef,
        isResizing,
        handleMouseDown,
    }
}
