"use server";

import Question from "@/models/question.model";
import { connectToDatabase } from "../dbConnect";
import Tag, { ITag } from "@/models/tag.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
  RecommendedParams,
} from "./shared.types";
import User, { IUser } from "@/models/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/models/answer.model";
import Interaction from "@/models/interation.model";
import { FilterQuery, ObjectId } from "mongoose";

export async function getQuestions(params: GetQuestionsParams) {
  await connectToDatabase();

  try {
    const { searchQuery, filter, page = 1, pageSize = 20 } = params;

    // calculate the skip value based on the page and pageSize
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};
    let sortOptions: { [key: string]: 1 | -1 } = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;

      case "frequent":
        sortOptions = { views: -1 };
        break;

      case "unanswered":
        query.answers = { $size: 0 };
        break;

      // case "recommended":
      //   query.upvotes = { $size: 0 };
      //   break;

      default:
        break;
    }

    const questions = await Question.find(query)
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
      .skip(skipAmount)
      .limit(pageSize)
      .lean()
      .sort(sortOptions);

    const totalQuestions = await Question.countDocuments(query);

    const isNext = totalQuestions > skipAmount + questions.length;

    // Transform questions to plain objects
    const serializedQuestions = questions.map((question) => ({
      _id: question._id.toString(),
      title: question.title,
      tags: question.tags.map((tag) => ({
        _id: tag._id.toString(),
        name: tag.name,
      })),
      author: {
        _id: question.author._id.toString(),
        name: question.author.name,
        picture: question.author.picture,
      },
      views: question.views,
      upvotes: question.upvotes.length,
      answers: question.answers,
      createdAt: question.createdAt.toISOString(),
    }));

    return {
      questions: JSON.parse(JSON.stringify(serializedQuestions)),
      isNext,
    };
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

    //  Create an interaction record for the user's ask_question action
    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments,
    });

    //  Increment author's reputation by +5 for creating a question
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

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

    // Convert MongoDB ObjectId to string for serializability
    if (question) {
      question._id = question._id.toString(); // Ensure _id is a string
      question.author._id = question.author._id.toString(); // Author _id to string
      question.author.picture = question.author.picture.toString();

      // Serialize tags
      question.tags = question.tags.map((tag) => ({
        ...tag,
        _id: tag._id.toString(), // Convert tag _id to string
      }));
    }

    return question;
  } catch (error) {
    console.log("Error in getting question by id:", error);
    throw error;
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  await connectToDatabase();

  try {
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    //  Increment author 's reputation by +1 for upvoting a question
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -1 : 1 },
    });

    // Increment author's reputation by +10/-10 for recieving an upvote/downvote to the question
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log("Error in upvoting question:", error);
    throw error;
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  await connectToDatabase();

  try {
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? -2 : 2 },
    });

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasdownVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log("Error in downvoting question:", error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  await connectToDatabase();

  try {
    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } },
    );

    revalidatePath(path);
  } catch (error) {
    console.log("Error in deleting question:", error);
    throw error;
  }
}

export async function editQuestion(params: EditQuestionParams) {
  await connectToDatabase();

  try {
    const { questionId, title, content, path } = params;

    const question = await Question.findById(questionId).populate<{
      tags: ITag[];
    }>("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    question.title = title;
    question.content = content;

    await question.save();

    revalidatePath(path);
  } catch (error) {
    console.log("Error in editing question:", error);
    throw error;
  }
}

export async function getHotQuestions() {
  await connectToDatabase();

  try {
    const hotQuestions = await Question.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5)
      .lean();

    // Convert non-serializable fields to simple values (strings)
    const plainQuestions = hotQuestions.map((question: any) => {
      // Convert _id and other ObjectId fields to string
      question._id = question._id.toString();
      question.author = question.author.toString(); // Convert author (ObjectId) to string

      // Convert all ObjectId arrays to strings as well
      question.tags = question.tags.map((tag: ObjectId) => tag.toString());
      question.upvotes = question.upvotes.map((upvote: ObjectId) =>
        upvote.toString(),
      );
      question.downvotes = question.downvotes.map((downvote: ObjectId) =>
        downvote.toString(),
      );
      question.answers = question.answers.map((answer: ObjectId) =>
        answer.toString(),
      );

      return question;
    });

    return plainQuestions;
  } catch (error) {
    console.log("Error in getting hot questions:", error);
    throw error;
  }
}

export async function getRecomendedQuestions(params: RecommendedParams) {
  await connectToDatabase();

  try {
    const { userId, page = 1, pageSize = 20, searchQuery } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const skipAmount = (page - 1) * pageSize;

    const userInteractions = await Interaction.find({ user: user._id });

    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }

      return tags;
    }, []);

    const distinctUserTagIds = [
      ...new Set(userTags.map((tag: any) => tag._id)),
    ];

    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: distinctUserTagIds } },
        { auther: { $ne: user._id } },
      ],
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalQuestions = await Question.countDocuments(query);

    const recommendedQuestions = await Question.find(query)
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
      .skip(skipAmount)
      .limit(pageSize)
      .lean();

    const formattedQuestions = recommendedQuestions.map((question) => ({
      ...question,
      _id: question._id.toString(),
      tags: question.tags.map((tag) => ({
        _id: tag._id.toString(),
        name: tag.name,
      })),
      author: {
        _id: question.author._id.toString(),
        name: question.author.name,
        picture: question.author.picture,
      },
      createdAt: question.createdAt.toISOString(),
    }));

    const isNext = totalQuestions > skipAmount + formattedQuestions.length;

    return {
      questions: JSON.parse(JSON.stringify(formattedQuestions)),
      isNext,
    };
  } catch (error) {
    console.log("Error in getting recommended questions:", error);
    throw error;
  }
}
