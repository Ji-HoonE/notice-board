import { POST_TABLE_COLUMNS } from "@/shared/constants/post.constants"
import { useEffect, useMemo, useRef, useState } from "react"

/**
 * @description 테이블 컬럼 숨김 관리 훅
 */
const useTableHideColumn = () => {
    const filterRef = useRef<HTMLDivElement>(null)

    const [isColumnFilterOpen, setIsColumnFilterOpen] = useState(false)

    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
        return POST_TABLE_COLUMNS.reduce((acc, column) => {
            acc[column.key] = true
            return acc
        }, {} as Record<string, boolean>)
    })

    /** 표시할 컬럼 리스트 */
    const visibleColumnsList = useMemo(() => POST_TABLE_COLUMNS.filter(
        (column) => visibleColumns[column.key] !== false
    ), [visibleColumns])

    /** 컬럼 숨김 핸들러 */
    const handleColumnToggle = (columnKey: string) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [columnKey]: !prev[columnKey],
        }))
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsColumnFilterOpen(false)
            }
        }

        if (isColumnFilterOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isColumnFilterOpen])

    return {
        visibleColumns,
        visibleColumnsList,
        handleColumnToggle,
        isColumnFilterOpen,
        filterRef,
        setIsColumnFilterOpen,
    }
}

export default useTableHideColumn