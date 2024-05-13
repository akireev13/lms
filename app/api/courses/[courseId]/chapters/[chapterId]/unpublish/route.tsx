import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: {
        params: {
            courseId: string,
            chapterId: string,
        }
    }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized user", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            }
        })

        if (!courseOwner) {
            return new NextResponse("Unauthorized user", { status: 401 });
        }

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                isPublished: false,
            }
        });

        //todo: better move unpublishing course to another route

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.chapterId,
                isPublished: true,
            }
        });

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false,
                }
            });
        }

        return NextResponse.json(chapter);

    } catch (error) {
        console.log("[CHAPTER_ID_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}