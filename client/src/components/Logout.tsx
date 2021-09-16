import React, {useState} from "react"
import Form from "./Form"
import FormButton from "./FormButton"
import FormHeader from "./FormHeader"
import {API} from "../API"

export default function Logout(props: { onLogin: () => void }) {
    const [state, setState] = useState<boolean>(false)

    API.logout().then(() => setState(true))

    return (
        <div className={"panel-wrapper"}>
            <Form>
                <FormHeader>log out</FormHeader>
                {state && <FormButton onClick={props.onLogin}>Ok</FormButton>}
            </Form>
        </div>
    )
}