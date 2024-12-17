import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import { QuestionFilters } from "@/constants/filters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";

export default async function Home({ searchParams }: SearchParamsProps) {
  const queryObj = await Promise.resolve(searchParams ?? {});
  const searchQuery = queryObj.q || "";

  const { userId } = await auth();

  if (!userId) return null;

  const result = await getSavedQuestions({
    clerkId: userId,
    searchQuery,
    filter: queryObj.filter || "",
    page: queryObj?.page ? +queryObj.page : 1,
  });

  // console.log("Full Result:", result);
  // console.log("Questions Array:", result.questions);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search  for questions..."
          otherClasses="flex-1"
        />

        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w[170px] "
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              views={question.views}
              upvotes={question.upvotes}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no question saved to show"
            description="Be the first to ask a question"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>

      <div className="mt-10">
        <Pagination
          pageNumber={queryObj?.page ? +queryObj.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
}
