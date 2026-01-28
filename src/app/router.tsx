import HomePage from "@/pages/home/HomePage"
import LoginPage from "@/pages/login/LoginPage"
import { ROUTER_PATH } from "@/shared/constants/path.constants"
import AuthGuard from "@/shared/lib/AuthGuard"
import { createBrowserRouter, Navigate } from "react-router"

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
        path: ROUTER_PATH.HOME,
        element: <AuthGuard><HomePage /></AuthGuard>,
    }
])
