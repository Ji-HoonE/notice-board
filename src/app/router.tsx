import LoginPage from "@/pages/login/LoginPage"
import AuthGuard from "@/shared/lib/AuthGuard"
import ErrorBoundary from "@/shared/lib/ErrorBoundary"
import { ROUTER_PATH } from "@/shared/constants/path.constants"
import { createBrowserRouter, Navigate } from "react-router"
import PostsPage from "@/pages/posts/PostsPage"
import DataPage from "@/pages/data/DataPage"

export const router = createBrowserRouter([
    {
        path: ROUTER_PATH.ROOT,
        element: <Navigate to={ROUTER_PATH.LOGIN} replace />,
    },
    {
        path: ROUTER_PATH.LOGIN,
        element: <LoginPage />,
    },
    {
        element: <AuthGuard />,
        children: [
            {
                path: ROUTER_PATH.DATA,
                element: <DataPage />,
            },
            {
                path: ROUTER_PATH.POSTS,
                element: <PostsPage />,
                errorElement: <ErrorBoundary />,
            },

        ],
    },
])
