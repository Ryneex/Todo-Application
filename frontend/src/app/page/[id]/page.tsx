import { client } from "@/config/trpc";
import { unstable_noStore } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validate } from "uuid";
import Todos from "@/components/Todos";

export default async function page({ params: { id }, searchParams }: any) {
    unstable_noStore();
    try {
        if (typeof Number(id) !== "number") redirect("/");
        const session_id = cookies().get("session_id");
        if (!session_id || !validate(session_id.value)) redirect("/login");
        const res = await client.todo.get.query({ session_id: session_id.value, page: Number(id), filters: searchParams });
        if ("error" in res) redirect("/");
        return <Todos data={res} />;
    } catch (error) {
        redirect("/");
    }
}
