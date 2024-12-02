"use server";

import Question from "@/models/question.model";
import { connectToDatabase } from "../dbConnect";
import Tag from "@/models/tag.model";

export async function createQuestion(params: any) {
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
  } catch (error) {
    console.log("Error in creating question:", error);
  }
}
