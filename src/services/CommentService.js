import axios from "axios";

const baseurl = 'http://localhost:6060/socialMedia/comments';


const CreateComment = async (data) => {
    const id = data.user.id;
    const endpoint = `${baseurl}/writeComment/userId/${id}/postId/${data.postId}`;
    return axios.post(endpoint, {
        'content': data.comment
    }
    , {
        headers: {
            'Authorization': `Bearer ${data.user.token}`
        }
    }
).then((response) => {
        if (response && response.data) {
            return response.data;
        }
    }).catch((error) => {
        console.log(error);
    })
}




export { CreateComment };