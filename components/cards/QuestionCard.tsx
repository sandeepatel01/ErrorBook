"use client";

import Link from "next/link";
import React, { Suspense } from "react";
import RenderTags from "../shared/RenderTags";
import Metrix from "../shared/Metrix";
import { formatNumber, getTimestamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

export interface QuestionCardProps {
  _id: string;
  title: string;
  tags: { _id: string; name: string }[];
  author: { _id: string; name: string; picture: string; clerkId: string };
  views: number;
  upvotes: number;
  answers: object[];
  createdAt: string;
  clerkId?: string | null;
}

const QuestionCard = ({
  clerkId,
  _id,
  title,
  tags,
  author,
  views,
  upvotes,
  answers,
  createdAt,
}: QuestionCardProps) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;

  // console.log("QuestionCard", {
  //   _id,
  //   title,
  //   tags,
  //   author,
  //   views,
  //   upvotes,
  //   answers,
  //   createdAt,
  // });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
        <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
          <div>
            <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
              {getTimestamp(new Date(createdAt))}
            </span>
            <Link href={`/questions/${_id}`}>
              <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
                {title}
              </h3>
            </Link>
          </div>

          <SignedIn>
            {showActionButtons && (
              <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
            )}
          </SignedIn>
        </div>

        <div className="mt-3.5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <RenderTags key={tag._id} _id={tag._id} name={tag.name} />
          ))}
        </div>

        <div className="flex-between mt-6 flex-wrap gap-3">
          <Metrix
            imgUrl={author.picture}
            alt="user"
            value={author.name}
            title={` - asked ${getTimestamp(new Date(createdAt))}`}
            href={`/profile/${author._id}`}
            isAuthor
            textStyle="body-medium text-dark400_light700"
          />
          <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
            <Metrix
              imgUrl="/assets/icons/like.svg"
              alt="Upvotes"
              value={formatNumber(upvotes)}
              title=" Votes"
              textStyle="small-medium text-dark400_light800"
            />
            <Metrix
              imgUrl="/assets/icons/message.svg"
              alt="message"
              value={formatNumber(answers.length)}
              title=" Answers"
              textStyle="small-medium text-dark400_light800"
            />
            <Metrix
              imgUrl="/assets/icons/eye.svg"
              alt="eye"
              value={formatNumber(views)}
              title=" Views"
              textStyle="small-medium text-dark400_light800"
            />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default QuestionCard;
