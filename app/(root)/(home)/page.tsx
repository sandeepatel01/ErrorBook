import Link from "next/link";
import { Button } from "@/components/ui/button";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import { HomePageFilters } from "@/constants/filters";
import HomeFilters from "@/components/home/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";
import { getQuestions } from "@/lib/actions/question.action";

export default async function Home() {
  const result = await getQuestions({});
  console.log(result);

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
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search  for questions..."
          otherClasses="flex-1"
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w[170px] "
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              views={question.views}
              upvotes={question.upvotes.length}
              answers={question.answers}
              createdAt={question.createdAt.toISOString()}
            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
            description="Be the first to ask a question"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}

// "use client";

// import { UserButton } from "@clerk/nextjs";
// const DotIcon = () => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 512 512"
//       fill="currentColor"
//     >
//       <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
//     </svg>
//   );
// };

// const CustomPage = () => {
//   return (
//     <div>
//       <h1>Custom Profile Page</h1>
//       <p>This is the custom profile page</p>
//     </div>
//   );
// };
