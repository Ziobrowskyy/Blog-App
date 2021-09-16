import React, {FormEventHandler, ReactNode} from "react"
import "../styles/Form.scss"

interface IProps {
    onSubmit?: FormEventHandler
    children?: ReactNode
    className?: string
}

export default function Form({className = "", children, onSubmit = (e) => e.preventDefault()}: IProps) {
    return (
        <form className={`form ${className}`} onSubmit={onSubmit}>
            {children}
        </form>
    )
}