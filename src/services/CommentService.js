import axios from "axios";

const baseurl = 'http://localhost:6060/socialMedia/comments';


const CreateComment = async (data) => {
    const id = data.user.id;
    const endpoint = `${baseurl}/writeComment/userId/${id}/postId/${data.postId}`;
    return axios.post(endpoint, {
        content: data.comment
    }
        , {
            headers: {
                'Content-Type': 'application/json',
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


const DeleteComment = async (data) => {
    const endpoint = `${baseurl}/deleteComment/comment/${data.commentId}?postId=${data.postId}&userId=${data.user.id}`;

    return await axios.delete(endpoint,{
        headers:{
            'Authorization' : `Bearer ${data.user.token}`
        }
    }).then((response) => {
        if (response && response.data) {
            return response.data;
        }
    }).catch((error) => {
        console.log(error);
    })
}




export { CreateComment, DeleteComment };