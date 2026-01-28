import type { IPostListRequest } from "../model/post.type";
import { postQueryKeys } from "../model/post.queryKey";
import { postApi } from "../api/post.api";
import { useSuspenseQuery } from "@tanstack/react-query";

export const usePostListQuery = (params: IPostListRequest) => {
    return useSuspenseQuery({
        queryKey: postQueryKeys.list(params).queryKey,
        queryFn: () => postApi.getPostList(params),
    });
};