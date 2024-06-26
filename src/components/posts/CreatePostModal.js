import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useContext } from 'react';
import AuthContext from '../../guards/AuthProvider';
import { Button, Form, FormGroup, Label, Col, Input, FormText } from 'reactstrap'
import JoditEditor from 'jodit-react';
import { ToastContainer, toast } from 'react-toastify';
import { CreatePost } from '../../services/PostsService';
import { useNavigate } from 'react-router-dom';

function CreatePostModal(props) {


    const { user } = useContext(AuthContext);
    const editor = useRef();
    const [content, setContent] = useState(null);
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);

    useEffect(() => {

        document.body.style.overflowY = 'hidden';
        document.addEventListener("mousedown", handleCloseModal, false)

        return () => {
            document.body.style.overflowY = 'scroll';
            //document.removeEventListener("mousedown", handleCloseModal, true);
        };

    }, []);

    const closeModalRef = useRef();

    const handleCloseModal = (e) => {
        // if (closeModalRef.current && !closeModalRef.current.contains(e.target)) {
        //    props.closeCreatePostModal();
        // }
    }

    const handleSubmit = async (e) => {
        setLoader(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', image);
        formData.append('post', JSON.stringify({ content }));
        const response = await CreatePost({ user, formData });
        if (!response.hasError) {
            props.closeCreatePostModal();
            navigate(0);
        }
        else {
            toast("Error : ", response.message);
        }
        setLoader(false);
    }

    return ReactDOM.createPortal(
        <>
            <div className="modal-wrapper" >
                <div className="modal-container" ref={closeModalRef}>
                    <img src='cross.png' alt='img' height="15px" width="15px" onClick={() => { props.closeCreatePostModal() }} style={{ float: 'right', transition: 'transform 0.3s ease-in-out', cursor: 'pointer' }} /><br />
                    <h4 className='mb-4'>Got something on your mind? Share a post with us!</h4>
                    <Form>

                        <FormGroup row>
                            <Label
                                for="exampleText"
                                sm={2}
                            >
                                Post Content
                            </Label>
                            <Col sm={10}>
                                <JoditEditor
                                    ref={editor}
                                    value={content}
                                    onChange={newContent => { setContent(newContent) }}
                                />
                                {/* <Input
                                    id="exampleText"
                                    name="text"
                                    type="textarea"
                                    style={{height:'170px'}}
                                /> */}
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label
                                for="exampleFile"
                                sm={2}
                            >
                                Image
                            </Label>
                            <Col sm={10}>
                                <Input
                                    id="exampleFile"
                                    name="file"
                                    type="file"
                                    onChange={(e) => { setImage(e.target.files[0]) }}
                                />
                                <FormText>
                                    Upload any image less than 10 MB !
                                </FormText>
                            </Col>
                        </FormGroup>


                        <FormGroup
                            check
                            row
                        >
                            <Col
                                sm={{
                                    offset: 10,
                                    size: 10
                                }}
                            >
                                <Button
                                    active
                                    color="primary"
                                    disabled = {loader}
                                    onClick={handleSubmit}>
                                    { loader ? 'Posting...' : 'Finish'}
                                </Button>
                            </Col>
                        </FormGroup>
                    </Form>
                    <ToastContainer />
                </div>
            </div>
        </>, document.querySelector(".createPostModal")
    );
}

export default CreatePostModal
