import React, {ChangeEventHandler, forwardRef} from "react"

interface IProps<T extends (HTMLInputElement | HTMLTextAreaElement)> {
    name?: string
    text: string
    type?: "text" | "password"
    onChange: ChangeEventHandler<T>
}
export const FormTextArea = forwardRef<HTMLTextAreaElement, IProps<HTMLTextAreaElement>>((props, ref) =>
    (
        <div className={"form-field"}>
            <label>
                <span>{props.text}</span>
                <textarea ref={ref} name={props.name} onChange={props.onChange}/>
            </label>
        </div>
    )
)
export const FormTextInput = forwardRef<HTMLInputElement, IProps<HTMLInputElement>>((props, ref) => {
    return (
        <div className={"form-field"}>
            <label>
                <span>{props.text}</span>
                <input ref={ref} name={props.name} type={props.type} onChange={props.onChange}/>
            </label>
        </div>
    )
})
export const FormFileInput = forwardRef<HTMLInputElement, IProps<HTMLInputElement>>((props, ref) => {
    return (
        <div className={"form-field"}>
            <label>
                <span>{props.text}</span>
                <input ref={ref} name={props.name} type={"file"} multiple accept={"image/*"} onChange={props.onChange}/>
            </label>
        </div>
    )
})