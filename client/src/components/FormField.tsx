import React, {ChangeEventHandler, HTMLInputTypeAttribute} from "react";

interface IProps {
    text: string
    as?: "input" | "textarea" | "file"
    type: HTMLInputTypeAttribute,
    onChange: ChangeEventHandler<HTMLInputElement> | ChangeEventHandler<HTMLTextAreaElement>
}

export default class FormField extends React.Component<IProps> {
    static defaultProps = {
        type: "text"
    }

    RenderByType() {
        const onChange = this.props.onChange
        switch(this.props.as) {
            case("textarea"):
                return <TextAreaInput onChange={onChange as ChangeEventHandler<HTMLTextAreaElement>}/>
            case("file"):
                return <FileInput onChange={onChange as ChangeEventHandler<HTMLInputElement>}/>
            case("input"):
            default:
                return <DefaultInput type={this.props.type} onChange={onChange as ChangeEventHandler<HTMLInputElement>}/>
        }
    }
    render() {
        return (
            <div className={"form-field"}>
                <label>
                    <span>{this.props.text}</span>
                    {this.RenderByType()}
                </label>
            </div>
        )
    }
}

const DefaultInput = (props: {type: HTMLInputTypeAttribute, onChange: ChangeEventHandler<HTMLInputElement>}) =>
    <input type={props.type} onChange={props.onChange}/>

const TextAreaInput = (props: {onChange: ChangeEventHandler<HTMLTextAreaElement>}) =>
    <textarea onChange={props.onChange}/>

const FileInput = (props: {onChange: ChangeEventHandler<HTMLInputElement>}) =>
    <input type={"file"} multiple accept={"image/*"} onChange={props.onChange}/>