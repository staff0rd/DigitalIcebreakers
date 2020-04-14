import { PixiView } from '../pixi/PixiView';
import { Colors } from '../../Colors';
import { Graph } from '../pixi/Graph';
import { BaseGameProps } from '../BaseGame';
import { YesNoMaybeState } from '../YesNoMaybe/YesNoMaybePresenter';

export class DoggosVsKittehsPresenter extends PixiView<BaseGameProps, YesNoMaybeState> {
    displayName = DoggosVsKittehsPresenter.name
    graph!: Graph;
    
    constructor(props: BaseGameProps) {
        super(0xFFFFFF, props);
        this.state = {
            yes: 0,
            no: 0,
            maybe: 0
        };
        this.init();
    }

    init() {
        var data = [
            {label: "Doggos", value: this.state.yes, color: Colors.Red.C500},
            {label: "Undecided", value: this.state.maybe, color: Colors.Grey.C500},
            {label: "Kittehs", value: this.state.no, color: Colors.Blue.C500}
        ]

        this.graph = new Graph(this.app, data);
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.connection.on("gameUpdate", (result) => {
            this.setState({
                yes: result.doggos,
                no: result.kittehs,
                maybe: result.undecided
            }, this.init);
        });
    }
}
