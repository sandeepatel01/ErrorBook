import Link from "next/link";
import { Button } from "@/components/ui/button";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import { HomePageFilters } from "@/constants/filters";
import HomeFilters from "@/components/home/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";

const questions = [
  {
    _id: "1",
    title: "What is the best way to learn web development?",
    tags: [
      { _id: "1", name: "HTML" },
      { _id: "2", name: "CSS" },
      { _id: "3", name: "JavaScript" },
    ],
    author: [
      {
        _id: "1",
        name: "John Doe",
        picture: "https://example.com/john-doe.jpg",
      },
    ],
    views: 100,
    upvotes: 10,
    answers: [
      { text: "Start with the basics and build projects." },
      { text: "Use online resources like FreeCodeCamp and MDN." },
    ],
    createdAt: new Date("2022-01-01T12:00:00.000Z"),
  },
  {
    _id: "2",
    title: "How to become a web developer?",
    tags: [
      { _id: "4", name: "HTML" },
      { _id: "5", name: "CSS" },
      { _id: "6", name: "JavaScript" },
    ],
    author: [
      {
        _id: "2",
        name: "Jane Smith",
        picture: "https://example.com/jane-smith.jpg",
      },
    ],
    views: 200,
    upvotes: 15,
    answers: [
      { text: "Learn the fundamentals and practice coding every day." },
      { text: "Join a coding bootcamp or enroll in online courses." },
    ],
    createdAt: new Date("2023-01-01T12:00:00.000Z"),
  },
];

export default function Home() {
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
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              views={question.views}
              upvotes={question.upvotes}
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
