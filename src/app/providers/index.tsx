import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createBrowserRouter, RouterProvider } from "react-router"



type Props = {
    router: ReturnType<typeof createBrowserRouter>
    client: QueryClient
}

export const Providers = ({ router, client }: Props) => {
    return (
        <QueryClientProvider client={client}>
            <RouterProvider router={router} />
            <ReactQueryDevtools />
        </QueryClientProvider>
    )
}