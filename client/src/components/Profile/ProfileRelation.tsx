import React, { Component } from 'react'
import { IconName } from '@fortawesome/fontawesome-common-types'

export interface ProfileRelationProps {
    icon : IconName;
    count : number;
    name : string;
}

export default class ProfileRelation extends Component<ProfileRelationProps> {

    count(count : number) {
        return count
    }

    render() {
        const { icon, count, name } = this.props
        return <div className="profile-relation">
            <div className="profile-relation-image-box">
                <i className={`profile-relation-image fas fa-${icon}`} />
            </div>   
            <div className="profile-relation-count-box">
                <span className="profile-relation-count">{this.count(count)}</span>
            </div>
            <div className="profile-relation-name-box">
                <span className="profile-relation-name">{name}</span>
            </div>
        </div>
    }
}