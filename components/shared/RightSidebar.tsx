import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTags from "./RenderTags";

const topQuestions = [
  {
    _id: "1",
    title:
      "How to Ensure Unique User Profile with ON CONFLICT in PostgreSQL Using Drizzle ORM?",
  },
  {
    _id: "2",
    title:
      "What are the benefits and trade-offs of using Server-Side Rendering (SSR) in Next.js?",
  },
  {
    _id: "3",
    title: "How to center a div?",
  },
  {
    _id: "4",
    title:
      "Node.js res.json() and res.send(), not working but still able to change status code",
  },
  {
    _id: "5",
    title: "ReactJs or NextJs for begginers i ask for advice",
  },
];

const popularTags = [
  {
    _id: "1",
    name: "react",
    totalQuestions: 5,
  },
  {
    _id: "2",
    name: "javascript",
    totalQuestions: 10,
  },
  {
    _id: "3",
    name: "html",
    totalQuestions: 15,
  },
  {
    _id: "4",
    name: "css",
    totalQuestions: 5,
  },
  {
    _id: "5",
    name: "python",
    totalQuestions: 2,
  },
];

const RightSidebar = () => {
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex flex-col gap-[30px]">
          {topQuestions.map((question) => (
            <Link
              href={`/questions/${question._id}`}
              key={question._id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">
                {question.title}
              </p>
              <Image
                src="/assets/icons/chevron-right.svg"
                width={20}
                height={20}
                alt="chevron-right"
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <RenderTags
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              totalQuestions={tag.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
