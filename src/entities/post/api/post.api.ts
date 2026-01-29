import { ApiHelper } from "@/shared/api/api.base"
import type { ICreatePostRequest, IDeletePostResponse, IPostItems, IPostListRequest, IPostListResponse, IUpdatePostRequest, IWritePostResponse } from "../model/post.type"
import { API_PATH } from "@/shared/constants/path.constants"

/**
 * @description 로그인 API
 */
export const postApi = {
    getPostList: async (params: IPostListRequest): Promise<IPostListResponse> => {
        const response = await ApiHelper.get<IPostListResponse>(API_PATH.POSTS, {
            params,
        })
        return response
    },
    getPostDetail: async (id: string) => {
        const response = await ApiHelper.get<IPostItems>(`${API_PATH.POSTS}/${id}`)
        return response
    },
    createPost: async (data: ICreatePostRequest) => {
        const response = await ApiHelper.post<IWritePostResponse>(API_PATH.POSTS, data)
        return response
    },
    updatePost: async (data: IUpdatePostRequest) => {
        const { id, ...rest } = data
        const response = await ApiHelper.patch<IWritePostResponse>(`${API_PATH.POSTS}/${id}`, rest)
        return response
    },
    deletePost: async (id: string) => {
        const response = await ApiHelper.delete<IDeletePostResponse>(`${API_PATH.POSTS}/${id}`)
        return response
    },
    deleteAllPosts: async () => {
        const response = await ApiHelper.delete<IDeletePostResponse>(API_PATH.POSTS)
        return response
    }
}