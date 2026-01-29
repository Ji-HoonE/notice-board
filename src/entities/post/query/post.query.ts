import type { ICreatePostRequest, IPostListRequest, IUpdatePostRequest } from "../model/post.type";
import { postQueryKeys } from "../model/post.queryKey";
import { postApi } from "../api/post.api";
import { useMutation, useQuery, useSuspenseInfiniteQuery } from "@tanstack/react-query";



/**
 * @description 게시글 목록 무한 조회 쿼리
 */
export const usePostListInfiniteQuery = (
    params: Omit<IPostListRequest, 'prevCursor' | 'nextCursor'>
) => {
    return useSuspenseInfiniteQuery({
        queryKey: postQueryKeys.list(params).queryKey,
        queryFn: ({ pageParam }) =>
            postApi.getPostList({
                ...params,
                ...(pageParam && { nextCursor: pageParam }),
            }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) =>
            lastPage.nextCursor ?? undefined,
    })
}

/**
 * @description 게시글 상세 조회 쿼리
 */
export const usePostDetailQuery = (id: string) => {
    return useQuery({
        queryKey: postQueryKeys.detail(id).queryKey,
        queryFn: () => postApi.getPostDetail(id),
        enabled: !!id,
    });
};

/**
 * @description 게시글 작성 뮤테이션
 */
export const useCreatePostMutation = () => {
    return useMutation({
        mutationFn: (data: ICreatePostRequest) => postApi.createPost(data),
    });
};

/**
 * @description 게시글 수정 뮤테이션
 */
export const useUpdatePostMutation = () => {
    return useMutation({
        mutationFn: (data: IUpdatePostRequest) => postApi.updatePost(data),
    });
};

/**
 * @description 게시글 삭제 뮤테이션
 */
export const useDeletePostMutation = () => {
    return useMutation({
        mutationFn: (id: string) => postApi.deletePost(id),
    });
};

/**
 * @description 게시글 전체 삭제 뮤테이션
 */
export const useDeleteAllPostsMutation = () => {
    return useMutation({
        mutationFn: () => postApi.deleteAllPosts(),
    });
};