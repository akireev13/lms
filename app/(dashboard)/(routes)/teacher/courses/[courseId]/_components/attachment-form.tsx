"use client"

import * as z from "zod";
import axios from "axios";
import { PlusCircle, File, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import FileUploader from "@/components/file-upload";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";

interface AttachmentFormProps {
    initialData: Course & {attachments: Attachment[]},
    courseId: string,
}

const formSchema = z.object({
    url: z.string().min(1),

})



const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
    
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success("Course updated!");
            toggleEditing();
            router.refresh(); 
        } catch (e) {
            toast.error("Something went wrong");
        }
    }

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment deleted!"); 
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        }
        finally {
            setDeletingId(null);
        }
    }

    const [isEditing, setIsEditing] = useState(false);

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    }

    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course attachments
                <Button
                    onClick={toggleEditing}
                    variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
            
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add attachments
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0
                        ? (
                            <p className="text-sm mt-2 text-slate-500 italic">
                                No attachments yet
                            </p>
                        )
                        : (
                            <div className="space-y-2">
                                {initialData.attachments.map((attachment) => (
                                    <div
                                        className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                        key={attachment.id}
                                    >
                                        <File className="h-4 w-4 m-2 flex-shrink-0" />
                                        <p className="text-sm line-clamp-1">
                                            {attachment.name}
                                        </p>
                                        {deletingId === attachment.id
                                            ? (
                                            <div className="ml-auto">
                                                <Loader2 className="h-4 w-4 animate-spin"/>
                                            </div>
                                            )
                                            : (
                                                <button
                                                    onClick={() => onDelete(attachment.id)} 
                                                    className="ml-auto hover:opacity-75 transition"> 
                                                    <X className="h-4 w-4"/>
                                                </button>
                                            )
                                        }
                                    </div>
                                ))}

                            </div>   
                        )
                }
                </>
            )}
            {isEditing && (
                <div>
                    <FileUploader
                        endpoint="courseAttachment"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add any resources your students might need
                    </div>
                </div>
            )}
        </div>
     );
}
 
export default AttachmentForm;