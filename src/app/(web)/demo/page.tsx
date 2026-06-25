"use client";

import { useQuery } from "@tanstack/react-query";

export default function DemoPage() {
    const { data } = useQuery({
        queryKey: ["demo"],
        queryFn: async () => {
            const response = await fetch(
                "https://jsonplaceholder.typicode.com/posts",
            );
            return response.json();
        },
    });

    return <div>DemoPage {JSON.stringify(data)}</div>;
}
