import axios from "axios";

const baseurl = 'http://localhost:6060/socialMedia/posts';


const GetAllPosts = async ({ queryKey }) => {

     const [_key, pagination] = queryKey;

     const endpoint = `${baseurl}/getAllPosts?pageNumber=${pagination.pageNumber}&pageSize=${pagination.pageSize}`;
     return await axios.get(endpoint).then((response) => {
          if (response && response.data) {
               return response.data;
          }
     }).catch((error) => {
          console.log(error);
     })
}

const CreatePost = async (data) => {
     const id = data.user.id;
     const endpoint = `${baseurl}/user/${id}/createPost`;
     return axios.post(endpoint, data.formData, {
          headers: {
               'Content-Type': 'multipart/form-data',
               'Authorization': `Bearer ${data.user.token}`
          }
     }).then((response) => {
          if (response && response.data) {
               return response.data;
          }
     }).catch((error) => {
          console.log(error);
     })
}

const GetPostsByUser = async ({ queryKey }) => {
     const [_key, user, pagination] = queryKey;
     const endpoint = `${baseurl}/user/${user.id}/getPostsByUser`;
     return await axios.get(endpoint, {
          params: {
               pageNumber: pagination.pageNumber,
               pageSize: pagination.pageSize
          }
     }).then((response) => {
          if (response && response.data) {
               return response.data;
          }
     }).catch((error) => {
          console.log(error);
     })
}


export { GetAllPosts, CreatePost , GetPostsByUser };