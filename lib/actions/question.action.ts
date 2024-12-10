"use server";

import Question from "@/models/question.model";
import { connectToDatabase } from "../dbConnect";
import Tag, { ITag } from "@/models/tag.model";
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
} from "./shared.types";
import User, { IUser } from "@/models/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
  await connectToDatabase();

  try {
    const questions = await Question.find({})
      .populate<{ tags: ITag[]; author: IUser }>({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate<{ tags: ITag[]; author: IUser }>({
        path: "author",
        model: User,
        select: "_id name picture",
      })
      .lean() // Convert to plain JS objects
      .sort({ createdAt: -1 });

    // Transform questions to plain objects
    const serializedQuestions = questions.map((question) => ({
      _id: question._id.toString(),
      title: question.title,
      tags: question.tags.map((tag) => ({
        _id: tag._id.toString(), // Directly use the fields from ITag
        name: tag.name,
      })),
      author: {
        _id: question.author._id.toString(), // Directly use the fields from IUser
        name: question.author.name,
        picture: question.author.picture,
      },
      views: question.views,
      upvotes: question.upvotes.length,
      answers: question.answers,
      createdAt: question.createdAt.toISOString(),
    }));

    return { questions: serializedQuestions };
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

export async function getQuestionById(params: GetQuestionByIdParams) {
  await connectToDatabase();

  try {
    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate<{ tags: ITag[]; author: IUser }>({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate<{ tags: ITag[]; author: IUser }>({
        path: "author",
        model: User,
        select: "_id name picture",
      })
      .lean();

    return question;
  } catch (error) {
    console.log("Error in getting question by id:", error);
    throw error;
  }
}
