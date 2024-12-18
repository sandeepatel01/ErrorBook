import { formatNumber, getTimestamp } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import Metrix from "../shared/Metrix";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface AnswerCardProps {
  clerkId?: string | null;
  _id: string;
  question: {
    _id: string;
    title: string;
  };
  author: {
    _id: string;
    name: string;
    picture: string;
    clerkId: string;
  };
  upvotes: number;
  createdAt: Date;
}

const AnswerCard = ({
  clerkId,
  _id,
  question,
  author,
  upvotes,
  createdAt,
}: AnswerCardProps) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;

  return (
    <div className="card-wrapper rounded-[10px] px-11 py-9">
      <Link href={`/questions/${question._id}/#${_id}`}>
        <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
          <div>
            <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
              {getTimestamp(createdAt)}
            </span>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {question.title}
            </h3>
          </div>

          <SignedIn>
            {showActionButtons && (
              <EditDeleteAction type="Answer" itemId={JSON.stringify(_id)} />
            )}
          </SignedIn>
        </div>

        <div className="flex-between mt-6 flex-wrap gap-3">
          <Metrix
            imgUrl={author.picture}
            alt="user profile picture"
            value={author.name}
            title={` · asked ${getTimestamp(new Date(createdAt))}`}
            href={`/profile/${author.clerkId}`}
            isAuthor
            textStyle="body-medium text-dark400_light700"
          />

          <div className="flex-center gap-3">
            <Metrix
              imgUrl="/assets/icons/like.svg"
              alt="like icon"
              value={formatNumber(upvotes)}
              title=" Votes"
              textStyle="small-medium text-dark400_light800"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AnswerCard;
