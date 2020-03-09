/*
 * @Author: LinWei
 * @since: 2020-01-05 15:30:54
 * @lastTime: 2020-03-09 18:51:23
 * @LastEditors: LinWei
 * @Description: 
 */
module.exports = {
    title: 'CoderLin',
    desciption: 'Just playing around',
    head: [
        ['link',
            {
                rel: 'icon',
                href: '/photo.jpg'
            }
            //浏览器的标签栏的网页图标，第一个'/'会遍历public文件夹的文件
        ],
    ],
    // 其它配置
    themeConfig: {
        repo: 'https://github.com/LINWEIya/blog',
        repoLabel: 'Github',
        editLinks: true,
        editLinkText: '编辑此页',
        nav: [{
                text: '首页',
                link: '/'
            },
            {
                text: 'HTML',
                link: '/html/'
            },
            {
                text: 'CSS',
                link: '/css/'
            },
            {
                text: 'JavaScript',
                link: '/javascript/'
            },
            {
                text: 'webpack',
                link: '/webpack/'
            },
            {
                text: '前端框架',
                items: [{
                        text: 'jQuery',
                        link: '/jquery'
                    },
                    {
                        text: 'Vue',
                        link: '/vue'
                    }
                ]
            },
            {
                text: '前端书籍',
                items: [{
                        text: '学习JavaScript数据结构与算法',
                        link: '/javaScript-datastructures-algorithms-book'
                    },
                    {
                        text: 'JavaScript核心技术开发解密',
                        link: '/javaScript-core-development-book'
                    },
                    {
                        text: '前端面试江湖',
                        link: '/interview-book'
                    }
                ]
            }
        ],
        // 侧边栏
        sidebar: {
            '/html/': ['', 'html1'],
            '/css/': [''],
            '/javascript/': [
                'interview',
                'handwriting'
            ],
            '/':['']
        },
        // 1.接受字符串，它设置了最后更新时间的label，例如：最后更新时间：2019年5月3日 21:51:53
        // 2.设置true，开启最后更新时间
        // 3.设置false，不开启最后更新时间(默认)
        lastUpdated: '最后更新时间'
    }
}