import { useEffect, useState } from "react";
import { GetAllPosts } from "../../services/PostsService";
import { useQuery } from "@tanstack/react-query";
import Post from "./Post";
import './PostFeeds.css';
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

function PostFeeds() {

  const [posts, setPosts] = useState([]);

  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 2
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['posts', pagination],
    queryFn: GetAllPosts                              // Do not invoke the function here          //fetching the API data through an asynchronous call
  })

  useEffect(() => {
    if (data && data.data && data.data.content) {
      setPosts(data.data.content);
      console.log(data.data)
    }
  }, [data]);

  const changePage = (page)=>{
    
        if(page < 0 || page === data.data.totalPages){
           return;
        }

        setPagination(prev => {
             return({...prev , pageNumber : page})
        })
  }

  return (
    <>
      <div className='timeline bg-dark'>
        <div className='timeline_left bg-dark'>
          {isLoading ? (
            <p>Loading....</p>
          ) : (
            <div className='timeline_post bg-dark'>
              {posts.length > 0 ? posts.map((post) => (
                <Post
                  key={post.postId}
                  user={post.user}
                  image={post.image}
                  content={post.content}
                  comments={post.comments}
                  postDate={post.postDate}
                />
              )) : (
                <p>No posts available !!</p>
              )}
            </div>
          )}
        </div>
        { data && <Pagination size="sm">
          <PaginationItem disabled = {data.data.pageNumber === 0} onClick={()=>changePage(data.data.pageNumber-1)}>
            <PaginationLink
              previous
            />
          </PaginationItem>
          {
          [...Array(data.data.totalPages)].map((_, index) => (
            <PaginationItem active = {index === data.data.pageNumber} onClick={()=>changePage(index)}  key={index}>
              <PaginationLink>
                {index+1}
              </PaginationLink>
            </PaginationItem>
          ))
          }
          <PaginationItem disabled = {data.data.lastPage} onClick={()=>changePage(data.data.pageNumber+1)}>
            <PaginationLink
              next
            />
          </PaginationItem>
        </Pagination>}
      </div>

    </>
  )
}

export default PostFeeds;
