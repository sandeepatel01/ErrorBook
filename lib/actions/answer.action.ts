"use server";

import Answer from "@/models/answer.model";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import { connectToDatabase } from "../dbConnect";
import Question from "@/models/question.model";
import { revalidatePath } from "next/cache";
import { IUser } from "@/models/user.model";
import Interaction from "@/models/interation.model";

export async function createAnswer(params: CreateAnswerParams) {
  await connectToDatabase();

  try {
    const { content, author, question, path } = params;

    const newAnswer = await Answer.create({
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

export async function getAnswers(params: GetAnswersParams) {
  await connectToDatabase();

  try {
    const { questionId, sortBy } = params;
    let sortOptions: { [key: string]: 1 | -1 } = {};

    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = { upvotes: -1 };
        break;

      case "lowestUpvotes":
        sortOptions = { upvotes: 1 };
        break;

      case "recent":
        sortOptions = { createdAt: -1 };
        break;

      case "old":
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }

    const answers = await Answer.find({ question: questionId })
      .populate<{
        author: IUser;
      }>("author", "_id clerkId name picture")
      .sort(sortOptions);

    return { answers };
  } catch (error) {
    console.log("Error in getting answers: ", error);
    throw error;
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  await connectToDatabase();

  try {
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    // TODO: Increment author 's reputation by +5 for upvoting a question

    revalidatePath(path);
  } catch (error) {
    console.log("Error in upvoting answer:", error);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  await connectToDatabase();

  try {
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasdownVoted) {
      updateQuery = { $pull: { downvote: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    revalidatePath(path);
  } catch (error) {
    console.log("Error in downvoting answer:", error);
    throw error;
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  await connectToDatabase();

  try {
    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    await Answer.deleteOne({ _id: answerId });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } },
    );
    await Interaction.deleteMany({ answer: answerId });

    revalidatePath(path);
  } catch (error) {
    console.log("Error in deleting answer:", error);
    throw error;
  }
}

// export async function getAnswers(params: GetAnswersParams) {
//   await connectToDatabase();

//   try {
//     const { questionId } = params;
//     const cleanQuestionId = questionId.replace(/^"|"$/g, ""); // Removes extra quotes

//     if (!mongoose.isValidObjectId(cleanQuestionId)) {
//       throw new Error("Invalid question ID");
//     }

//     const answers = await Answer.find({ question: cleanQuestionId })
//       .populate<{
//         author: IUser;
//       }>("author", "_id clerkId name picture")
//       .sort({ createdAt: -1 });

//     return { answers };
//   } catch (error) {
//     console.log("Error in getting answers: ", error);
//     throw error;
//   }
// }
