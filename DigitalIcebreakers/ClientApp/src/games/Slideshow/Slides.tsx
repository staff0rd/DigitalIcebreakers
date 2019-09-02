import React, {Component} from "react"
import "./slides.css";
import {fitRectIntoBounds} from "./fitRectIntoBounds";

interface SlidesState {
	width: number;
	height: number;
}

export class Slides extends Component<{}, SlidesState> {
	constructor(props: any) {
		super(props);
		this.state = {
			width: 600,
			height: 480
		};
	}

	theElement = (element: HTMLDivElement) => {
		if (element) {
			const result = fitRectIntoBounds(
				{width: 1520, height: 680}, 
				{width: element.clientWidth, height: element.clientHeight}
			);
			this.setState(result);
		}
    }

    render() {
		const containerStyle: React.CSSProperties = {
			position:"relative", 
			width: `${this.state.width}px`, 
			height: `${this.state.height}px`, 
			margin:"0 auto"
		};

        return (
            <div className="slides" ref={this.theElement}>
				<section>
					<h1>How do real-time apps work?</h1>
				</section>
				<section data-background-color="#ffffff">
					<div style={containerStyle}>
						<img width={this.state.width} height={this.state.height} src="img/200-longpolling.001.png" style={{position:"absolute", top: 0, left: 0}} />
						<img width={this.state.width} height={this.state.height} src="img/200-longpolling.002.png" style={{position:"absolute", top: 0, left: 0}} className="fragment" />
						<img width={this.state.width} height={this.state.height} src="img/200-longpolling.003.png" style={{position:"absolute", top: 0, left: 0}} className="fragment" />
						<img width={this.state.width} height={this.state.height} src="img/200-longpolling.004.png" style={{position:"absolute", top: 0, left: 0}} className="fragment" />
					</div>
				</section>
			</div>
        );
    }
}