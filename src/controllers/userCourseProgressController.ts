import { Request, Response } from "express";
import { calculateOverallProgress } from '../utils/utils';
import { mergeSections } from "../utils/utils";
import { getAuth } from "@clerk/express";
import UserCourseProgress from "../models/userCourseProgressModel";
import Course from "../models/courseModel";

//Gets all the courses to the related user
export const getUserEntrollerCourses = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { userId } = req.params;

    console.log(`GETTING ENTROLLED COURSES`)

    try {
        const entrolledCourses = await UserCourseProgress.query("userId")
        .eq(userId)
        .exec();

        const courseIds = entrolledCourses.map((item: any) => item.courseId);
        const courses = await Course.batchGet(courseIds);

        res.json({
            message: "Entrolled courses retrieved successfully",
            data: courses
        });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error retrieving entrolled courses", error })
    }
}

export const getUserCourseProgress = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { userId, courseId } = req.params;

    try {
        const progress = await UserCourseProgress.get({userId, courseId})

        res.json({
            message: "Course progress retrieved successfully",
            data: progress
        });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error retrieving course progress", error })
    }
}

export const updateUserCourseProgress  = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { userId, courseId } = req.params;
    const progressData = req.body;

    try {
        let progress = await UserCourseProgress.get({userId, courseId})

        if(!progress) {
            progress = new UserCourseProgress({
                userId,
                courseId,
                entrollmentDate: new Date().toISOString(),
                overallProgress: 0,
                sections: progressData.sections || [],
                lastAccessedTimestamp: new Date().toISOString()
            })
        } else {
            progress.sections = mergeSections(
                progress.sections,
                progressData.sections || []
            );

            progress.lastAccessedTimestamp = new Date().toISOString();
            progress.overallProgress = calculateOverallProgress(progress.sctions);

            await progress.save();
        }

        await progress.save();

        res.json({
            message: "",
            data: progress
        });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error updating uer courses progress", error })
    }
}