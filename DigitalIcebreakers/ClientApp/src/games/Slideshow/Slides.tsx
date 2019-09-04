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
				<section data-transition="none">
					<h1>How do real-time apps work?</h1>
				</section>
				<section data-transition="none" data-background-color="#ffffff">
					<div style={containerStyle}>
						<div style={{width: "100%", height: "500px", backgroundImage: "url(img/200-longpolling.001.png)" , backgroundSize:"100% auto" ,backgroundRepeat:"no-repeat", backgroundPosition:"centre"}} />	 
					</div>
				</section>
				<section data-transition="none" data-background-color="#ffffff">
						<div style={containerStyle}>
					 	<div style={{width: "100%", height: "500px", backgroundImage: "url(img/200-longpolling.002.png)" , backgroundSize:"100% auto" ,backgroundRepeat:"no-repeat", backgroundPosition:"centre"}} />	 
				 	</div>
				</section>
				<section data-transition="none" data-background-color="#ffffff">
						<div style={containerStyle}>
					 	<div style={{width: "100%", height: "500px", backgroundImage: "url(img/200-longpolling.003.png)" , backgroundSize:"100% auto" ,backgroundRepeat:"no-repeat", backgroundPosition:"centre"}} />	 
				 	</div>
				</section>
				<section data-transition="none" data-background-color="#ffffff">
						<div style={containerStyle}>
					 	<div style={{width: "100%", height: "500px", backgroundImage: "url(img/200-longpolling.004.png)" , backgroundSize:"100% auto" ,backgroundRepeat:"no-repeat", backgroundPosition:"centre"}} />	 
				 	</div>
				</section>
				<section data-transition="none" data-background-color="#ffffff">
					<h2>Server-Sent Events</h2>
					<ul>
						<li className="fragment">HTML5</li>
						<li className="fragment">One-way communication</li>
						<li className="fragment">Low latency</li>
						<li className="fragment">Unsupported by Edge &amp; IE</li>
					</ul>
				</section>
				<section data-background-color="#ffffff">
					<h2>&lt;sse diagram&gt;</h2>
				</section>
				<section data-background-color="#ffffff">
					<h2>Web Socket</h2>
					<ul>
						<li className="fragment">Bi-directional</li>
					</ul>
				</section>
				<section data-background-color="#ffffff">
					<h3>Which transport method<br/>is the best?</h3>
				</section>
				<section>
					<pre><code className="csharp" data-trim>{`
						public void ConfigureServices(IServiceCollection services)
						{
						  services.AddSignalR();
						}

						public void Configure(IApplicationBuilder app)
						{
						  app.UseRouting();
						  app.UseEndpoints(endpoints =>
						  {
						    endpoints.MapHub<BidHub>("/echo");
						  });
						}`}
					</code></pre>
				</section>
				<section>
					<pre><code data-trim>{`
						public class BidHub : Hub
						{
						  public async Task Send(string message)
						  {
						    await Clients.All.SendAsync("BroadCastClient", message);
						  }
						}
					`}</code></pre>
				</section>
				<section data-background-color="#ffffff">
				<h2>&lt;deployment diagram&gt;</h2>
				</section>
				<section>
					<pre><code>
						npm install @microsoft/signalr	
					</code></pre>
				</section>
				<section>
					<pre><code className='javascript' data-trim>{`
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
					<pre><code className='javascript' data-trim>{`
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
					<h2>Crankier</h2>
				</section>
				<section data-background-color="#ffffff">
					<table>
						<tbody>
							<tr>
								<td style={{verticalAlign:"middle"}}>Local</td><td style={{verticalAlign:"middle"}}>&gt;&gt;</td><td>S1 App<br/>Service</td>
							</tr>
							<tr>
								<td colSpan={3} style={{textAlign:'center'}}>768 connections</td>
							</tr>
						</tbody>
					</table>
				</section>
				<section data-background-color="#ffffff">
					<table>
						<tbody>
							<tr>
								<td style={{verticalAlign:"middle", textAlign:"center"}}>30-50 <br/>Containers</td><td style={{verticalAlign:"middle"}}>&gt;&gt;</td><td>S1 App<br/>Service</td>
							</tr>
							<tr>
								<td colSpan={3} style={{textAlign:'center'}}>16,000 connections</td>
							</tr>
						</tbody>
					</table>
				</section>
				<section data-background-color="#ffffff">
					<table>
						<tbody>
							<tr>
								<td style={{verticalAlign:"middle", textAlign:"center"}}>30-50 <br/>Containers</td><td style={{verticalAlign:"middle"}}>&gt;&gt;</td><td>D2s<br/>VM</td>
							</tr>
							<tr>
								<td colSpan={3} style={{textAlign:'center'}}>65,000 connections</td>
							</tr>
						</tbody>
					</table>
				</section>
				<section data-background-color="#ffffff">
					<table>
						<tbody>
							<tr>
								<td style={{verticalAlign:"middle", textAlign:"center"}}>30-50 <br/>VMs</td><td style={{verticalAlign:"middle"}}>&gt;&gt;</td><td>D2s<br/>VM</td>
							</tr>
							<tr>
								<td colSpan={3} style={{textAlign:'center'}}>100,000 connections</td>
							</tr>
						</tbody>
					</table>
				</section>
				<section data-background-color="#ffffff">
					<table>
						<tbody>
							<tr>
								<th style={{textAlign:"center"}}>Server<br/>size</th>
								<th style={{textAlign:"center"}}>Total<br/>connections</th>
							</tr>
							<tr>
								<td>D2s</td><td style={{textAlign:"center"}}>100k</td>
							</tr>
							<tr>
								<td>D8s</td><td style={{textAlign:"center"}}>214k</td>
							</tr>
							<tr>
								<td>D32s</td><td style={{textAlign:"center"}}>245k</td>
							</tr>
						</tbody>
					</table>
				</section>
				<section>
					<h1>Managing the pressure</h1>
				</section>
				<section data-background-color="#ffffff">
					<h2>Backplane</h2>
				</section>
				<section data-background-color="#ffffff">
					<h2>&lt;backplane diagrams&gt;</h2>
				</section>
				<section data-background-color="#ffffff">
					Backplane installation, configuration and monitoring is complex!
				</section>
				<section data-background-color="#ffffff">
					Sticky sessions
				</section>
				<section data-background-color="#ffffff">
					Looking for a managed service?
				</section>
				<section data-background-color="#ffffff">
					Azure SignalR Service as a modern solution
				</section>
				<section data-background-color="#ffffff">
					Fairly new product
				</section>
				<section data-background-color="#ffffff">
					Proxy rather than backplane
				</section>
				<section data-background-color="#ffffff">
					<h2>&lt;ASRS diagrams&gt;</h2>
				</section>
				<section data-background-color="#ffffff">
					Setup is trivial!
				</section>
				
			</div>
        );
    }
}