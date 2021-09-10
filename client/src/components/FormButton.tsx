import React, {FormEvent, FormEventHandler, MouseEventHandler} from "react";

interface IProps {
    variant: "primary" | "secondary"
    action: string
    children: string
    onSubmit: FormEventHandler<HTMLButtonElement>
    onClick: MouseEventHandler<HTMLButtonElement>
}

export default class FormButton extends React.Component<IProps> {

    static defaultProps = {
        variant: "secondary",
        action: "",
        onSubmit: (e: FormEvent<HTMLButtonElement>) => e.preventDefault(),
        onClick: (e: MouseEvent) => e.preventDefault()
    }

    render() {
        return (
            <button className={`form-button form-button-variant-${this.props.variant}`}
                formAction={this.props.action}
                onSubmit={this.props.onSubmit}
                onClick={this.props.onClick}>
                {this.props.children}
            </button>
        )
    }
}