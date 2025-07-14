import { Request, Response } from 'express';
import Course from '../models/courseModel';
import { uuid } from 'uuidv4';
import { getAuth } from '@clerk/express';

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

export const createCourse = async (req: Request, res: Response): Promise<void> => {


    try {
        const { teacherId, teacherName } = req.body;


        if(!teacherId || !teacherName) {
            res.status(400).json({ message: "Teacher id and name a required"});
            return;
        }

        const newCourse = new Course({
            courseId: uuid(),
            teacherId,
            teacherName,
            title: "Untitled Course",
            description: "",
            category: "Uncategorized",
            image: "",
            price: 0,
            level: "Beginner",
            status: "Draft",
            sections: [],
            entrollments: []
        })

        await newCourse.save();

        res.json({ message: "Course created successfully", data: newCourse })
    } catch (error) {
        res.status(500).json({ message: "Error creating course", error})
    }  
}

export const updateCourse = async (req: Request, res: Response): Promise<void> => {

    const { courseId } = req.params;

    const updateData = {...req.body};
    const { userId } = getAuth(req);

    try {
        const course = await Course.get(courseId);

        if(!course) {
            res.status(404).json({ message: "Course not found"});
            return
        }

        if(course.teacherId !== userId) {
            res.status(403).json({message: "Not authorized to update this course"})
            return;
        }

        if(updateData.price) {
            const price = parseInt(updateData.price);
            console.log(`price = ${price} !isNaN(price) = ${!isNaN(price)}`)
            if(isNaN(price)){
                res.status(400).json({
                    message: "Invalid price format",
                    error: "Price must be a valid number"})
                return;
            }

            updateData.price = price * 100;
        }

        if(updateData.sections) {
            const sectionsData = typeof updateData.sections === "string"
            ? JSON.parse(updateData.sections)
            : updateData.sections

            updateData.sections = sectionsData.map((section: any) => ({
                ...section,
                sectionId: section.sectionId || uuid(),
                chapters: section.chapters.map((chapter: any) => ({
                    ...chapter,
                    chapterId: chapter.chapterId || uuid()
                }))
            }))
        }

        Object.assign(course, updateData);
        await course.save();

        res.json({ message: "Course updated successfully", data: course })
    } catch (error) {
        res.status(500).json({ message: "Error updating course", error})
    }  
}

export const deleteCourse = async (req: Request, res: Response): Promise<void> => {

    const { courseId } = req.params;
    const { userId } = getAuth(req);

    try {

        const course = await Course.get(courseId);

        if(!course) {
            res.status(404).json({ message: "Course not found"});
            return
        }

        if(course.teacherId !== userId) {
            res.status(403).json({message: "Not authorized to delete this course"})
            return;
        }

        await Course.delete(courseId);

        res.json({ message: "Course deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error deleting course", error})
    }  
}