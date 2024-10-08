import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import { CircleDollarSign, LayoutDashboard, ListChecks, File } from "lucide-react";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachment-form";
import ChaptersForm from "./_components/chapters-form";
import Banner from "@/components/banner";
import Actions from "./_components/actions";

const CourseIdPage = async ({ params }: {
    params: {
        courseId: string,
    }
}) => {
 
    const {userId} = auth();

    if (!userId) {
        return redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId: userId,
        },
        include: {
            attachments: {
                orderBy: {
                    createdAt: "desc",
                },
            },
            chapters: {
                orderBy: {
                    position: "asc",
                },
            },
        },
    })

    if (!course) {
        return redirect("/");
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        }
    })


    const requiredFields = [
        course.title,
        course.imageUrl,
        course.description,
        course.price,
        course.categoryId,  
        course.chapters.some(chapter => chapter.isPublished),
        
    ]

    const totalFieldsN = requiredFields.length
    const completedFieldsN = requiredFields.filter(Boolean).length

    const completionText = `(${completedFieldsN}/${totalFieldsN})`;

    const isComplete = (completedFieldsN == totalFieldsN);

    return (
        <>
            {!course.isPublished && (
                <Banner label="This course is unpublished. It will not be visible to the students."/>
            )}
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="font-medium text-2xl">
                        Course setup
                    </h1>
                    <span className="text-sm text-slate-700">
                        Complete all fields {completionText}
                    </span>
                    </div>
                    <Actions
                        disabled={!isComplete}
                        courseId={params.courseId}
                        isPublished={course.isPublished}
                    />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge
                            icon={LayoutDashboard}
                        />
                        <h2 className="text-xl">
                            Customize your course
                        </h2>
                    </div>
                    <TitleForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <DescriptionForm
                        initialData={course}
                        courseId={course.id}
                    />

                    <ImageForm
                        initialData={course}
                        courseId={course.id}
                    />

                    <CategoryForm
                        initialData={course}
                        courseId={course.id}
                        options={categories.map((category) => ({
                            label: category.name,
                            value: category.id
                        }))}
                    />

                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge
                                icon={ListChecks}
                            />
                            <h2 className="text-xl">
                                Course chapters
                            </h2>
                        </div>
                    
                        <ChaptersForm
                            initialData={course}
                            courseId={course.id}
                        />
                        
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={CircleDollarSign}/>
                            <h2 className="text-xl">
                                Course price
                            </h2>
                        </div>
                        <PriceForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={File}/>
                            <h2 className="text-xl">
                                Resources and attachments
                            </h2>
                        </div>
                        <AttachmentForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                </div>
                
                 
            </div>
            </div>
        </>
     );
}
 
export default CourseIdPage;