import { PixiPresenter } from '../pixi/PixiPresenter';
import { Colors } from '../../Colors';
import { Graph } from '../pixi/Graph';

export class DoggosVsKittehsPresenter extends PixiPresenter {
    displayName = DoggosVsKittehsPresenter.name

    constructor(props, context) {
        super(0xFFFFFF, props,context);
        this.state = {
            doggos: 0,
            kittehs: 0,
            undecided: 0
        };
    }

    init() {
        var data = [
            {label: "Doggos", value: this.state.doggos, color: Colors.Red.C500},
            {label: "Undecided", value: this.state.undecided, color: Colors.Grey.C500},
            {label: "Kittehs", value: this.state.kittehs, color: Colors.Blue.C500}
        ]

        this.graph = new Graph(this.app, data);
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.connection.on("gameUpdate", (result) => {
            this.setState({
                doggos: result.doggos,
                kittehs: result.kittehs,
                undecided: result.undecided
            }, this.init);
        });
    }
}
