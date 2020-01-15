import React from "react";
import "./style.css";
import { Card, Container } from "react-bootstrap";

const PostCard = props => {

    const post = props.post;
    const comments = post.comments;

    return (
        <Container>
            <Card>
                <Card.Title>
                    {/* { post.author.username } */}
                    {/* <span className="date">
                        {new Date(post.createdAt).toDateString()}
                    </span> */}
                </Card.Title>
                <Card.Body>
                    <h1>{ post.body }</h1>
                    <Container>
                        <ul>
                        { comments.map( comment => {
                            return (
                                <li>
                                    <h2> { comment.author.username } </h2>
                                    <p> { comment.body } </p>
                                    {/* <span className="date">
                                        {new Date(comment.createdAt).toDateString()}
                                    </span> */}
                                </li>
                            )}
                        )}
                        </ul>
                    </Container>
                </Card.Body>
            </Card>
        </Container>
    )
}   


export default PostCard;