import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem  } from 'react-bootstrap';
import doggo from './doggo.jpeg';
import kitteh from './kitteh.jpg';
import { Bar } from 'react-chartjs-2';

export class DoggosVsKittehs extends Component {
    displayName = DoggosVsKittehs.name

    constructor(props, context) {
        super(props,context);
        this.choice = undefined;
        props.connection.on("gameUpdate", (result) => {
            console.log(result);
            this.setState({
                doggos: result.doggos,
                kittehs: result.kittehs,
                undecided: result.undecided
            });
        });
        console.log(props);
        this.state = {
            doggos: 0,
            kittehs: 0,
            undecided: 0
        };
    }

    choose = (choice) => {
        if (choice !== this.choice) {
            this.choice = choice;
            console.log("congrats on making a choice");
            this.props.connection.invoke("gameMessage", choice);
        }
    }

    renderAdmin() {
        if (this.state.doggos + this.state.kittehs + this.state.undecided === 0)
            this.props.connection.invoke("gameMessage", "");

        const data = {
            labels: ["Doggos", "Undecided", "Kittehs"],
            datasets: [{
                label: "Doggos vs Kittehs",
                data: [this.state.doggos, this.state.undecided, this.state.kittehs],
                backgroundColor: ['#845EC2', '#B0A8B9', '#FF8066']
            }],
            
        };

        const options = { 
            legend: {display: false },
            scales: { 
                xAxes: [{ gridLines: { display:false}}],
                yAxes: [{ gridLines: { display:false}}]
            }
        };

        return (
            <div>
                <h2>Doggos vs Kittehs</h2>
                <Bar data={data} options={options} />
            </div>
        );
    }

    renderPlayer() {
        return (
            <div>
                <h2>Choose one</h2>
                <ListGroup>
                    <ListGroupItem onClick={() => this.choose("1")}>
                        <img src={kitteh} alt="kitteh" width={320} />
                    </ListGroupItem>
                    <ListGroupItem onClick={() => this.choose("0")}>
                        <img src={doggo} alt="doggo" width={320} />
                    </ListGroupItem>
                </ListGroup>
            </div>
        );
    }

    render() {
        return this.props.isAdmin ? this.renderAdmin() : this.renderPlayer();
    }
}
