"use client"

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import FileUploader from "@/components/file-upload";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";

interface ImageFormProps {
    initialData: Course,
    courseId: string,
}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required",
    }),

})



const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
    
    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course updated!");
            toggleEditing();
            router.refresh(); 
        } catch (e) {
            toast.error("Something went wrong");
        }
    }

    const [isEditing, setIsEditing] = useState(false);

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    }

    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course image
                <Button
                    onClick={toggleEditing}
                    variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit image
                        </>
                    )}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add image
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500"/>
                    </div>
                ): (
                        <div className="relative aspect-video mt-2">
                            <Image
                                alt="upload"
                                fill
                                className="object-cover rounded-md"
                                src={initialData.imageUrl}
                            />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUploader
                        endpoint="courseImage"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ imageUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
     );
}
 
export default ImageForm;