import { Appbar } from "../components/Appbar";
import { FullBlog } from "../components/FullBlog";
import { Spinner } from "../components/Spinner";
import { useBlog } from "../hooks";
import { useParams } from "react-router-dom";

export const Blog = () => {
  const { id } = useParams<{ id: string }>(); // Specify type for id
  const { loading, blog, error } = useBlog({ id: id || "" }); // Pass the id or empty string

  if (loading) {
    return (
      <div>
        <Appbar />
        <div className="h-screen flex flex-col justify-center">
          <div className="flex justify-center">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Appbar />
        <div className="flex justify-center">
          <p className="text-red-500">{error}</p> {/* Display error message */}
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div>
        <Appbar />
        <div className="flex justify-center">
          <p>No blog data available</p> {/* Handle case when blog is null */}
        </div>
      </div>
    );
  }
  

  return (
    <div>
      <Appbar />
      <FullBlog blog={blog} /> {/* Ensure FullBlog accepts a Blog object */}
    </div>
  );
};
