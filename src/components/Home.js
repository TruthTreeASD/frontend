import React, { Component } from "react";
import DisplayComponent from "./DisplayComponent";
import Header from "./Header";

class Home extends Component {
    render() {
        return (
            <div>
              <Header/>
                <h1>ASD 6510</h1>
                <h2>Hello world!</h2>
                <DisplayComponent></DisplayComponent>
            </div>
        )
    }
}

export default Home;
