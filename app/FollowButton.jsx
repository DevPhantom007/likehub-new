'use client'
import { followUser } from './actions'
import { useState } from 'react'

export default function FollowButton({ targetUserId, isFollowing: initialFollowing }) {
    const [following, setFollowing] = useState(initialFollowing || false)

    const handleFollow = async () => {
        setFollowing(!following)
        await followUser(targetUserId)
    }

    return (
        <button
            onClick={handleFollow}
            className={following ? 'btn-secondary' : 'btn-primary'}
            style={{ fontSize: '12px', padding: '5px 10px' }}
        >
            {following ? 'Following' : 'Follow'}
        </button>
    )
}