"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}

const ChapterActions = ({ disabled, courseId, chapterId, isPublished }: ChapterActionsProps) => {
    
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
            toast.success("Chapter deleted");
            router.refresh();
            router.push(`/teacher/courses/${courseId}`);
        }
        catch {
            toast.error("Something went wrong");
        }
        finally {
            setIsLoading(false);
        }
    }

    const togglePublish = async () => {
        try {
            setIsLoading(true);
            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
                toast.success("Chapter unpublished!");
            }
            else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
                toast.success("Chapter published!");
            }
            router.refresh();
        }
        catch {
            toast.error("Something went wrong");
        }
        finally {
            setIsLoading(false);
        }
    }

    return ( 
        <div className="flex items-center gap-x-2">
            <Button
                onClick={togglePublish}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <TrashIcon className="h-4 w-4"/>
                </Button>
            </ConfirmModal>
            
        </div>
     );
}
 
export default ChapterActions;