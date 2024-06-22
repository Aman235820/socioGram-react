import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useContext } from 'react';
import AuthContext from '../../guards/AuthProvider';
import { Button, Form, FormGroup, Label, Col, Input, FormText } from 'reactstrap'
import JoditEditor from 'jodit-react';

function CreatePostModal(props) {


    const { user } = useContext(AuthContext);
    const editor = useRef();
    const [content , setContent] = useState(null);

    useEffect(() => {

        document.body.style.overflowY = 'hidden';
        document.addEventListener("mousedown", handleCloseModal, false)

        return () => {
            document.body.style.overflowY = 'scroll';
            document.removeEventListener("mousedown", handleCloseModal, true);
        };

    }, []);

    const closeModalRef = useRef();

    const handleCloseModal = (e) => {
        if (closeModalRef.current && !closeModalRef.current.contains(e.target)) {
           props.closeCreatePostModal();
        }
    }

    return ReactDOM.createPortal(
        <>
            <div className="modal-wrapper" >
                <div className="modal-container" ref={closeModalRef}>
                    <img src='cross.png' alt='img' height="15px" width="15px" onClick={() => { props.closeCreatePostModal() }} style={{ float: 'right', transition: 'transform 0.3s ease-in-out', cursor: 'pointer' }} /><br />
                    <h2>Got something on your mind? Share a post with us!</h2>
                    <br/>
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
                                 ref = {editor}
                                 value={content}
                                 onChange={newContent => {setContent(newContent)}}
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
                                 color="primary">
                                    Finish
                                </Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        </>, document.querySelector(".createPostModal")
    );
}

export default CreatePostModal
