import axios from "axios";

const baseurl = 'http://localhost:6060/socialMedia';

const loginApi = async (data) => {

    const endpoint = `${baseurl}/auth/login`;
    return await axios.post(endpoint, data).then((response) => {
        if (response && response.data) {
            return response.data;
        }
    }) 

}

export { loginApi };
