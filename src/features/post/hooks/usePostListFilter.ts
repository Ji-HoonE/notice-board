import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { useEffect, useState } from "react"
import { postListFilterSchema, type PostListFilterData } from "../model/post.type"

/**
 * @description 게시판 목록 필터 커스텀 훅
 */
const usePostListFilter = () => {
    const today = new Date()
    const formattedToday = today.toISOString().split('T')[0]
    const { control, register } = useForm<PostListFilterData>({
        resolver: zodResolver(postListFilterSchema),
        defaultValues: {
            search: '',
            sort: '',
            order: '',
            category: '',
            date: formattedToday,
        },
    })
    const search = useWatch({ control, name: "search" })
    const sort = useWatch({ control, name: "sort", defaultValue: '' })
    const order = useWatch({ control, name: "order", defaultValue: '' })
    const category = useWatch({ control, name: "category", defaultValue: '' })
    const date = useWatch({ control, name: "date", defaultValue: formattedToday })
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