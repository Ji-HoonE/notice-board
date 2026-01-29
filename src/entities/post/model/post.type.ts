
/** 내 포스트 목록 조회 Api 요청 인터페이스 */
export interface IPostListRequest {
    limit: number
    prevCursor?: string
    nextCursor?: string
    sort?: string
    order?: string
    category?: string
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
    category: string
    tags: string[]
    createdAt: string
}


/** 게시글 등록 Api 요청 인터페이스 */
export interface ICreatePostRequest {
    title: string
    body: string
    category: string
    tags?: string[]
}

/** 게시글 수정 Api 요청 인터페이스 */
export interface IUpdatePostRequest extends ICreatePostRequest {
    id: string
}

/** 게시글 등록, 수정 Api 응답 인터페이스 */
export interface IWritePostResponse {
    id: string
    userId: string
    title: string
    body: string
    category: string
    tags: string[]
    createdAt: string
}

/** 게시글 삭제 Api 응답 인터페이스 */
export interface IDeletePostResponse {
    ok: boolean
    deleted: number
}