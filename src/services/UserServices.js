import axios from "axios";

const baseurl = 'http://localhost:6060/socialMedia/user';

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

export { GetUserById , GetAllUsers  , UpdateUser};
