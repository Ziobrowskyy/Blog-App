import React, {ChangeEventHandler, HTMLInputTypeAttribute} from "react";

interface IProps {
    name?: string
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
        switch (this.props.as) {
            case("textarea"):
                return <TextAreaInput name={this.props.name} onChange={onChange as ChangeEventHandler<HTMLTextAreaElement>}/>
            case("file"):
                return <FileInput name={this.props.name} onChange={onChange as ChangeEventHandler<HTMLInputElement>}/>
            case("input"):
            default:
                return <DefaultInput name={this.props.name} type={this.props.type} onChange={onChange as ChangeEventHandler<HTMLInputElement>}/>
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

const DefaultInput = (props: { name?: string, type: HTMLInputTypeAttribute, onChange: ChangeEventHandler<HTMLInputElement> }) =>
    <input name={props.name} type={props.type} onChange={props.onChange}/>

const TextAreaInput = (props: { name?: string, onChange: ChangeEventHandler<HTMLTextAreaElement> }) =>
    <textarea name={props.name} onChange={props.onChange}/>

const FileInput = (props: { name?: string, onChange: ChangeEventHandler<HTMLInputElement> }) =>
    <input name={props.name} type={"file"} multiple accept={"image/*"} onChange={props.onChange}/>