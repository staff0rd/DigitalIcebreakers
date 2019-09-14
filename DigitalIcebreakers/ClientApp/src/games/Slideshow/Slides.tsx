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

	ifPresenter(content: any) {
		if (this.props.isPresenter)
			return content;
		else
			return (
				<section data-background-color="#ffffff">
					<h1 style={{opacity: .25}}>Digital<br/>Icebreakers</h1>
				</section>);
	}

	diagram(path: string) {
		return this.ifPresenter(
			<section data-background-image={path} data-background-color="#ffffff" className="cover-page"></section>
			)
	}

    render() {
        return (
            <div className="slides" ref={this.theElement}>
				<section>
					<h1>Using Azure SignalR Service to build real-time applications</h1>
				</section>
				<section data-background-color="#ffffff">
					<ul>
					<li>Real-time applications</li>
					<li className="fragment">Scaling</li>
					<li className="fragment">Serverless approach</li>
					<li className="fragment">Audience interactive demo</li>
					</ul>
				</section>

				{this.diagram("img/diagrams.001.png")}

				{this.ifPresenter(
					<section>
							<img src="img/f5.webp" width="414px" />
					</section>
				)}

				<section>
					<h3>setTimeout(() => location.reload(true), 1000);</h3>
				</section>

				{this.diagram("img/diagrams.002.png")}

				<section>
					<h2>Real-time applications push data once available</h2>
				</section>

 				<section data-transition="none">
					<h1>Best Candidates <br/>for real-time?</h1>
				</section>

				{this.diagram("img/facebook.jpg")}
				{this.diagram("img/dating.jpg")}
				{this.diagram("img/uber.jpg")}
				{this.diagram("img/gaming.jpg")}
				{this.diagram("img/dashboard.jpg")}

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

				{this.diagram("img/diagrams.003.png")}
				{this.diagram("img/diagrams.004.png")}
				{this.diagram("img/diagrams.005.png")}
				{this.diagram("img/diagrams.006.png")}
			
				<section data-transition="none" data-background-color="#ffffff">
					<h2>Server-Sent Events</h2>
					<ul>
						<li className="fragment">HTML5</li>
						<li className="fragment">One-way communication</li>
						<li className="fragment">Low latency</li>
						<li className="fragment">Unsupported by Edge &amp; IE</li>
					</ul>
				</section>
				
				{this.diagram("img/diagrams.007.png")}
				{this.diagram("img/diagrams.008.png")}
				{this.diagram("img/diagrams.009.png")}
				{this.diagram("img/diagrams.010.png")}
				{this.diagram("img/diagrams.011.png")}

				<section data-background-color="#ffffff">
					<h2>Web Socket</h2>
					<ul>
						<li className="fragment">Bi-directional</li>
					</ul>
				</section>

				{this.diagram("img/diagrams.012.png")}

				<section data-background-color="#ffffff">
					<h3>Which transport method<br/>is the best?</h3>
				</section>

				<section>
					<h1>ASP.NET SignalR</h1>
				</section>

				<section>
					<h1>Manages transport  <br /> method is the key benefit</h1>
				</section>
				<section>
					<h1>WebSocket when it’s available</h1>
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

				{this.ifPresenter(
				<section className="cover-page"	data-background-image="img/flower-bidding.jpg" data-background-opacity=".5">
					<h1 style={{color:"white"}}>Bidding Flower bouquet</h1>
					<h3 style={{color:"white"}}>ASP.NET Core SignalR,<br />
						Vue.js
						</h3>
				</section>
				)}

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
								        await Clients.All.SendAsync("BroadCastClient", message);
								    }
								}
							`}</code></pre>
				</section>
				
				{this.diagram("img/diagrams.026.png")}

				<section>
					<h2>
						npm install @microsoft/signalr	
					</h2>
				</section>
				<section>
					<pre><code className='javascript'  data-line-numbers="2-4" data-trim>{`
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
					<pre><code className='javascript' data-line-numbers="2-3"  data-trim>{`
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
					<pre><code className='javascript' data-line-numbers="6-8"  data-trim>{`
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
				<section data-background-color="#ffffff">
					<blockquote cite="some idiot">
						&ldquo;SignalR can handle unlimited persistent connections!&rdquo;
					</blockquote>
				</section>
				<section data-background-color="#ffffff">
					<blockquote cite="Nelly & Stafford">
						&ldquo;SignalR can <span style={{color:"red"}}>not</span> handle unlimited persistent connections!&rdquo;
					</blockquote>
				</section>
				<section data-background-color="#ffffff">
					<h2>Servers have limited resources</h2>
					<img src="img/placeholder.png"></img>
				</section>
				<section data-background-color="#ffffff">
					<h2>Persistent connections consume resources significantly!</h2>
				</section>

				{this.diagram("img/realtime.001.png")}
				{this.diagram("img/realtime.002.png")}
				{this.diagram("img/realtime.003.png")}
				{this.diagram("img/realtime.004.png")}
				{this.diagram("img/realtime.005.png")}


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
								<td>D14s VM</td>
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