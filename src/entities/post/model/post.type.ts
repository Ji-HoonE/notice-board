import type { PostCategory } from "@/shared/model/common.type"

/** 내 포스트 목록 조회 Api 요청 인터페이스 */
export interface IPostListRequest {
    limit: number
    prevCursor: number
    nextCursor: string
    sort: string
    order: string
    category: PostCategory
    from: string
    to: string
    search: string
}

/** 내 포스트 목록 조회 Api 응답 인터페이스 */
export interface IPostListResponse {
    items: IPostItems[],
    nextCursor: string
    prevCursor: string
}

export interface IPostItems {
    id: string
    userId: string
    title: string
    body: string
    category: PostCategory
    tags: string[]
    createdAt: string
}