import React from "react"

interface IProps {
    children: string
}

export default function FormHeader({children = "Form header"}: IProps) {
    return (
        <div className={"form-header"}>{children}</div>
    )
}