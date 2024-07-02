import { useEffect, useState ,useMemo} from "react";
import { GetAllPosts } from "../../services/PostsService";
import { useQuery } from "@tanstack/react-query";
import Post from "./Post";
import './PostFeeds.css';
import InfiniteScroll from "react-infinite-scroll-component";
import { ToastContainer, toast } from "react-toastify";
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
          toast("Error : ",error);
    }
  } , [isError]);

  const changePage = ()=>{
        setPagination(prev => {
             return({...prev , pageNumber : data.data.pageNumber + 1}) 
        })
  }

  return (
    <>
      <div className='timeline bg-dark text-white'>
        <ToastContainer/>
        <div className='timeline_left bg-dark'>
          {isLoading && posts.length === 0 ? (
            <p>Loading....</p>
          ) : (
            <div className='timeline_post bg-dark'>
              <InfiniteScroll
                   dataLength={posts.length}
                   next = {changePage}
                   hasMore = {data ? !data.data.lastPage : false} 
                   loader={<h4>Loading...</h4>}
                   endMessage={
                    <p style={{ textAlign: 'center' }}>
                      <b>Yay! You have seen all the posts !!</b>
                    </p>
                  }
              >
              {posts.length > 0 ? posts.map((post , index) => (
                <Post
                  key={`${post.postId}-${index}`}
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
