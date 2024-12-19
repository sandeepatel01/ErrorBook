import { getUserQuestions } from "@/lib/actions/user.action";
import React, { Suspense } from "react";
import QuestionCard from "../cards/QuestionCard";
import Pagination from "./Pagination";

interface QuestionTabProps {
  userId: string;
  clerkId?: string | null;
  searchParams: { [key: string]: string | string[] | undefined };
}

const QuestionTab = async ({
  searchParams,
  userId,
  clerkId,
}: QuestionTabProps) => {
  const queryObj = await Promise.resolve(searchParams ?? {});

  const result = await getUserQuestions({
    userId,
    page: queryObj?.page ? +queryObj.page : 1,
  });
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {result.questions.map((item: any) => (
        <QuestionCard
          key={item._id}
          _id={item._id}
          clerkId={clerkId}
          title={item.title}
          tags={item.tags}
          author={item.author}
          views={item.views}
          upvotes={item.upvotes.length}
          answers={item.answers}
          createdAt={item.createdAt}
        />
      ))}

      <div className="mt-10">
        <Pagination
          pageNumber={queryObj?.page ? +queryObj.page : 1}
          isNext={result.isNextQuestions}
        />
      </div>
    </Suspense>
  );
};

export default QuestionTab;
