import React from 'react';
import { Button  } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { BaseGame } from '../BaseGame';

export class YesNoMaybePresenter extends BaseGame {
    displayName = YesNoMaybePresenter.name

    constructor(props, context) {
        super(props,context);
        
        this.state = {
            yes: 0,
            no: 0,
            maybe: 0
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.connection.on("gameUpdate", (result) => {
            console.log(result);
            this.setState({
                yes: result.yes,
                no: result.no,
                maybe: result.maybe
            });
        });
    }

    reset = () => {
        this.props.connection.invoke("gameMessage", "reset");
    }

    render() {
        if (this.state.yes + this.state.no+ this.state.maybe=== 0)
            this.props.connection.invoke("gameMessage", "");

        const data = {
            labels: ["Yes", "No", "Maybe"],
            datasets: [{
                data: [this.state.yes, this.state.no, this.state.maybe],
                backgroundColor: ['#845EC2', '#B0A8B9', '#FF8066']
            }]
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
                <h2>Yes, No, Maybe</h2>
                <Bar data={data} options={options} />
                <Button onClick={this.reset} bsSize="large">Reset</Button>
            </div>
        );
    }
}
