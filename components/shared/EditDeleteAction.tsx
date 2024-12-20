"use client";

import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { Suspense } from "react";

interface EditDeleteActionProps {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: EditDeleteActionProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/questions/edit/${JSON.parse(itemId)}`);
  };
  const handleDelete = async () => {
    if (type === "Question") {
      // delete question
      await deleteQuestion({ questionId: JSON.parse(itemId), path: pathname });
    } else if (type === "Answer") {
      // delete answer
      await deleteAnswer({ answerId: JSON.parse(itemId), path: pathname });
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex items-center justify-end gap-3 max-sm:w-full">
        {type === "Question" && (
          <Image
            src="/assets/icons/edit.svg"
            width={14}
            height={14}
            alt="edit"
            className="cursor-pointer object-contain"
            onClick={handleEdit}
          />
        )}

        <Image
          src="/assets/icons/trash.svg"
          width={14}
          height={14}
          alt="delete"
          className="cursor-pointer object-contain"
          onClick={handleDelete}
        />
      </div>
    </Suspense>
  );
};

export default EditDeleteAction;
