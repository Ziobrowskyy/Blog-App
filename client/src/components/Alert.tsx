import React, {Component, MouseEvent} from "react"
import "../styles/Alert.scss"

export type AlertType = "warn" | "alert" | "info" | "success"

interface IProps {
    type: AlertType
    children: string
    className: string
    onDismiss?: (e: MouseEvent) => any
}

interface IState {
    isDismissed: boolean
}

export default class Alert extends Component<IProps, IState> {
    static defaultProps = {
        className: "",
        type: "info"
    }

    constructor(props: IProps) {
        super(props)
        this.state = {
            isDismissed: false
        }
    }

    onClick(e: MouseEvent) {
        this.setState({isDismissed: true})
        this.props.onDismiss?.(e)
    }

    render() {
        const {type, children, className} = this.props
        const {isDismissed} = this.state
        return (
            <div className={`alert alert-${type} ${className}`} style={isDismissed ? {display: "none"} : {}}>
                <div className={"content"}>
                    {children}
                </div>
                <div className={"controls"}>
                    <div className={"button-dismiss"} onClick={this.onClick.bind(this)}>x</div>
                </div>
            </div>
        )
    }
}