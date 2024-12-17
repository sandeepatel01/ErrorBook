import React from "react";
import { getUserAnswers } from "@/lib/actions/user.action";
import AnswerCard from "../cards/AnswerCard";
import Pagination from "./Pagination";

interface AnswerTabProps {
  userId: string;
  clerkId?: string | null;
  searchParams: { [key: string]: string | string[] | undefined };
}

const AnswerTab = async ({ userId, clerkId, searchParams }: AnswerTabProps) => {
  const queryObj = await Promise.resolve(searchParams ?? {});

  const result = await getUserAnswers({
    userId,
    page: queryObj?.page ? +queryObj.page : 1,
  });
  return (
    <>
      {result.answers.map((item) => (
        <AnswerCard
          key={item._id}
          _id={item._id}
          clerkId={clerkId}
          author={item.author}
          upvotes={item.upvotes.length}
          question={item.question}
          createdAt={item.createdAt}
        />
      ))}

      <div className="mt-10">
        <Pagination
          pageNumber={queryObj?.page ? +queryObj.page : 1}
          isNext={result.isNextAnswers}
        />
      </div>
    </>
  );
};

export default AnswerTab;
