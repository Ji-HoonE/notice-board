import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { useEffect, useState } from "react"
import { postListFilterSchema, type PostListFilterData } from "../model/post.type"
import { CommonUtil } from "@/shared/utils/util"



/**
 * @description 게시판 목록 필터 커스텀 훅
 */
const usePostListFilter = () => {
    const { control, register } = useForm<PostListFilterData>({
        resolver: zodResolver(postListFilterSchema),
        defaultValues: {
            search: '',
            sort: 'title',
            order: 'asc',
            category: 'NOTICE',
            date: CommonUtil.getTodayDateYYYYMMDD(),
        },
    })
    const search = useWatch({ control, name: "search" })
    const sort = useWatch({ control, name: "sort", defaultValue: "createdAt" })
    const order = useWatch({ control, name: "order", defaultValue: "desc" })
    const category = useWatch({ control, name: "category", defaultValue: "NOTICE" })
    const date = useWatch({ control, name: "date" })
    const [debouncedSearch, setDebouncedSearch] = useState(search || '')

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search || '')
        }, 500)
        return () => {
            clearTimeout(timer)
        }
    }, [search])

    const filterOptions: PostListFilterData = {
        search: debouncedSearch,
        sort,
        order,
        category,
        date,
    }
    return {
        filterOptions,
        register,
    }
}

export default usePostListFilter