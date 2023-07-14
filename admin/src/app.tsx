import Footer from '@/components/Footer';
import { AvatarDropdown, AvatarName } from './components/RightContent/AvatarDropdown';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageLoading } from '@ant-design/pro-components';
import { errorConfig } from './requestErrorConfig';
import { SettingDrawer } from '@ant-design/pro-components';
import { RunTimeLayoutConfig, SelectLang } from '@umijs/max';
import { history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { message } from 'antd';
import TWT from './setting';
import { getCurrentUser, getRouters } from './pages/Login/service';
import { system } from "@/utils/twelvet";
import { Question } from './components/RightContent';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: any;
  loading?: boolean;
  fetchUserInfo?: any;
}> {
  const fetchUserInfo = async () => {
    try {
      const { user = {}, roles, permissions, code, msg } = await getCurrentUser()
      if (code !== 200) {
        return message.error(msg)
      }

      localStorage.setItem(TWT.preAuthorize, JSON.stringify(permissions))

      const { data } = await getRouters()

      return {
        user,
        menus: data,
        roles,
        permissions
      }
    } catch (error) {
      history.push(loginPath)
    }
    return undefined
  };
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    // 渲染菜单数据
    menuDataRender: () => initialState?.currentUser?.menus ? initialState?.currentUser?.menus : [],
    actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    avatarProps: {
      src: `${TWT.static}${initialState?.currentUser?.user?.avatar}`,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    disableContentMargin: false,
    // 水印设置
    /*waterMarkProps: {
      content: initialState?.currentUser?.user?.username,
    },*/
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menu: {
      defaultOpenAll: false,
      // 关闭菜单多语言
      locale: false,
    },
    links: isDev
      ? [
        <a key='docs' href="https://twelvet.cn/docs/" target="_blank" rel="noreferrer">
          <QuestionCircleOutlined />
          <span>官方文档</span>
        </a>,
        <a key='openapi' href="http://127.0.0.1:8080/doc.html" target="_blank" rel="noreferrer">
          <QuestionCircleOutlined />
          <span>Swagger</span>
        </a>
      ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState: any) => ({
                  ...preInitialState,
                  settings,
                })).then((r: any) => {
                  if (r !== undefined) {
                    system.log(r)
                  }
                });
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
