import LoginPage from "@/pages/login/LoginPage"
import AuthGuard from "@/shared/lib/AuthGuard"
import PostErrorBoundary from "@/shared/lib/PostErrorBoundary"
import ChartErrorBoundary from "@/shared/lib/ChartErrorBoundary"
import { ROUTER_PATH } from "@/shared/constants/path.constants"
import { createBrowserRouter, Navigate } from "react-router"
import PostsPage from "@/pages/posts/PostsPage"
import ChartsPage from "@/pages/chart/ChartPage"

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
                path: ROUTER_PATH.CHARTS,
                element: <ChartsPage />,
                errorElement: <ChartErrorBoundary />,
            },
            {
                path: ROUTER_PATH.POSTS,
                element: <PostsPage />,
                errorElement: <PostErrorBoundary />,
            },
        ],
    },
])
