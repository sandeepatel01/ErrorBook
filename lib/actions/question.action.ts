"use server";

import Question from "@/models/question.model";
import { connectToDatabase } from "../dbConnect";
import Tag from "@/models/tag.model";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
import User from "@/models/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
  await connectToDatabase();

  try {
    const questions = await Question.find({})
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id name picture",
      })
      .sort({ createdAt: -1 });

    // Transform data to ensure compliance
    const transformedQuestions = questions.map((q) => ({
      _id: q._id.toString(),
      title: q.title,
      tags: q.tags.map((tag) => ({
        _id: tag._id.toString(),
        name: tag.name,
      })),
      author: {
        _id: q.author?._id.toString() || "",
        name: q.author?.name || "Unknown",
        picture: q.author?.picture || "/default-avatar.png",
      },
      views: q.views || 0,
      upvotes: q.upvotes || [],
      answers: q.answers || [],
      createdAt: q.createdAt,
    }));

    return { questions: transformedQuestions };
  } catch (error) {
    console.log("Error in getting questions:", error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  await connectToDatabase();
  try {
    const { title, content, tags, author, path } = params;

    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true },
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // TODO: Create an interaction record for the user's ask_question action
    // TODO: Increment author 's reputation by +5 for creating a question

    revalidatePath(path);
  } catch (error) {
    console.log("Error in creating question:", error);
  }
}
