"use server";

import User from "@/models/user.model";
import { connectToDatabase } from "../dbConnect";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  MongoUserParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/models/question.model";
import { FilterQuery } from "mongoose";
import Tag from "@/models/tag.model";
import Answer from "@/models/answer.model";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

export async function getUserById(params: MongoUserParams) {
  await connectToDatabase();

  try {
    const { userId } = params;

    const user = await User.findOne({
      clerkId: userId,
    });

    // .lean();

    // <MongoUserParams>

    if (!user) {
      throw new Error("User not found");
    }

    // as MongoUserParams

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function createUser(userParams: CreateUserParams) {
  await connectToDatabase();

  try {
    const newUser = await User.create(userParams);
    return newUser;
  } catch (error) {
    console.log("Error creating user: ", error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  await connectToDatabase();

  try {
    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

    revalidatePath(path);
  } catch (error) {
    console.log("Error in user updation: ", error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  await connectToDatabase();

  try {
    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });
    if (!user) {
      throw new Error("User not found");
    }

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers, comments, etc.

    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.log("Error in deleting user: ", error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  await connectToDatabase();

  try {
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;
    let sortOptions: { [key: string]: 1 | -1 } = {};

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    switch (filter) {
      case "new_user":
        sortOptions = { joinedAt: -1 };
        break;

      case "old_user":
        sortOptions = { joinedAt: 1 };
        break;

      case "top_contributor":
        sortOptions = { reputation: -1 };
        break;

      default:
        break;
    }

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUser = await User.countDocuments(query);

    const isNext = totalUser > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.log("Error in getting all users: ", error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  await connectToDatabase();

  try {
    const { questionId, userId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isQuestionSaved = user.saved.includes(questionId);
    if (isQuestionSaved) {
      // remove question from saved questions
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true },
      );
    } else {
      // add question to saved questions
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true },
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log("Error in toggling save question:", error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  await connectToDatabase();

  try {
    const { clerkId, searchQuery, filter, page = 1, pageSize = 20 } = params;

    if (!clerkId) {
      throw new Error("Missing clerkId parameter.");
    }

    // console.log("Finding user with clerkId:", clerkId);

    const skipAmount = (page - 1) * pageSize;
    let sortOptions: { [key: string]: 1 | -1 } = {};

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;

      case "oldest":
        sortOptions = { createdAt: 1 };
        break;

      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;

      case "most_viewed":
        sortOptions = { views: -1 };
        break;

      case "most_answered":
        sortOptions = { answers: -1 };
        break;

      default:
        break;
    }

    const user = await User.findOne({ clerkId })
      .populate({
        path: "saved",
        match: query,
        options: { sort: sortOptions, skip: skipAmount, limit: pageSize + 1 },
        populate: [
          { path: "author", model: User, select: "_id clerkId name picture" },
          { path: "tags", model: Tag, select: "_id name" },
        ],
      })
      .lean();

    if (!user) {
      throw new Error("User not found");
    }

    // TypeScript ko `user` ke type ka pata chalne dena
    if (Array.isArray(user)) {
      throw new Error("User data is an array, expected a single user object");
    }

    // const savedQuestions = user.saved;
    // Map saved questions to convert _id (Buffer) to string
    const savedQuestions = user.saved.map((question: any) => ({
      ...question,
      _id: question._id.toString(), // Convert _id to string
      author: question.author
        ? {
            ...question.author,
            _id: question.author._id.toString(),
          }
        : null,
      tags: question.tags.map((tag: any) => ({
        _id: tag._id.toString(), // Include both _id and name
        name: tag.name,
      })),
    }));

    const isNext = user.saved.length > pageSize;

    return { questions: savedQuestions, isNext }; // Make sure this return statement is here
  } catch (error) {
    console.log("Error in getting saved questions: ", error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  await connectToDatabase();

  try {
    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [questionViews] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews.totalViews || 0,
      },
    ];

    const badgeCounts = assignBadges({
      // @ts-ignore
      criteria,
    });

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation,
    };
  } catch (error) {
    console.log("Error in getting user info: ", error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  await connectToDatabase();

  try {
    const { userId, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;
    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({
        createdAt: -1,
        views: -1,
        upvotes: -1,
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .skip(skipAmount)
      .limit(pageSize)
      .lean();

    // Convert ObjectIds to strings in questions and their nested fields
    const questions = userQuestions.map((question: any) => ({
      ...question,
      _id: question._id.toString(), // Convert _id to string
      author: {
        ...question.author,
        _id: question.author._id.toString(), // Convert author _id to string
      },
      tags: question.tags.map((tag: any) => ({
        ...tag,
        _id: tag._id.toString(), // Convert tag _id to string
      })),
    }));

    const isNextQuestions = totalQuestions > skipAmount + pageSize;

    return { totalQuestions, questions, isNextQuestions };
  } catch (error) {
    console.log("Error in getting user questions: ", error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  await connectToDatabase();

  try {
    const { userId, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;
    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
      .populate({
        path: "question",
        model: Question,
        select: "_id title author tags",
      })
      .skip(skipAmount)
      .limit(pageSize);

    const isNextAnswers = totalAnswers > skipAmount + pageSize;

    return { totalAnswers, answers: userAnswers, isNextAnswers };
  } catch (error) {
    console.log("Error in getting user answers: ", error);
    throw error;
  }
}

// : Promise<MongoUserParams | null>

// {
//   userId: string;
// }
