"use server";

import Question from "@/models/question.model";
import { connectToDatabase } from "../dbConnect";
import { SearchParams } from "./shared.types";
import Tag from "@/models/tag.model";
import User from "@/models/user.model";
import Answer from "@/models/answer.model";

const SearchableTypes = ["question", "answer", "tag", "user"];

export async function globalSearch(params: SearchParams) {
  await connectToDatabase();

  try {
    const { query, type } = params;
    const regexQuery = { $regex: query, $options: "i" };

    let result: Array<{
      title: string;
      id: string;
      type: string;
    }> = [];

    const modelsAndTtpes = [
      { model: Question, type: "question", searchField: "title" },
      { model: Answer, type: "answer", searchField: "content" },
      { model: Tag, type: "tag", searchField: "name" },
      { model: User, type: "user", searchField: "name" },
    ];

    const typeLower = type?.toLowerCase();
    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      // Searcrh all types

      for (const { model, searchField, type } of modelsAndTtpes) {
        const queryResult = await model
          // @ts-ignore
          .find({ [searchField]: regexQuery })
          .limit(2);

        result.push(
          ...queryResult.map((item: any) => ({
            title:
              type === "answer"
                ? `Answer containing ${query}`
                : item[searchField],
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                  ? item.question
                  : item._id.toString(),
            type,
          })),
        );
      }
    } else {
      // Search for a specific type
      const modelInfo = modelsAndTtpes.find((item) => item.type === typeLower);

      if (!modelInfo) {
        throw new Error("Invalid search type");
      }

      const queryResult = await modelInfo.model
        // @ts-ignore
        .find({ [modelInfo.searchField]: regexQuery })
        .limit(8)
        .lean();

      result = queryResult.map((item: any) => ({
        title:
          type === "answer"
            ? `Answer containing ${query}`
            : item[modelInfo.searchField],
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
              ? item.question
              : item._id.toString(),
        type,
      }));
    }

    return JSON.stringify(result);
  } catch (error) {
    console.log("Error fetching  global search result: ", error);
    throw error;
  }
}
