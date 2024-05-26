"use client";

import { Button } from "@/components/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/shadcn/ui/dialog";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { Textarea } from "@/components/shadcn/ui/textarea";
import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { todoValidation } from "@/validations/todo.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { client } from "@/config/trpc";
import { Toaster } from "@/components/shadcn/ui/sonner";
import showToastFromResponse from "@/helpers/showToastFromResponse";
import { ITodo, IUser } from "../../../backend/src/types/types";
import { BsThreeDots } from "react-icons/bs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/shadcn/ui/dropdown-menu";
import Pagination from "./Pagination";
import { useRouter } from "next/navigation";
import { CiFilter } from "react-icons/ci";
import TodoViewer from "./TodoViewer";
import ProfileButton from "./ProfileButton";
import { toast } from "sonner";

interface Prop {
    todos: ITodo[];
    currentPage: number;
    totalPages: number;
    user: IUser;
}

export default function Todos({ data }: { data: Prop }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        resetField,
        setValue,
    } = useForm<z.infer<typeof todoValidation>>({
        resolver: zodResolver(todoValidation),
    });
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<ITodo | null>(null);
    const router = useRouter();

    async function onSubmit(e: z.infer<typeof todoValidation>) {
        setLoading(true);
        // conditionally sending post data
        const res = editingTodo ? await client.todo.update.mutate({ ...e, _id: editingTodo._id }) : await client.todo.create.mutate(e);
        showToastFromResponse(res);
        setLoading(false);
        if ("error" in res) return;
        router.refresh();
        resetField("title");
        resetField("description");
        setIsDialogOpen(false);
        setEditingTodo(null);
    }

    async function deleteTodo(id: string) {
        const res = await client.todo.delete.mutate(id);
        showToastFromResponse(res);
        router.refresh();
    }

    useEffect(() => {
        setValue("title", editingTodo?.title || "");
        setValue("description", editingTodo?.description || "");
    }, [editingTodo, setValue]);

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-slate-100 xl:p-5">
            <Toaster />
            <div className="hidden xl:block fixed xl:top-2 xl:right-2">
                <ProfileButton user={data.user} />
            </div>
            <div className="block xl:hidden fixed bottom-2 left-2">
                <ProfileButton user={data.user} />
            </div>
            <div className="w-full h-full xl:max-w-6xl xl:max-h-[600px] bg-white rounded-xl shadow-sm border flex flex-col p-3 gap-2">
                <div className="shrink-0 flex">
                    <h1 className="font-bold mr-auto flex items-center text-lg">Todos</h1>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 mr-2">
                                <CiFilter /> Filter By
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => router.replace("/?completed=true")}>Filter By Completed</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.replace("/?completed=false")}>Filter By Uncompleted</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.replace("/")}>Filter By None</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog
                        open={isDialogOpen}
                        onOpenChange={(e) => {
                            if (!e) setEditingTodo(null);
                            setIsDialogOpen(e);
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <FaPlus /> Add New
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Add a new Todo</DialogTitle>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                                <div>
                                    <Label>Title</Label>
                                    <Input {...register("title")} placeholder="My Todo" />
                                    {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
                                </div>
                                <div>
                                    <Label>Description</Label>
                                    <Textarea {...register("description")} placeholder="A long description" className="resize-none h-20" />
                                    {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
                                </div>
                                <Button loading={loading} type="submit">
                                    {editingTodo ? "Update" : "Create"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="h-full flex flex-col overflow-hidden">
                    <div className="h-10 shrink-0 flex items-center text-sm font-medium text-black/80 px-3">
                        <div className="flex-1">Title</div>
                        <div className="w-20 text-end pr-1 sm:pr-3">Completed</div>
                        <div className="w-8 text-end"></div>
                    </div>
                    <div className="h-full w-full flex flex-col gap-2 overflow-auto custom-scrollbar">
                        {!data.todos.length ? (
                            <div className="w-full h-full flex items-center justify-center text-sm text-black/60 flex-col font-semibold">
                                <span>You have nothing to do</span>
                                <span>Play Fortnite</span>
                            </div>
                        ) : (
                            data.todos.map((e, i) => (
                                <TodoViewer data={e} key={i}>
                                    <div className="h-10 hover:bg-slate-100 cursor-pointer shrink-0 flex items-center text-sm font-medium text-black/80 border rounded-md">
                                        <div className="flex-1 pl-3 truncate">
                                            <span className="font-bold">{e.title}</span> - <span className="text-black/60">{e.description}</span>
                                        </div>
                                        <div className="w-16 shrink-0 h-full flex items-center pr-1 sm:pr-3 justify-end" onClick={(event) => event.stopPropagation()}>
                                            <span
                                                onClick={async (event) => {
                                                    event.stopPropagation();
                                                    const res = await client.todo.update.mutate({ ...e, completed: !e.completed });
                                                    showToastFromResponse(res);
                                                    if (!("error" in res)) {
                                                        toast.success(res.completed ? "Task has been set to completed" : "Task has been set to uncompleted", { position: "top-center" });
                                                    }
                                                    router.refresh();
                                                }}
                                                className={`rounded-full select-none cursor-pointer py-0.5 px-3 ${e.completed ? "bg-green-200 text-green-700" : "bg-red-200 text-red-500"}`}
                                            >
                                                {JSON.stringify(e.completed)}
                                            </span>
                                        </div>
                                        <div className="w-8 h-full">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <div className="cursor-pointer w-full h-full items-center flex justify-end pr-3">
                                                        <BsThreeDots />
                                                    </div>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            setEditingTodo(e);
                                                            setIsDialogOpen(true);
                                                        }}
                                                    >
                                                        Edit
                                                        <DropdownMenuShortcut>
                                                            <FaTrash />
                                                        </DropdownMenuShortcut>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            deleteTodo(e._id);
                                                        }}
                                                        className="text-red-500"
                                                    >
                                                        Delete
                                                        <DropdownMenuShortcut>
                                                            <FaTrash />
                                                        </DropdownMenuShortcut>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </TodoViewer>
                            ))
                        )}
                    </div>
                    <Pagination currentPage={data.currentPage} totalPages={data.totalPages} />
                </div>
            </div>
        </div>
    );
}
