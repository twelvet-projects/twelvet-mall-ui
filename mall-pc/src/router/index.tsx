import {lazy, ReactNode, Suspense} from 'react'
import type {RouteObject} from 'react-router-dom'

const Layout = lazy(() => import('../layout'))
const Index = lazy(() => import('../pages/Index'))
const GoodsDetail = lazy(() => import('../pages/Goods/Detail'))
const About = lazy(() => import('../pages/About'))
const Info = lazy(() => import('../pages/Info'))

const NotFound = lazy(() => import('../pages/Error/404.tsx'))

const lazyLoad = (children: ReactNode) => {
    return <Suspense fallback={<>loading</>}>
        {children}
    </Suspense>
}

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Layout/>,
        children: [
            // 首页
            {
                index: true,
                element: lazyLoad(<Index/>),
            },
            // 商品详情
            {
                path: '/goods/detail/:goodsId',
                element: lazyLoad(<GoodsDetail/>),
            },
            {
                path: '/about',
                element: lazyLoad(<About/>),
            },
            {
                path: '/info',
                element: lazyLoad(<Info/>),
            },
            {
                path: '*',
                element: lazyLoad(<NotFound/>),
            },
        ]
    },
    {
        path: '*',
        element: lazyLoad(<NotFound/>),
    },
]

export default routes
