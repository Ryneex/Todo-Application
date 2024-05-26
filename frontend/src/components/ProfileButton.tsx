import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/shadcn/ui/dropdown-menu";
import { IUser } from "../../../backend/src/types/types";
import { BiLogOut } from "react-icons/bi";
import { client } from "@/config/trpc";
import showToastFromResponse from "@/helpers/showToastFromResponse";

export default function ProfileButton({ user }: { user: IUser }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex cursor-pointer items-center justify-center bg-black text-white size-9 sm:size-10 rounded-full">{user.name?.slice(0, 1)}</div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-2">
                <DropdownMenuItem
                    onClick={async () => {
                        const res = client.user.logout.mutate();
                        if ("error" in res) {
                            showToastFromResponse(res);
                        }
                        window.location.pathname = "/";
                    }}
                >
                    Logout
                    <DropdownMenuShortcut>
                        <BiLogOut className="ml-3 text-lg" />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={async () => {
                        const res = client.user.delete.mutate();
                        if ("error" in res) {
                            showToastFromResponse(res);
                        }
                        window.location.pathname = "/";
                    }}
                    className=" text-red-500 hover:!text-red-500 dark:text-red-400 dark:hover:!text-red-400"
                >
                    Delete Account
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
