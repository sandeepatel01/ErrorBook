"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasupVoted: boolean;
  downvotes: number;
  hasdownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasupVoted: initialUpvoted,
  downvotes,
  hasdownVoted: initialDownvoted,
  hasSaved,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const [localHasUpvoted, setLocalHasUpvoted] = useState(initialUpvoted);
  const [localHasDownvoted, setLocalHasDownvoted] = useState(initialDownvoted);

  const handleSave = () => {};

  const handleVote = async (action: string) => {
    if (!userId) return;

    if (action === "upvote") {
      if (type === "Question") {
        await upvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: localHasUpvoted,
          hasdownVoted: localHasDownvoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await upvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: localHasUpvoted,
          hasdownVoted: localHasDownvoted,
          path: pathname,
        });
      }

      setLocalHasUpvoted(!localHasUpvoted);
      if (localHasDownvoted) setLocalHasDownvoted(false);
      return;

      // TODO: show a toast message
    }

    if (action === "downvote") {
      if (type === "Question") {
        await downvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: localHasUpvoted,
          hasdownVoted: localHasDownvoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await downvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: localHasUpvoted,
          hasdownVoted: localHasDownvoted,
          path: pathname,
        });
      }

      setLocalHasDownvoted(!localHasDownvoted);
      if (localHasUpvoted) setLocalHasUpvoted(false);
      // TODO: show a toast message
    }
  };

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              localHasUpvoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-[3px] p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(upvotes)}
            </p>
          </div>
        </div>

        <div className="flex-center gap-1.5">
          <Image
            src={
              localHasDownvoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-[3px] p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>

      {type === "Question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={() => handleSave()}
        />
      )}
    </div>
  );
};

export default Votes;

// "use client";

// import {
//   downvoteQuestion,
//   upvoteQuestion,
// } from "@/lib/actions/question.action";
// import { formatNumber } from "@/lib/utils";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import React, { useState } from "react";

// interface Props {
//   type: string;
//   itemId: string;
//   userId: string;
//   upvotes: number;
//   hasupVoted: boolean;
//   downvotes: number;
//   hasdownVoted: boolean;
//   hasSaved?: boolean;
// }

// const Votes = ({
//   type,
//   itemId,
//   userId,
//   upvotes,
//   hasupVoted: initialUpvoted,
//   downvotes,
//   hasdownVoted: initialDownvoted,
//   hasSaved,
// }: Props) => {
//   const pathname = usePathname();

//   // Local state for upvote and downvote
//   const [localHasUpvoted, setLocalHasUpvoted] = useState(initialUpvoted);
//   const [localHasDownvoted, setLocalHasDownvoted] = useState(initialDownvoted);
//   const [localUpvotes, setLocalUpvotes] = useState(upvotes);
//   const [localDownvotes, setLocalDownvotes] = useState(downvotes);

//   const handleVote = async (action: "upvote" | "downvote") => {
//     if (!userId) return;

//     try {
//       if (action === "upvote") {
//         if (type === "Question") {
//           await upvoteQuestion({
//             questionId: JSON.parse(itemId),
//             userId: JSON.parse(userId),
//             hasupVoted: localHasUpvoted,
//             hasdownVoted: localHasDownvoted,
//             path: pathname,
//           });
//         }

//         // Update state based on action
//         if (localHasUpvoted) {
//           setLocalHasUpvoted(false);
//           setLocalUpvotes(localUpvotes - 1);
//         } else {
//           setLocalHasUpvoted(true);
//           setLocalUpvotes(localUpvotes + 1);

//           if (localHasDownvoted) {
//             setLocalHasDownvoted(false);
//             setLocalDownvotes(localDownvotes - 1);
//           }
//         }
//       } else if (action === "downvote") {
//         if (type === "Question") {
//           await downvoteQuestion({
//             questionId: JSON.parse(itemId),
//             userId: JSON.parse(userId),
//             hasupVoted: localHasUpvoted,
//             hasdownVoted: localHasDownvoted,
//             path: pathname,
//           });
//         }

//         // Update state based on action
//         if (localHasDownvoted) {
//           setLocalHasDownvoted(false);
//           setLocalDownvotes(localDownvotes - 1);
//         } else {
//           setLocalHasDownvoted(true);
//           setLocalDownvotes(localDownvotes + 1);

//           if (localHasUpvoted) {
//             setLocalHasUpvoted(false);
//             setLocalUpvotes(localUpvotes - 1);
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error handling vote:", error);
//     }
//   };

//   return (
//     <div className="flex gap-5">
//       <div className="flex-center gap-2.5">
//         <div className="flex-center gap-1.5">
//           <Image
//             src={
//               localHasUpvoted
//                 ? "/assets/icons/upvoted.svg"
//                 : "/assets/icons/upvote.svg"
//             }
//             width={18}
//             height={18}
//             alt="upvote"
//             className="cursor-pointer"
//             onClick={() => handleVote("upvote")}
//           />
//           <div className="flex-center background-light700_dark400 min-w-[18px] rounded-[3px] p-1">
//             <p className="subtle-medium text-dark400_light900">
//               {formatNumber(localUpvotes)}
//             </p>
//           </div>
//         </div>
//         <div className="flex-center gap-1.5">
//           <Image
//             src={
//               localHasDownvoted
//                 ? "/assets/icons/downvoted.svg"
//                 : "/assets/icons/downvote.svg"
//             }
//             width={18}
//             height={18}
//             alt="downvote"
//             className="cursor-pointer"
//             onClick={() => handleVote("downvote")}
//           />
//           <div className="flex-center background-light700_dark400 min-w-[18px] rounded-[3px] p-1">
//             <p className="subtle-medium text-dark400_light900">
//               {formatNumber(localDownvotes)}
//             </p>
//           </div>
//         </div>
//       </div>
//       <Image
//         src={
//           hasSaved
//             ? "/assets/icons/star-filled.svg"
//             : "/assets/icons/star-red.svg"
//         }
//         width={18}
//         height={18}
//         alt="star"
//         className="cursor-pointer"
//         onClick={() => {}}
//       />
//     </div>
//   );
// };

// export default Votes;
