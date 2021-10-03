import React, { Component } from 'react'

export interface ProfilePersonPros {
    image : string;
    username : string;
    firstName : string;
    lastName : string;
}

export default class ProfielPerson extends Component<ProfilePersonPros> {

    render() {
        const { image, username, firstName, lastName } = this.props
        return <div className="profile-person-container">
            <div className="profile-person-image-desktop">
                <div className="profile-person-image-wrapper">
                    <img src={image} className="profile-person-image" alt="userimage" /> 
                </div>
            </div>
            <div className="profile-person-info">
                <div className="profile-person-info-row">
                    <span className="profile-person-name">{firstName} {lastName}</span>
                </div>
                <div className="profile-person-info-row mobile">
                    <div className="profile-person-info-image-wrapper">
                        <img src={image} className="profile-person-info-image" alt="userimage" />
                    </div>
                </div>
                <div className="profile-person-info-row">
                    <hr className="mobile"/>
                    <span className="profile-person-username">@{username}</span>
                </div>
            </div>
        </div>
    }

}