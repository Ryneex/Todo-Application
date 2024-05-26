import { toast } from "sonner";

export default function showToastFromResponse(res: unknown) {
    if (res && typeof res === "object") {
        if ("error" in res && typeof res.error === "string") {
            toast.error(res.error);
        }
        if ("success" in res && typeof res.success === "string") {
            toast.success(res.success);
        }
    }
}
