# Digital Icebreakers

![Digital Icebreakers](https://raw.githubusercontent.com/staff0rd/DigitalIcebreakers/master/DigitalIcebreakers/ClientApp/public/img/digital-icebreakers.jpg)

Digital Icebreakers is a platform for presenters and audiences to collaborate, play, and experiment together.

## How it works

A presenter creates a _Lobby_ and audience members join by pointing their phone cameras at the presenter's screen and scanning the QR code. The presenter can then guide the audience through games and experiences by clicking _New Activity_. Try it out on [digitalicebreakers.com](https://digitalicebreakers.com).

## Build

1. Clone this repo
1. `npm i -g firebase-tools`
1. Install [.NET Core 3.1 SDK](https://dot.net)
1. Run `ASPNETCORE_URLS=http://0.0.0.0:5000 ASPNETCORE_ENVIRONMENT=Development dotnet run --project DigitalIcebreakers`

## Infrastructure overview

![Infrastructure diagram](/docs/overview.png)

## Game Architecture

A `Lobby` is created and owned by the `Presenter`. Participants may join as `Client`s. A `Presenter` controls which `Game` is currently running, and can close the `Lobby` at any time, ejecting all off the `Clients`. A `Client`'s experience is guided by the `Presenter`.

### Creating your own Game

A `Game` consists of two parts:

1. C# code that controls the `Game`'s messaging between the `Presenter`, `Client`s and `System`.
1. TypeScript-based React components that control the view and actions of the `Presenter` and `Clients`.

I will create a game called _Splat_ to illustrate what is required for a (rather trivial) end-to-end game. The `Game` should be entirely implemented within the `DigitalIcebreakers` folder and project. _Splat_ will have one button on `Client` views. On press, the `Presenter` view will choose a random point and color, and begin expanding a filled circle centered on the point. On release, the circle will disappear.

#### Implement the Backend

1. Add `Splat.cs` to `DigitalIcebreakers/Games`. I've just copied `Buzzer.cs` because the messaging is the same - I've just changed the class name and set the `Name` property.
1. Add the `Splat` constructor to `GameHub.GetGame` .

#### Implement the Frontend

1. Add a folder called `DigitalIcebreakers/ClientApp/src/games/Splat`, and inside it implement:
   1. `SplatClient.tsx`. I've just copied `BuzzerClient` and updated the name, because the UI for the `Client` is identical. This component uses pixi.js to render a button and forwards the press and release events to the SignalR hub.
   1. `SplatPresenter.tsx`. Again I copied `BuzzerPresenter`, switched it to extend `PixiView`, removed `render()` as we don't need it for `PixiView` and implemented the response to up/down button presses.
1. Add a record to `DigitalIcebreakers/ClientApp/src/games/Games.tsx` for `Splat`, setting it's name and importing the `Presenter` and `Client` components.

#### Running & Testing

In Visual Studio Code, you can hit F5 and this will compile both the `Backend` and `Frontend` and launch a browser. Once the site loads, click Host > Create, and move the window to half of your screen. Right-click the URL at the top of the page and select _Open Link in Incognito Window_ - this new window will connect as a `Client`. On the first window click _New Activity > Splat_. You should see the `Client` window update with button - clicking the button will update the `Presenter`.

## Contributing

- Jump in and build your own games & experiences immediately!
- Suggest new features and/or games
- Post feedback on your experience while using Digital Icebreakers with your group/talk/presentation
- If you want to make architectural improvements (of which many are needed), start a conversation first to improve the likelihood your PR is merged.

## Help

Ask here, or on [twitter](https://twitter.com/staff0rd), or [anywhere here](https://staffordwilliams.com/about/).
