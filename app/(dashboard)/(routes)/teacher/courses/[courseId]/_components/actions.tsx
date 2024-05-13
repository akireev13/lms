"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti";
import axios from "axios";
import { Trash, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
    
    const [isLoading, setIsLoading] = useState(false);
    const confetti = useConfettiStore();
    const router = useRouter();

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}`);
            toast.success("Course deleted");
            router.refresh();
            router.push(`/teacher/courses`);
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
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success("Course unpublished!");
            }
            else {
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Course published!");
                confetti.onOpen();
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
 
export default Actions;