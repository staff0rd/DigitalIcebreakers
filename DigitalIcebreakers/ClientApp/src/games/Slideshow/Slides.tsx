import React, { Component } from "react"
import "./slides.css";
import { fitRectIntoBounds } from "./fitRectIntoBounds";

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
				{ width: 1520, height: 680 },
				{ width: element.clientWidth, height: element.clientHeight }
			);
			this.setState(result);
		}
	}

	ifPresenter(content: any) {
		if (this.props.isPresenter)
			return content;
		else
			return (
				<section data-background-color="#ffffff">
					<h1 style={{ opacity: .25 }}>Digital<br />Icebreakers</h1>
				</section>);
	}

	getClientOrPresenterImageParameters(image: string) {
		let path;
		let style: any = {};
		let className = "";

		if (this.props.isPresenter)
		{
			path = `img/${image}`;
			className = "cover-page";
		}
		else
		{
			const fileName = image.replace(".png", ".jpg");
			path = `img/mobile/${fileName}`;
			style = { width: "100%"};
		}

		return {className, path, style };
	}

	diagram(image: string) {
		const params = this.getClientOrPresenterImageParameters(image);

		return (<section style={params.style} data-background-image={params.path} data-background-color="#ffffff" className={params.className}></section>)
	}

	render() {
		return (
			<div className="slides" ref={this.theElement}>

				{this.diagram("intro.png")}
 
				<section data-background-color="#ffffff">
					<h2>
						<ul >
								<li className="no-opacic">Real-time applications</li>
					 			<li  className="opacic">Scaling</li>
								<li  className="opacic">Serverless approach</li>
								<li className="opacic">Audience interactive demo</li>
							</ul>
						 
					</h2>
				</section>
				<section data-background-color="#ffffff">
					<h2>
					<ul >
								<li className="no-opacic">Real-time applications</li>
					 			<li  className="no-opacic">Scaling</li>
								<li  className="opacic">Serverless approach</li>
								<li className="opacic">Audience interactive demo</li>
							</ul>
					</h2>
				</section>
				<section data-background-color="#ffffff">
					<h2>
					<ul >
								<li className="no-opacic">Real-time applications</li>
					 			<li  className="no-opacic">Scaling</li>
								<li  className="no-opacic">Serverless approach</li>
								<li className="opacic">Audience interactive demo</li>
							</ul>
					</h2>
				</section>
				<section data-background-color="#ffffff">
					<h2>
					<ul >
								<li className="no-opacic">Real-time applications</li>
					 			<li  className="no-opacic">Scaling</li>
								<li  className="no-opacic">Serverless approach</li>
								<li className="no-opacic">Audience interactive demo</li>
							</ul>
					</h2>
				</section>

				<section className="cover-page" data-background-image={this.getClientOrPresenterImageParameters("flower-bidding.jpg").path} data-background-opacity=".5">
					<h1 className="flower" style={{ color: "white" }}>Bidding Flower Bouquet</h1>
				</section>				
				
				<section>
					<img src="img/f5.gif" width="414px" />
				</section>

				<section data-background-color="#ffffff">
					<h3>setTimeout(() {'=>'} location.reload(true), 1000);</h3>
				</section>

				{this.diagram("diagrams.001.png")}

		    	{this.diagram("diagrams.002.png")}

				<section data-background-color="#ffffff">
					<h2>Push data <br />once available</h2>
				</section>

				<section data-transition="none" >
					<h1>Best Candidates <br />for real-time?</h1>
				</section>

				{this.diagram("facebook.jpg")}
				{this.diagram("dating.jpg")}
				{this.diagram("uber.jpg")}
				{this.diagram("gaming.jpg")}
				{this.diagram("dashboard.jpg")}

				<section data-transition="none" data-background-color="#ffffff">
					<h1>High frequency updates</h1>
				</section>

				<section data-transition="none" data-background-color="#ffffff">
					<h1>Event-driven architecture</h1>
				</section>

				<section data-transition="none">
					<h1>How do real-time apps work?</h1>
				</section>

				<section data-transition="none" data-background-color="#ffffff">
					<h1>Long Polling</h1>
				</section>

				{this.diagram("diagrams.003.png")}
				{this.diagram("diagrams.004.png")}
				{this.diagram("diagrams.005.png")}
				{this.diagram("diagrams.006.png")}

				<section data-transition="none" data-background-color="#ffffff">
					<h1>Server-Sent Events</h1>
				</section>

				<section data-transition="none" data-background-color="#ffffff">
					<h2>
						<ul>
							<li >HTML5</li>
							<li className="opacic">One-way communication</li>
							<li className="opacic">Low latency</li>
							<li className="opacic">Unsupported by Edge &amp; IE</li>
						</ul>
					</h2>
				</section>
				<section data-transition="none" data-background-color="#ffffff">
					<h2>
						<ul>
							<li  >HTML5</li>
							<li  >One-way communication</li>
							<li className="opacic">Low latency</li>
							<li className="opacic">Unsupported by Edge &amp; IE</li>
						</ul>
					</h2>
				</section>
				<section data-transition="none" data-background-color="#ffffff">
					<h2>
						<ul>
							<li  >HTML5</li>
							<li >One-way communication</li>
							<li >Low latency</li>
							<li className="opacic">Unsupported by Edge &amp; IE</li>
						</ul>
					</h2>
				</section>
				<section data-transition="none" data-background-color="#ffffff">
					<h2>
						<ul>
							<li >HTML5</li>
							<li >One-way communication</li>
							<li >Low latency</li>
							<li >Unsupported by Edge &amp; IE</li>
						</ul>
					</h2>
				</section>

				{this.diagram("diagrams.007.png")}
				{this.diagram("diagrams.008.png")}
				{this.diagram("diagrams.009.png")}
				{this.diagram("diagrams.010.png")}
				{this.diagram("diagrams.011.png")}

				<section data-background-color="#ffffff">
					<h1>Web Socket</h1>
				</section>

				<section data-background-color="#ffffff">
					<h1>Bi-directional</h1>
				</section>

				{this.diagram("diagrams.012.png")}

				<section data-background-color="#ffffff">
					<h1>Which transport method<br />is the best?</h1>
				</section>

				<section data-background-color="#ffffff">
					<h1>ASP.NET SignalR</h1>
				</section>

				<section data-background-color="#ffffff">
					<h1>Manages transport  <br /> method is the key benefit</h1>
				</section>
				<section  data-background-color="#ffffff">
					<h1>WebSocket when it’s available</h1>
				</section>
				<section  data-background-color="#ffffff">
					<h2> Originated in 2011 <br /> David Fowler, Damian Edwards</h2>
				</section>
				<section  data-background-color="#ffffff">
					<h1>Server & Client Library </h1>
				</section>
				<section  data-background-color="#ffffff">
					<h1> ASP.NET Core SignalR <br /> is a rewrite!</h1>
				</section>

				<section className="cover-page" data-background-image={this.getClientOrPresenterImageParameters("flower-bidding.jpg").path} data-background-opacity=".5">
					<h1 className="flower" style={{ color: "white" }}>Bidding Flower Bouquet</h1>
					<h3 className="flower"  style={{ color: "white" }}>ASP.NET Core SignalR,<br />
						Vue.js
					</h3>
				</section>

				<section>
					<pre><code data-line-numbers="3" data-noescape data-trim>{`
								public void ConfigureServices(IServiceCollection services)
								{
									services.AddSignalR();
								}

								public void Configure(IApplicationBuilder app)
								{
									app.UseRouting();
									app.UseEndpoints(endpoints =>
									{
										endpoints.MapHub<EchoHub>("/echo");
									});
								}
							`}</code></pre>
				</section>
				<section>
					<pre><code className='hljs' data-line-numbers="8-12" data-noescape data-trim>{`
								public void ConfigureServices(IServiceCollection services)
								{
									services.AddSignalR();
								}

								public void Configure(IApplicationBuilder app)
								{
									app.UseRouting();
									app.UseEndpoints(endpoints =>
									{
										endpoints.MapHub<EchoHub>("/echo");
									});
								}
							`}</code></pre>
				</section>
				<section >
					<pre><code className='hljs' data-line-numbers="5" data-noescape data-trim>{`
								public class BidHub : Hub
								{
								    public async Task Send(string message)
								    {
								        await Clients.All.SendAsync("BroadCastClient", msg);
								    }
								}
							`}</code></pre>
				</section>

				{this.diagram("diagrams.026.png")}

				<section>
					<h2>
						npm install @microsoft/signalr
					</h2>
				</section>
				<section>
					<pre><code className='javascript' data-line-numbers="2-4" data-trim>{`
						constructor() {    
						  this.hubConnection = new signalR.HubConnectionBuilder()
						    .withUrl("https://serverbidding.azurewebsites.net/bid")
						    .build();
						}

						sendMessage() {
						  this.hubConnection.send("send","send this to server")}
						}
						`}</code></pre>
				</section>
				<section>
					<pre><code className='javascript' data-line-numbers="7-9" data-trim>{`
						constructor() {    
						  this.hubConnection = new signalR.HubConnectionBuilder()
						    .withUrl("https://serverbidding.azurewebsites.net/bid")
						    .build();
						}

						sendMessage() {
						  this.hubConnection.send("send","send this to server")}
						}
						`}</code></pre>
				</section>

				<section>
					<pre><code className='javascript' data-line-numbers="2-3" data-trim>{`
						constructor() {
						  this.hubConnection.on("BroadCastClient",
						    this.broadcastCallBack);
						}   
						
						broadcastCallBack(name, message) {
						  alert(message);
						}
					`}</code></pre>
				</section>
				<section>
					<pre><code className='javascript' data-line-numbers="6-8" data-trim>{`
						constructor() {
						  this.hubConnection.on("BroadCastClient",
						    this.broadcastCallBack);
						}   
						
						broadcastCallBack(name, message) {
						  alert(message);
						}
					`}</code></pre>
				</section>
				<section>
					<h1>Pushing the limit</h1>
				</section>
			 
				<section data-background-color="#ffffff" >
					<blockquote className="quote-signalr" cite="Nelly & Stafford">
						&ldquo;SignalR can &nbsp; <br /> handle unlimited persistent connections!&rdquo;
					</blockquote>
				</section>
				<section data-background-color="#ffffff" >
					<blockquote className="quote-signalr" cite="Nelly & Stafford">
						&ldquo;SignalR can &nbsp; <span style={{ color: "red",position:"absolute" }}> not</span> <br /> handle unlimited persistent connections!&rdquo;
					</blockquote>
				</section>
				<section data-background-color="#ffffff">
					<div style={{ display:"grid", height: "100vh"}}>
					{/* <h2>Servers have limited resources</h2> */}
						<img style={{margin:"auto"}} src="img/serverresources.png" />
					</div>
				</section>
				<section data-background-color="#ffffff">
					<h1>Persistent connections <br /> consume resources  <br /> significantly!</h1>
				</section>

				{this.diagram("typicalapp.001.png")}
				{this.diagram("typicalapp.002.png")}
				{this.diagram("typicalapp.003.png")}
			
			 	{this.diagram("realtime.002.png")}
				{this.diagram("realtime.003.png")}
				{this.diagram("realtime.004.png")}
				{this.diagram("realtime.005.png")}


				<section data-background-color="#ffffff">
					<h2>Crankier</h2>
				</section>
				<section data-background-color="#ffffff">
					<table>
						<thead>
							<tr><th>Client(s)</th><th>Server</th><th>Connections</th></tr>
						</thead>
						<tbody>
							<tr>
								<td>Local</td>
								<td>S1 App Service</td>
								<td>768</td>
							</tr>
							<tr className="fragment">
								<td>50 containers</td>
								<td>S1 App Service</td>
								<td>~16,000</td>
							</tr>
							<tr className="fragment">
								<td>50 containers</td>
								<td>D2s VM</td>
								<td>~65,000</td>
							</tr>
							<tr className="fragment">
								<td>50 VMs</td>
								<td>D2s VM</td>
								<td>~100,000</td>
							</tr>
							<tr className="fragment">
								<td>50 VMs</td>
								<td>D8s VM</td>
								<td>~214,000</td>
							</tr>
							<tr className="fragment">
								<td>50 VMs</td>
								<td>D32s VM</td>
								<td>~245,000</td>
							</tr>
						</tbody>
					</table>
				</section>
			</div>
		);
	}
}