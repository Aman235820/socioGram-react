import axios from "axios";

const baseurl = 'http://localhost:6060/socialMedia';


 const GetAllPosts = async ({queryKey})=>{

          const [_key , pagination] = queryKey;
           
          const endpoint = `${baseurl}/posts/getAllPosts?pageNumber=${pagination.pageNumber}&pageSize=${pagination.pageSize}`;
          return  await axios.get(endpoint).then((response)=>{
               if(response && response.data){
                    return response.data;
               }
          }).catch((error)=>{
                console.log(error);
          })

 }

 export {GetAllPosts};