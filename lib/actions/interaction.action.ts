"use server";

import Question from "@/models/question.model";
import { connectToDatabase } from "../dbConnect";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/models/interation.model";

export async function viewQuestion(params: ViewQuestionParams) {
  await connectToDatabase();

  try {
    const { questionId, userId } = params;

    // Update the view count for the question
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        question: questionId,
        action: "view",
      });

      if (existingInteraction) return console.log("Interaction already exists");

      // Create an interaction record for the user's view action
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
    }
  } catch (error) {
    console.log("Error in view question: ", error);
    throw error;
  }
}
