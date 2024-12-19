import Link from "next/link";
import { Button } from "@/components/ui/button";
// import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
// import Filter from "@/components/shared/Filter";
// import { HomePageFilters } from "@/constants/filters";
// import HomeFilters from "@/components/home/HomeFilters";
// import NoResult from "@/components/shared/NoResult";
// import QuestionCard from "@/components/cards/QuestionCard";
import {
  getQuestions,
  getRecomendedQuestions,
} from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";
// import Pagination from "@/components/shared/Pagination";

import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Home | ErrorBook",
  description:
    "ErrorBook is a community of developers to ask and answer questions. Join the community now!",
};

export default async function Home({ searchParams }: SearchParamsProps) {
  const { userId } = await auth();

  // const queryObj = await Promise.resolve(searchParams ?? {});
  const queryObj = (await searchParams) || {};
  const searchQuery = queryObj.q || "";

  // console.log("Search query: ", searchQuery);

  let result;

  if (queryObj?.filter === "recommended") {
    if (userId) {
      result = await getRecomendedQuestions({
        userId,
        searchQuery,
        page: queryObj?.page ? +queryObj.page : 1,
      });
    } else {
      result = {
        questions: [],
        isNext: false,
      };
    }
  } else {
    result = await getQuestions({
      searchQuery,
      filter: queryObj.filter || "",
      page: queryObj?.page ? +queryObj.page : 1,
    });
  }

  const questions = result?.questions || [];

  // console.log(result);
  // console.log(result.questions);

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="justify-endmax-sm:w-full flex">
          <Button className="primary-gradient min-h-[46px] rounded-xl px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        {/* <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search  for questions..."
          otherClasses="flex-1"
        /> */}

        {/* <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w[170px] "
          containerClasses="hidden max-md:flex"
        /> */}
      </div>

      {/* <HomeFilters /> */}

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          result.questions.map((question: any) => (
            // <QuestionCard
            //   key={question._id}
            //   _id={question._id}
            //   title={question.title}
            //   tags={question.tags}
            //   author={question.author}
            //   views={question.views}
            //   upvotes={question.upvotes}
            //   answers={question.answers}
            //   createdAt={question.createdAt}
            // />
            <h1 key={question._id} className="h1-bold text-dark100_light900">
              My Question
            </h1>
          ))
        ) : (
          // <NoResult
          //   title="There's no question to show"
          //   description="Be the first to ask a question"
          //   link="/ask-question"
          //   linkTitle="Ask a Question"
          // />
          <h1 className="h1-bold text-dark100_light900">No Questions</h1>
        )}
      </div>

      {/* <div className="mt-10">
        <Pagination
          pageNumber={queryObj?.page ? +queryObj.page : 1}
          isNext={result.isNext}
        />
      </div> */}
    </>
  );
}
