import { FORBIDDEN_WORDS } from "@/shared/constants/post.constants"
import type { PostCategory } from "@/shared/model/common.type"
import z from "zod"

export const POST_CATEGORIES: [PostCategory, ...PostCategory[]] = ['NOTICE', 'QNA', 'FREE']

/**
 * @description 게시글 목록 필터 스키마
 */
export const postListFilterSchema = z.object({
    search: z.string().optional(),
    sort: z.enum(['createdAt', 'title']),
    order: z.enum(['asc', 'desc']),
    category: z.enum(POST_CATEGORIES),
    date: z.string(),
})
/**
 * @description 게시글 폼 스키마
 */
export const postFormSchema = z.object({
    title: z.string().min(1, '제목을 입력해주세요').max(80, '제목은 80자 이하여야 합니다'),
    body: z
        .string()
        .min(1, '본문을 입력해주세요')
        .max(2000, '본문은 2000자 이하여야 합니다')
        .refine(
            (value) =>
                !FORBIDDEN_WORDS.some((word) => value.includes(word)),
            {
                message: '금칙어가 포함되어 있어 등록할 수 없습니다.',
            }
        ),
    category: z.enum(POST_CATEGORIES),
    tags: z.array(z.string().max(24, '태그는 24자 이하여야 합니다')).max(5, '태그는 최대 5개까지 추가할 수 있습니다').optional(),
})

export type PostListFilterData = z.infer<typeof postListFilterSchema>
export type PostFormData = z.infer<typeof postFormSchema>