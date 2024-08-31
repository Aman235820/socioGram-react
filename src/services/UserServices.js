import axios from "axios";

const appUrl = process.env.REACT_APP_API_BASEURL;
let baseurl = `${appUrl}/socialMedia/user`;

const isProd = process.env.REACT_APP_IS_PROD;

if(isProd){
     baseurl = "/socialMedia/user"
}

console.log(isProd);

const GetUserById = async ({id , token}) => {
    const endpoint = `${baseurl}/getUserById/${id}`;
    return await axios.get(endpoint, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        if (response && response.data) {
            return response.data;
        }
    }).catch((error) => {
        console.log(error);
    })
}

const GetAllUsers = async ({queryKey}) => {
    const [_key , token] = queryKey;
    const endpoint = `${baseurl}/getAllUsers`;
    return axios.get(endpoint , {
         headers : {
             "Authorization" : `Bearer ${token}`
         }
    }).then((response) => {
        if (response && response.data) {
            return response.data;
        }
    }).catch((error) => {
        console.log(error);
    })

}

const UpdateUser = async ({updateForm , token}) => {
    //console.log(updateForm ,"  " ,token)
    const endpoint = `${baseurl}/updateUser`;
    return await axios.put(endpoint, {
         name : updateForm.name,
         password : updateForm.password,
         age : updateForm.age
    }, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        if (response && response.data) {
            return response.data;
        }
    }).catch((error) => {
        console.log(error);
    })
}


const DeleteUser = async (user) => {
    const endpoint = `${baseurl}/deleteUser/${user.id}`;
    return await axios.delete(endpoint, {
        headers: {
            "Authorization": `Bearer ${user.token}`
        }
    }).then((response) => {
        if (response && response.data) {
            return response.data;
        }
    }).catch((error) => {
        console.log(error);
    })
}

export { GetUserById , GetAllUsers  , UpdateUser , DeleteUser};
