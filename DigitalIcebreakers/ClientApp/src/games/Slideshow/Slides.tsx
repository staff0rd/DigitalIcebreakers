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
        return (
            <div className="slides" ref={this.theElement}>

 			 
			   <section data-transition="none">
					<h1>How do real-time apps work?</h1>
				</section>
				 
				 <section data-background-color="#ffffff">
					<h1>Web Socket</h1>
				</section>
				<section data-background-color="#ffffff">
					<h1>HTML5</h1>
				</section>
				<section data-background-color="#ffffff">
					<h1>Persistent Connections</h1>
				</section>
				<section data-background-color="#ffffff">
					<h1>Bi-directional</h1>
				</section>
				
				<section data-background-image="img/exported-websocket.png"  data-background-color="#ffffff"></section>
				
			 
				<section data-background-image="img/200-longpolling.001.png"  data-background-color="#ffffff"></section>
				
				<section data-background-image="img/200-longpolling.002.png" data-background-color="#ffffff"></section>
			
				<section data-background-image="img/200-longpolling.003.png" data-background-color="#ffffff"></section>
			
				<section data-background-image="img/200-longpolling.004.png" data-background-color="#ffffff"></section>
			

				<section data-background-color="#ffffff">
					<h1>Which transport method<br/>is the best?</h1>
				</section>

				<section>
					<h1>ASP.NET SignalR</h1>
				</section>
				<section>
					<h1>	Simplified adding <br /> real-time functionality</h1>
				</section>

				<section>
					<h1>Manages transport  <br /> method is the key benefit</h1>
				</section>
				<section>
					<h1>WebSocket <br /> When it’s available</h1>
				</section>
				<section>
					<h1> Originated in 2011 <br /> David Fowler, Damian Edwards</h1>
				</section>
				<section>
					<h1>Server & Client Library </h1>
				</section>
				<section>
					<h1> ASP.NET Core SignalR <br /> is a rewrite!</h1>
				</section>
			</div>
        );
    }
}