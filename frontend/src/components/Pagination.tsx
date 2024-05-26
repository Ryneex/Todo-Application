"use client";

import { Pagination as Pag, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/shadcn/ui/pagination";
import { useSearchParams } from "next/navigation";

interface IProp {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: IProp) {
    const pagesArray = [];
    if (currentPage === totalPages && currentPage > 2) {
        for (let i = 0; i < 3; i++) {
            pagesArray.unshift(totalPages - i);
        }
    } else if (currentPage > 1) {
        for (let i = 0; i < 3; i++) {
            pagesArray.unshift(currentPage + 1 - i);
        }
    } else {
        for (let i = 0; i < 3; i++) {
            pagesArray.push(i + 1);
        }
    }

    const searchParams = useSearchParams();
    const completed = searchParams.get("completed") || "";

    return (
        <div className="shrink-0 flex justify-center items-center">
            <Pag>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious className={`${currentPage - 1 < 1 && "opacity-60 pointer-events-none"}`} href={`/page/${currentPage - 1}/${completed ? `?completed=${completed}` : ""}`} />
                    </PaginationItem>
                    {pagesArray.map((e) => (
                        <PaginationItem className={`${e > totalPages && "opacity-60 pointer-events-none"}`} key={e}>
                            <PaginationLink className={`${e === currentPage && "pointer-events-none"}`} href={`/page/${e}/${completed ? `?completed=${completed}` : ""}`} isActive={e === currentPage}>
                                {e}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext className={`${currentPage + 1 > totalPages && "opacity-60 pointer-events-none"}`} href={`/page/${currentPage + 1}/${completed ? `?completed=${completed}` : ""}`} />
                    </PaginationItem>
                </PaginationContent>
            </Pag>
        </div>
    );
}
