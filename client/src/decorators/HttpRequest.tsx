import { Component } from "react";

export default function HttpRequest(target : Component, property : string, descriptor : PropertyDescriptor) : void {

    const method : (...args : Array<any>) => void | Promise<void> = descriptor.value;

    descriptor.value = async function (this : Component, ...args : Array<any>) {

        try {

            await method.call(this, ...args);

        } catch (error) {

            alert(error);

        }

    } 

}