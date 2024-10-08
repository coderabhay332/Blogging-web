import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface Author {
  name: string;
}

export interface Blog {
  content: string;
  title: string;
  id: number;
  author: Author;
}

// Custom hook to fetch a single blog by id
export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token not found");
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Blog data fetched:", response.data);

        // Check if response data has the expected structure
        if (response.data && response.data.post) {
          setBlog(response.data.post);
        } else {
          setError("Blog not found in the response.");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to fetch the blog.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  return {
    loading,
    blog,
    error,
  };
};

// Custom hook to fetch all blogs
export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token not found");
      setLoading(false);
      return;
    }

    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer prefix
          },
        });

        console.log("Response Data:", response.data);

        // Directly use the response data
        if (Array.isArray(response.data)) {
          setBlogs(response.data);
        } else {
          setError("No blogs found in the response.");
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to fetch blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return {
    loading,
    blogs,
    error,
  };
};
