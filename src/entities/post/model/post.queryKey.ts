import { createQueryKeys } from '@lukemorales/query-key-factory'
import type { IPostListRequest } from './post.type'

export const postQueryKeys = createQueryKeys('post', {
    list: (params: IPostListRequest) => ['list', params],
    detail: (id: string) => ['detail', id],
})