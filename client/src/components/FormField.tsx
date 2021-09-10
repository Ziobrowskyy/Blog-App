import React, {ChangeEventHandler, HTMLInputTypeAttribute} from "react";

interface IProps {
    text: string
    type: HTMLInputTypeAttribute,
    onChange: ChangeEventHandler<HTMLInputElement>
}

export default class FormField extends React.Component<IProps> {
    static defaultProps = {
        type: "text"
    }

    render() {
        return (
            <div className={"form-field"}>
                <label>
                    <span>{this.props.text}</span>
                    <input type={this.props.type} onChange={this.props.onChange}/>
                </label>
            </div>
        )
    }
}