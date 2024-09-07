import { useEffect, useState ,useMemo} from "react";
import { GetAllPosts } from "../../services/PostsService";
import { useQuery } from "@tanstack/react-query";
import Post from "./Post";
import './PostFeeds.css';
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function PostFeeds() {

  const [posts, setPosts] = useState([]);

  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 2
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['posts', pagination],
    queryFn: GetAllPosts ,                             // Do not invoke the function here          //fetching the API data through an asynchronous call
    keepPreviousData: true  // Keeps previous data while fetching new data
  })

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data.content)) {
      setPosts(prevPosts => [...prevPosts, ...data.data.content]);
    }
  }, [data]);

  useMemo(()=>{                                               //used to memoize (cache) the result of a function or an expression. This can improve performance by preventing unnecessary calculations.
    if(isError){
          toast.error("Error : ",error);
    }
  } , [isError]);

  const changePage = ()=>{
        setPagination(prev => {
             return({...prev , pageNumber : data.data.pageNumber + 1}) 
        })
  }

  return (
    <>
    <br/>
      <div className={isLoading && posts.length === 0 ? `timeline loader` : `timeline bg-dark text-white mt-5`}>
        <div className='timeline_left bg-dark'>
          {isLoading && posts.length === 0 ? (
            <img src="loader.gif" className="loading" alt = "Loading..."/>
          ) : (
            <div className='timeline_post bg-dark'>
              <InfiniteScroll
                   dataLength={posts.length}
                   next = {changePage}
                   hasMore = {data ? !data.data.lastPage : false} 
                   loader={<h4>Loading...</h4>}
                   endMessage={
                    <p className="fw-bold text-left d-flex offset-2">
                      Yay! You have seen all the posts !!
                    </p>
                  }
              >
              {posts.length > 0 ? posts.map((post , index) => (
                <Post
                  key={`${post.postId}-${index}`}
                  postId={post.postId}
                  user={post.user}
                  image={post.image}
                  content={post.content}
                  comments={post.comments}
                  postDate={post.postDate}
                />
              )) : (
                <p>No posts available !!</p>
              )}
              </InfiniteScroll>
            </div>
          )}
        </div>
      </div>

    </>
  )
}

export default PostFeeds;
