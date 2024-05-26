import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../../../backend/src/routers";

export const client = createTRPCProxyClient<typeof AppRouter>({
    links: [
        httpBatchLink({
            url: "http://localhost:3001/trpc",
            fetch(url, options) {
                return fetch(url, {
                    ...options,
                    credentials: "include",
                });
            },
        }),
    ],
});
