import React from 'react'
import {Link} from 'react-router-dom'

export default function NotFound() {
    return (
        <div>
            404 请找转到<Link to='/'>首页</Link>
        </div>
    )
}
