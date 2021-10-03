import React, { Component } from 'react'
import "../styles/Profile.scss"
import ProfielPerson from './Profile/ProfilePerson'
import ProfileRelation from './Profile/ProfileRelation'

export interface ProfileProps {
    user : {
        image : string;
        username : string;
        firstName : string;
        lastName : string;
        posts : number;
        followers : number;
        follows : number; 
    }
}

export default class Profile extends Component<ProfileProps> {

    render() {
        const { image, username, firstName, lastName, posts, followers, follows } = this.props.user
        return <div className="profile-container">
            <div className="profile-shadow">
                <div className="profile-content">
                    <div className="profile-person">
                        <ProfielPerson image={image} username={username} firstName={firstName} lastName={lastName} />
                    </div>
                    <hr />
                    <div className="profile-relations">
                        <ProfileRelation icon="image" count={posts} name="posts" />
                        <ProfileRelation icon="hand-sparkles" count={followers} name="followers" />
                        <ProfileRelation icon="hand-point-up" count={follows} name="follows" />
                    </div>
                    <hr />
                </div>
            </div>
        </div>
    }

}