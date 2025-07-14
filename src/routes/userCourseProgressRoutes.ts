import express from "express";
import { getUserCourseProgress, getUserEntrollerCourses, updateUserCourseProgress } from "../controllers/userCourseProgressController";


const router = express.Router();

router.get("/:userId/enrolled-courses", getUserEntrollerCourses);
router.get('/:userId/courses/:courseId', getUserCourseProgress);
router.put("/:userId/courses/:courseId", updateUserCourseProgress);

export default router;