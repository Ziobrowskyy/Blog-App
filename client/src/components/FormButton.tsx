import React, {FormEventHandler, MouseEventHandler} from "react"

export type ButtonType = "submit" | "reset" | "button"

interface IProps {
    variant: "primary" | "secondary"
    children: string
    type: ButtonType
    onSubmit?: FormEventHandler<HTMLButtonElement>
    onClick?: MouseEventHandler<HTMLButtonElement>
}

export default class FormButton extends React.Component<IProps> {

    static defaultProps = {
        variant: "secondary",
        type: "submit"
    }

    render() {
        return (
            <button className={`form-button form-button-variant-${this.props.variant}`}
                    onSubmit={this.props.onSubmit}
                    onClick={this.props.onClick}
                    type={this.props.type}
            >
                {this.props.children}
            </button>
        )
    }
}