import { Request, Response } from 'express';
import Course from '../models/courseModel';

//Gets courses of specific category or all courses if category not specified
export const listCourses = async(
    req: Request,
    res: Response
): Promise<void> => {
    const { category } = req.query;

    try {
        const courses = category && category !== 'all'
        ? await Course.scan("category").eq(category).exec()
        : await Course.scan().exec();
        res.json({ message: "Courses retrieved successfully", data: courses })
    } catch (error) {
        res.status(500).json({ message: "Error revrieving courses", error})
    }
}

//Grab single course
export const getCourse = async (req: Request, res: Response): Promise<void> => {
    const { courseId } = req.params;

    try {
        const course = await Course.get(courseId);

        if(!course) {
            res.status(404).json({ message: "Course not found"});
            return;
        }

        res.json({ message: "Course retrieved successfully", data: course })
    } catch (error) {
        res.status(500).json({ message: "Error revrieving course", error})
    }  
}