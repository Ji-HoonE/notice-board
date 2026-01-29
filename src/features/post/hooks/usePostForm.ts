import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { postFormSchema, type PostFormData } from "../model/post.type"
import { useCreatePostMutation, usePostDetailQuery, useUpdatePostMutation } from "@/entities/post/query/post.query"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useModalActions } from "@/shared/model/modal.store"


/**
 * @description 게시글 폼 커스텀 훅
 */
const usePostForm = (id: string) => {
    /** 모달 닫기 액션 */
    const { closeModal } = useModalActions()
    /** 쿼리 클라이언트 */
    const queryClient = useQueryClient()
    /** 게시글 상세 쿼리 */
    const { data: postDetail, isLoading } = usePostDetailQuery(id)
    /** 게시글 생성 뮤테이션 */
    const { mutateAsync: createPost } = useCreatePostMutation()
    /** 게시글 수정 뮤테이션 */
    const { mutateAsync: updatePost } = useUpdatePostMutation()
    /** 폼 상태 */
    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        setValue,
        watch,
    } = useForm<PostFormData>({
        resolver: zodResolver(postFormSchema),
        mode: 'onChange',
        defaultValues: {
            title: '',
            body: '',
            category: '',
            tags: [],
        },
        values: postDetail || undefined,

    })
    /** 태그 입력 상태 */
    const [tagInput, setTagInput] = useState('')

    /** 태그 목록 상태 */
    const tags = useWatch({
        control,
        name: 'tags',
        defaultValue: [],
    })
    /** 태그 추가 핸들러 */
    const handleAddTag = () => {
        const trimmed = tagInput.trim()
        if (!trimmed) return
        const next = Array.from(new Set([...tags, trimmed]))
        setValue('tags', next, { shouldValidate: true, shouldDirty: true })
        setTagInput('')
    }
    /** 태그 제거 핸들러 */
    const handleRemoveTag = (removeTag: string) => {
        const next = tags.filter((t: string) => t !== removeTag)
        setValue('tags', next, { shouldValidate: true, shouldDirty: true })
    }
    /** 게시글 폼 제출 핸들러 */
    const onSubmit = async (data: PostFormData) => {
        try {
            const isEdit = id !== ''
            const response = isEdit
                ? await updatePost({ id, ...data })
                : await createPost(data)

            if (response.id) {
                await queryClient.invalidateQueries({
                    queryKey: ['post', 'list'],
                })
                closeModal('postForm')
            }
        } catch (error) {
            console.error(error)
        }
    }
    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        isValid,
        reset,
        handleAddTag,
        handleRemoveTag,
        tagInput,
        tags,
        setTagInput,
        watch,
        control,
        isLoading,
    }
}

export default usePostForm