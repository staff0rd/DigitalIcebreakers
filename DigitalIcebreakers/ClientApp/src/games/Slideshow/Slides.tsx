import React, {Component} from "react"

export class Slides extends Component {

    render() {
        return (
            <div className="slides">
				<section>
					<h1>
						Azure for free
					</h1>
					<span>@staff0rd</span>
				</section>
				<section>
					<h2>Multi-step Web tests</h2>
					<ul>
						<li className="fragment">Visual Studio Enterprise</li>
						<li className="fragment">Deprecated</li>
						<li className="fragment">Requests only - no javascript</li>
						<li className="fragment">$13.73 per test per month</li>
					</ul>
				</section>
				<section>
					<h2>Web Monitor</h2>
					<ul>
						<li className="fragment">Monitor
							<ul>
								<li>Request times</li>
								<li className="fragment">Exceptions & Errors</li>
								<li className="fragment">Availability</li>
							</ul>
						</li>
						<li className="fragment">Alerting</li>
						<li className="fragment">Reporting</li>
					</ul>
				</section>
				<section>
					I made this up
				</section>
				<section>
					<h2>Selenium</h2>
					<ul>
						<li className="fragment">.NET Core</li>
						<li className="fragment">mstest</li>
						<li className="fragment">Page Object Model</li>
						<li className="fragment">Exclude google-analytics</li>
						<li className="fragment">Headless</li>
						<li className="fragment">Run it!</li>
					</ul>
				</section>
				<section>
					<h2>Azure DevOps</h2>
					<ul>
						<li className="fragment">Pipeline - 1800 free minutes</li>
						<li className="fragment">Run tests</li>
                        <li className="fragment">Emails</li>
						<li className="fragment">Scheduled trigger</li>
                        <li className="fragment"><a target="_blank" rel="noopener noreferrer" href="https://dev.azure.com/staff0rd/all/all%20Team/_dashboards/dashboard/d8ff8649-d43d-4e58-beb2-06d2da0d0848">Dashboard</a></li>
					</ul>
				</section>
				<section>
					<h2>Application Insights</h2>
					<ul>
						<li className="fragment">Called by Selenium</li>
						<li className="fragment">3 months history</li>
						<li className="fragment">https://dev.applicationinsights.io/</li>
						<li className="fragment"><a target="_blank" rel="noopener noreferrer" href="https://portal.azure.com#@413504eb-8622-47d2-aa72-ddbba4584471/blade/Microsoft_Azure_Monitoring_Logs/LogsBlade/resourceId/%2Fsubscriptions%2Fa5c1b01b-4d7f-44e8-91d1-d01d0768c292%2FresourceGroups%2Fazure-web-monitor%2Fproviders%2Fmicrosoft.insights%2Fcomponents%2Fazure-web-monitor-insights/source/LogsBlade.AnalyticsShareLinkToQuery/q/H4sIAAAAAAAAA03NPQ7CMAwF4L2n8FaQIpEeoEycgBUxuIlFg%252FJT2U5RJQ5PM5X1fc9%252BuGKIOIUYdLuT1KgC3Rc%252BMzGBhkSimBa4Ar7KafDnA6U6RyIwjjC0dOHyJqfHkQFfGTWUfBmstQYyJjJQOY6uipZ025tZdpdHv6f9s70p7Ilh2v7GPYlrxJSbNXAzsnY%252FKCuCaL0AAAA%253D">Here!</a></li>
					</ul>
				</section>
				<section>
						<h2>Azure Scheduler</h2>
						<ul>
							<li className="fragment">Deprecated</li>
						</ul>
					</section>
				<section>
					<h2>Logic Apps</h2>
					<ul>
						<li className="fragment">Trigger Builds</li>
						<li className="fragment"><a target="_blank" rel="noopener noreferrer" href="https://portal.azure.com/#@readify.net/resource/subscriptions/a5c1b01b-4d7f-44e8-91d1-d01d0768c292/resourceGroups/azure-web-monitor/providers/Microsoft.Logic/workflows/azure-web-monitor-run/logicApp">See it</a></li>
						<li className="fragment">Shouldn't be needed</li>
						<li className="fragment">Expensive - 1 cent/week</li>
					</ul>
				</section>
				<section>
					<h2>Periodic Digest</h2>
					<ul>
						<li className="fragment">Daily / Weekly / Monthly</li>
						<li className="fragment">.NET Framework - Microsoft Chart Controls</li>
						<li className="fragment">Page request times</li>
						<li className="fragment">Total errors</li>
						<li className="fragment">Demo</li>
					</ul>
				</section>
				<section>
					<h2>Notifications & Alarms</h2>
					<ul>
						<li className="fragment">SendGrid
							<ul className="fragment">
								<li>100 emails/day free</li>
							</ul>
						</li>
						<li className="fragment">PagerDuty</li>
					</ul>
				</section>
				<section>
					<ul>
						<li>https://staffordwilliams.com</li>
						<li>
							https://github.com/staff0rd/azure-web-monitor
						</li>
					</ul>
				</section>
			</div>
        );
    }
}