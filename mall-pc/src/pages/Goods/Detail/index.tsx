import React from 'react'
import {Skeleton} from 'antd'
import {useParams} from 'react-router-dom'
import './index.css'

const GoodsDetail: React.FC = () => {

    const {goodsId} = useParams();

    alert(goodsId)

    return (
        <>
            <Skeleton active/>
        </>
    )
}

export default GoodsDetail
