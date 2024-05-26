import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/shadcn/ui/dialog";
import { ReactNode } from "react";
import { ITodo } from "../../../backend/src/types/types";
import { DateTime } from "luxon";

export default function TodoViewer({ children, data }: { children: ReactNode; data: ITodo }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogTitle>{data.title}</DialogTitle>
                <span className="text-sm">
                    {DateTime.fromMillis(Date.parse(data.createdAt)).toFormat("hh:mm a, dd LLL yyyy")} | {data.completed ? "Completed" : "Uncompleted"}
                </span>
                <DialogDescription>{data.description}</DialogDescription>
            </DialogContent>
        </Dialog>
    );
}
