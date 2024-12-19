"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuestionSchema } from "@/lib/validations";
import React, { Suspense, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";

interface QuestionProps {
  type?: string;
  mongoUserId: string;
  questionDetails?: string;
}

const Question = ({ mongoUserId, questionDetails, type }: QuestionProps) => {
  const { mode } = useTheme();
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // const log = () => {
  //   if (editorRef.current) {
  //     console.log(editorRef.current.getContent());
  //   }
  // };

  const parsedQuestionDetails = (() => {
    try {
      return questionDetails ? JSON.parse(questionDetails) : null;
    } catch (error) {
      console.error("Error parsing questionDetails:", error);
      return null;
    }
  })();

  const groupedTags =
    parsedQuestionDetails?.tags?.map((tag: any) => tag.name) || [];

  // 1. Define your form.
  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: parsedQuestionDetails?.title || "",
      explanation: parsedQuestionDetails?.content || "",
      tags: groupedTags || [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof QuestionSchema>) {
    console.log("Form Values:", values);
    setIsSubmitting(true);

    try {
      if (type === "Edit") {
        await editQuestion({
          questionId: parsedQuestionDetails._id,
          title: values.title,
          content: values.explanation,
          path: pathname,
        });
        router.push(`/questions/${parsedQuestionDetails._id}`);
      } else {
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: JSON.parse(mongoUserId),
          path: pathname,
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Error creating question:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    field: any,
  ) => {
    if (event.key === "Enter" && field.name === "tags") {
      event.preventDefault();

      const tagInput = event.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must be less than 15 characters",
          });
        }

        if (!field.value.includes(tagValue as never)) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleRemoveTag = (tag: string, field: any) => {
    const updatedTags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", updatedTags);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="text-[16px] font-semibold leading-[20.8px] text-dark-400 dark:text-light-800">
                  Question Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    className="no-focus paragraph-regular light-border-2 min-h-[56px] rounded-xl border bg-light-900 text-dark-300 dark:border-dark-400 dark:bg-dark-300 dark:text-light-700"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="mt-2.5 text-[14px] font-normal leading-[19.6px] text-light-500">
                  Be specific and imagine you&apos;re asking a question to
                  another person.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-[16px] font-semibold leading-[20.8px] text-dark-400 dark:text-light-800">
                  Details explanation of your problem
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(_evt, editor) =>
                      // @ts-ignore
                      (editorRef.current = editor)
                    }
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    initialValue={parsedQuestionDetails?.content || ""}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "codesample | bold italic forecolor | alignleft aligncenter |" +
                        "alignright alignjustify | bullist numlist",
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                    }}
                  />
                </FormControl>
                <FormDescription className="mt-2.5 text-[14px] font-normal leading-[19.6px] text-light-500">
                  Introduce the problem and expand on what you put in the title.
                  Minimum 20 characters. person.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="text-[16px] font-semibold leading-[20.8px] text-dark-400 dark:text-light-800">
                  Tags <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <>
                    <Input
                      disabled={type === "Edit"}
                      className="no-focus paragraph-regular light-border-2 min-h-[56px] rounded-xl border bg-light-900 text-dark-300 dark:border-dark-400 dark:bg-dark-300 dark:text-light-700"
                      placeholder="Add tags..."
                      onKeyDown={(event) => handleInputKeyDown(event, field)}
                    />
                    {field.value.length > 0 && (
                      <div className="flex-start mt-2.5 gap-2.5">
                        {field.value.map((tag) => (
                          <Badge
                            key={tag}
                            className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-xl border-none px-4 py-2 capitalize"
                            onClick={() =>
                              type !== "Edit"
                                ? handleRemoveTag(tag, field)
                                : () => {}
                            }
                          >
                            {tag}
                            {type !== "Edit" && (
                              <Image
                                src="/assets/icons/close.svg"
                                width={12}
                                height={12}
                                alt="close icon"
                                className="cursor-pointer object-contain invert-0 dark:invert"
                              />
                            )}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                </FormControl>
                <FormDescription className="mt-2.5 text-[14px] font-normal leading-[19.6px] text-light-500">
                  Add up to 3 tags to describe what your question is about. You
                  need to press enter to add a tag.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="primary-gradient w-fit rounded-xl !text-light-900"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>{type === "Edit" ? "Editing..." : "Posting..."}</>
            ) : (
              <>{type === "Edit" ? "Edit Question" : "Ask a question"}</>
            )}
          </Button>
        </form>
      </Form>
    </Suspense>
  );
};

export default Question;
