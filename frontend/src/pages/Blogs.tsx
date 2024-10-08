import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";

export const Blogs = () => {
  const { loading, blogs, error } = useBlogs();

  if (loading) {
    return (
      <div>
        <Appbar />
        <div className="flex justify-center">
          <div>
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
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
          <div>
            <p className="text-red-500">{error}</p> {/* Display error message */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div>
          {blogs.length > 0 ? (
            blogs.map(blog => (
              <BlogCard
                key={blog.id} // Add key for mapping
                id={blog.id}
                authorName={blog.author ? blog.author.name : "Anonymous"} // Ensure author name is available
                title={blog.title}
                content={blog.content}
                publishedDate={"2nd Feb 2024"} // Update this as needed
              />
            ))
          ) : (
            <p>No blogs available</p>
          )}
        </div>
      </div>
    </div>
  );
};
