import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";

export const usePosts = () => {
  const [loading, setLoding] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/post/bulk`, {
        headers: {
          Authorization: localStorage.getItem("jwtToken"),
        },
      })
      .then((response) => {
        setPosts(response.data.posts);
        setLoding(false);
      });
  }, []);

  return { loading, posts };
};
