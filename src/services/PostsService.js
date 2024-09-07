import axios from "axios";

const appUrl = process.env.REACT_APP_API_BASEURL;
const baseurl = `${appUrl}/socialMedia/posts`;


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


const UpdatePost = async ({ token, formData, postId }) => {
     const endpoint = `${baseurl}/updatePost/${postId}`;
     return axios.put(endpoint, formData, {
          headers: {
               'Content-Type': 'multipart/form-data',
               'Authorization': `Bearer ${token}`
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
     const [_key, id, pagination] = queryKey;
     const endpoint = `${baseurl}/user/${id}/getPostsByUser`;
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

const DeletePost = async ({ token, postId }) => {
     const endpoint = `${baseurl}/removePost/${postId}`;
     console.log(endpoint);
     return axios.delete(endpoint, {
          headers: {
               'Authorization': `Bearer ${token}`
          }
     }).then((response) => {
          if (response && response.data) {
               return response.data;
          }
     }).catch((error) => {
          console.log(error);
     })
}




export { GetAllPosts, CreatePost, GetPostsByUser, DeletePost, UpdatePost };