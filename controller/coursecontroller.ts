import type { Request, Response } from "express";
import Course from "../model/courseModel.ts";
import Lesson from "../model/lessionModel.ts";
import { deleteVideo } from "../helper/deleteFiles.ts";

export const creatCourse = async (req: Request, res: Response) => {
  try {
    const { courseName, description, price, isPublished } = req.body;

    if (!courseName) {
      return res.status(400).json({
        success: false,
        message: "Course name is required",
      });
    }

    const slug = courseName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const findAllready = await Course.findOne({
      $or: [{ slug }, { courseName }],
    });
    if (findAllready) {
      return res.status(400).json({
        success: false,
        message: "Course already exists",
      });
    }

    const newCourse = await Course.create({
      courseName,
      description,
      price,
      isPublished,
      slug,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getSingleCourseDetaile = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Course slug is required",
      });
    }
    const course = await Course.findOne({ slug }).populate({
      path: "chapters.lectures",
      model: "Lesson",
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const addnewChepter = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { chapterName } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }
    if (!chapterName) {
      return res.status(400).json({
        success: false,
        message: "Chapter name is required",
      });
    }
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const allready = course?.chapters.find(
      (item) => item.title.toLowerCase() == chapterName.toLowerCase(),
    );

    if (allready) {
      return res.status(400).json({
        success: false,
        message: "Chapter already exists",
      });
    }

    course.chapters.push({
      title: chapterName,
      lectures: [],
    });

    await course.save();

    return res.status(201).json({
      success: true,
      message: "Chapter added successfully",
      data: course,
    });
  } catch (error) {}
};

export const uploadVideolession = async (req: Request, res: Response) => {
  try {
    const courseid = req.params.courseid;
    const { title, chapterId, duration = 0 } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

    const file = req.file as Express.Multer.File;
    const videoUrl = `/videos/${file.filename}`;

    const lesson = await Lesson.create({
      title,
      videoUrl,
      duration,
    });

    const course = await Course.findById(courseid);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const chapter = course.chapters.find(
      (item: any) => item._id.toString() === chapterId,
    );

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    chapter.lectures.push(lesson._id);

    await course.save();
    return res.status(201).json({
      success: true,
      message: "Lesson uploaded successfully",
      data: lesson,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getAllCoruse = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find().select(
      "courseName slug description price",
    );

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const deletOnelesson = async (req: Request, res: Response) => {
  try {
    const courseid = req.params.courseid;
    const { lessonid, chapterId } = req.body;

    if (!lessonid || !chapterId) {
      return res.status(400).json({
        success: false,
        message: "LessonId and ChapterId are required",
      });
    }

    const lesson = await Lesson.findById(lessonid);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const course = await Course.findById(courseid);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    const findchapter = course?.chapters.find(
      (item: any) => item._id.toString() === chapterId,
    );

    if (!findchapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    findchapter.lectures = findchapter?.lectures?.filter(
      (item: any) => item.toString() !== lessonid,
    );

    await deleteVideo(lesson.videoUrl);
    await lesson.deleteOne();
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteChapter = async (req: Request, res: Response) => {
  try {
    const courseid = req.params.courseid;
    const { chapterId } = req.body;
    if (!chapterId) {
      return res.status(400).json({
        success: false,
        message: "ChapterId is required",
      });
    }

    const course = await Course.findById(courseid);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    const chapter = course.chapters.find(
      (item: any) => item._id.toString() === chapterId,
    );
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }
    for (const lessonId of chapter.lectures) {
      const lesson = await Lesson.findById(lessonId);

      if (lesson) {
        await deleteVideo(lesson.videoUrl);
        await lesson.deleteOne();
      }
    }

    course.chapters = course.chapters.filter(
      (item: any) => item._id.toString() !== chapterId,
    );

    await course.save();
    return res.status(200).json({
      success: true,
      message: "Chapter deleted successfully",
    });
  } catch (error : any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCourse = async(req:Request,res:Response)=>{
    try {
      const courseid = req.params.courseid;
    if (!courseid) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const course = await Course.findById(courseid);
  if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

        const lessonIds: string[] = [];
 for (const chapter of course.chapters) {
      for (const lessonId of chapter.lectures) {
        lessonIds.push(lessonId.toString());
      }
    }
  const lessons = await Lesson.find({
      _id: { $in: lessonIds },
    });
  for (const lesson of lessons) {
      await deleteVideo(lesson.videoUrl);
    }
     await Lesson.deleteMany({
      _id: { $in: lessonIds },
    });

        await course.deleteOne();
  return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });


    } catch (error:any) {
         return res.status(500).json({
      success: false,
      message: error.message,
    });
    }
}
