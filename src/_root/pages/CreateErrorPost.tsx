import ErrorPostForm from "@/components/forms/ErrorPostForm";

const CreateErrorPost = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-2 justify-start max-w-5xl w-full">
          <img
            src="/assets/icons/add-post.svg"
            alt="ErrorPost"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Error</h2>
        </div>

        <ErrorPostForm />
      </div>
    </div>
  );
};

export default CreateErrorPost;
