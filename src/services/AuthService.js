import axios from "axios";

const baseurl = 'http://localhost:6060/socialMedia/auth';

const loginApi = async (data) => {
    const endpoint = `${baseurl}/login`;
    return await axios.post(endpoint, data).then((response) => {
        if (response && response.data) {
            return response.data;
        }
    }) 
}

const createUser = async (data)=>{
    const endpoint = `${baseurl}/register`;
    return axios.post(endpoint , data).then((response)=>{
           if(response && response.data){
                return response.data;
           }
    }).catch((error)=>{
           console.log(error);
    })
      
}


const resetPassApi = async (username , password)=>{
    const endpoint = `${baseurl}/resetPassword`;
    return axios.post(endpoint , {
         username : username, 
         password : password
    }).then((response)=>{
           if(response && response.data){
                return response.data;
           }
    }).catch((error)=>{
           console.log(error);
    })
      
}

export { loginApi , createUser , resetPassApi};
