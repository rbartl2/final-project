import React, { Component } from "react";
import Header from "../components/Nav";
import Footer from "../components/footer";
import ContactUs from "../components/contactus";
import { Container, Form, Button } from "react-bootstrap";



class Contact extends React.Component {

    render() {
        return (
            <Container>
                <Header />
                <Container>
                    <ContactUs>

                    </ContactUs>
                </Container>
                <Footer>

                </Footer>
            </Container>
        )
    }
}

export default Contact;