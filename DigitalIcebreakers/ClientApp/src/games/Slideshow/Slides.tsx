import React, {Component} from "react"
import "./slides.css";
import {fitRectIntoBounds} from "./fitRectIntoBounds";

interface SlidesState {
	width: number;
	height: number;
}

type SlidesProps = {
	isPresenter: boolean;
}

export class Slides extends Component<SlidesProps, SlidesState> {
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
	
	ifPresenter(content: string)
	{
		if (this.props.isPresenter)
			return content;
	}

	ifClient(content: string)
	{
		if (!this.props.isPresenter)
			return content;
	}

    render() {
        return (
            <div className="slides" ref={this.theElement}>

 			 
				<section data-transition="none">
					<h1>How do real-time apps work?</h1>
				</section>

				<section data-transition="none" data-background-color="#ffffff">
					<h2>Transport Methods</h2>
					<ul>
						<li className="fragment"><h3>Long Polling</h3></li>
						<li className="fragment"><h3>Server-Sent Events</h3></li>
						<li className="fragment"><h3>WebSocket</h3></li>
					</ul>
				</section>

				
				<section data-background-image=	{this.ifPresenter('img/200-longpolling.001.png')}   data-background-color="#ffffff">
				<h2> {this.ifClient('No Image Available')}</h2>
				</section>
				 
				<section data-background-image={this.ifPresenter('img/200-longpolling.002.png')}  data-background-color="#ffffff">
				<h2> {this.ifClient('No Image Available')}</h2>
			
				</section>
			
				<section data-background-image={this.ifPresenter('img/200-longpolling.003.png')}  data-background-color="#ffffff">
				<h2> {this.ifClient('No Image Available')}</h2>
			
				</section>
			
				<section data-background-image={this.ifPresenter('img/200-longpolling.004.png')}  data-background-color="#ffffff">
				<h2> {this.ifClient('No Image Available')}</h2>
			
				</section>
			
				 
				 <section data-background-color="#ffffff">
					<h1>WebSocket</h1>
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

			 
				<section data-background-image={this.ifPresenter('img/exported-websocket.png')} data-background-color="#ffffff" >
				<h2> {this.ifClient('No Image Available')}</h2>
			
				</section>
				
			

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
					<h1>Server & Client Library </h1>
				</section>
				<section>
					<h1> ASP.NET Core SignalR <br /> is a rewrite!</h1>
				</section>
			</div>
        );
    }
}