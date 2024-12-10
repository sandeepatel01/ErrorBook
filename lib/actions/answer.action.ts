"use server";

import Answer from "@/models/answer.model";
import { CreateAnswerParams } from "./shared.types";
import { connectToDatabase } from "../dbConnect";
import Question from "@/models/question.model";
import { revalidatePath } from "next/cache";

export async function createAnswer(params: CreateAnswerParams) {
  await connectToDatabase();

  try {
    const { content, author, question, path } = params;

    const newAnswer = new Answer({
      content,
      author,
      question,
    });

    console.log("New Answer: ", { newAnswer });

    // Add the answer to the question's answers array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO: Create an interaction record for the user's answer action

    revalidatePath(path);
  } catch (error) {
    console.log("Error creating answer: ", error);
    throw error;
  }
}
