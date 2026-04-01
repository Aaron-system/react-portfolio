import React, { useState } from 'react';
import './index.scss';
import { Box, Button, Modal } from '@mui/material';
import 'animate.css';



const Portfolio = () => {

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const modalContent = (
        <Box
            className="animate__animated animate__jackInTheBox"
            sx={{
                position: 'absolute',
                justifyContent: 'center',
                top: '50%',
                left: '45%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
            }}
        >
            <h4>Would you like to be a client or a node?</h4>
            <div className='buttons-modal'>
                <Button href="link1" target="_blank" rel="noopener noreferrer">
                    Client Alice
                </Button>
                <Button href="link1" target="_blank" rel="noopener noreferrer">
                    Client Bob
                </Button>
                <Button href="link2" target="_blank" rel="noopener noreferrer">
                    Node
                </Button>
            </div>
        </Box>
    );






    return (
        <div className="container portfolio-page">

            <div className='portfolio-wrap'>
                <br />
                <br />
                <br />
                <div className="card-grid">
                    <a className="card" href="#">
                        <div className="card__background" style={{ backgroundImage: "url(https://pbs.twimg.com/media/FqH4Wf2aMAUBmtN?format=jpg&name=medium)" }}></div>
                        <div className="card__content">
                            <p className="card__category">React</p>
                            <h3 className="card__heading">AI Document Builder</h3>
                        </div>
                    </a>
                    <a className="card" href="#">
                        <div className="card__background" style={{ backgroundImage: "url(https://pbs.twimg.com/media/Fr0Q0p6acAA1EsL?format=png&name=small)" }}></div>
                        <div className="card__content">
                            <p className="card__category">React</p>
                            <h3 className="card__heading">Midjourney Clone</h3>
                        </div>
                    </a>

                    <a className="card" href="#">
                        <div className="card__background" style={{ backgroundImage: "url(https://pbs.twimg.com/media/FqH09SPaQAASXyV?format=png&name=small)" }}></div>
                        <div className="card__content">
                            <p className="card__category">React</p>
                            <h3 className="card__heading">Magic Memory Card Game</h3>
                        </div>
                    </a>

                    <a className="card" onClick={handleOpen}>
                        <div
                            className="card__background"
                            style={{
                                backgroundImage: 'url(https://www.filepicker.io/api/file/L83xfxy4SPuTCmr9GEDC)',
                            }}
                        ></div>
                        <div className="card__content">
                            <p className="card__category">Python</p>
                            <h3 className="card__heading">Flask Blockchain</h3>
                        </div>
                    </a>

                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                    >
                        {modalContent}
                    </Modal>

                    <a className="card" href="#">
                        <div className="card__background" style={{ backgroundImage: "url(https://cdn-images-1.medium.com/max/1000/1*F-PHNVI7wdcoYFDrA9pmGQ.jpeg)" }}></div>
                        <div className="card__content">
                            <p className="card__category">Python</p>
                            <h3 className="card__heading">Neural-Network to Read Handwritten Digits</h3>
                        </div>
                    </a>
                    <a className="card" href="#">
                        <div className="card__background" style={{ backgroundImage: "url(https://pbs.twimg.com/media/Fr4LtPBaYAEHxgq?format=png&name=small)" }}></div>
                        <div className="card__content">
                            <p className="card__category">Python</p>
                            <h3 className="card__heading">Optical Character Rocognition with Pytesseract</h3>
                        </div>
                    </a>




                    {/* <a className="card" href="#">
                        <div className="card__background" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1557004396-66e4174d7bf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60)" }}></div>
                        <div className="card__content">
                            <p className="card__category">Python</p>
                            <h3 className="card__heading">Example Card Heading</h3>
                        </div>
                    </a> */}

                </div>


                <br />
                <br />
                <br />
                <br />


                <div className="card-grid">
                    <a className="card" href="#">
                        <div className="card__background" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1557177324-56c542165309?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)" }}></div>
                        <div className="card__content">
                            <p className="card__category">Category</p>
                            <h3 className="card__heading">Example Card Heading</h3>
                        </div>
                    </a>
                    <a className="card" href="#">
                        <div className="card__background" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1557187666-4fd70cf76254?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60)" }}></div>
                        <div className="card__content">
                            <p className="card__category">Category</p>
                            <h3 className="card__heading">Example Card Heading</h3>
                        </div>
                    </a>
                    <a className="card" href="#">
                        <div className="card__background" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1556680262-9990363a3e6d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60)" }}></div>
                        <div className="card__content">
                            <p className="card__category">Category</p>
                            <h3 className="card__heading">Example Card Heading</h3>
                        </div>
                    </a>
                    {/* <a className="card" href="#">
                        <div className="card__background" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1557004396-66e4174d7bf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60)" }}></div>
                        <div className="card__content">
                            <p className="card__category">Category</p>
                            <h3 className="card__heading">Example Card Heading</h3>
                        </div>
                    </a> */}

                </div>
            </div>
        </div>
    );
};

export default Portfolio;
