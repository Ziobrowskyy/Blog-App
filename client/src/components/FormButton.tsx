import React, {FormEvent, FormEventHandler, MouseEventHandler} from "react"

interface IProps {
    variant: "primary" | "secondary"
    children: string
    onSubmit?: FormEventHandler<HTMLButtonElement>
    onClick?: MouseEventHandler<HTMLButtonElement>
}

export default class FormButton extends React.Component<IProps> {

    static defaultProps = {
        variant: "secondary",
    }

    render() {
        return (
            <button className={`form-button form-button-variant-${this.props.variant}`}
                    onSubmit={this.props.onSubmit}
                    onClick={this.props.onClick}
                    type={"submit"}
            >
                {this.props.children}
            </button>
        )
    }
}