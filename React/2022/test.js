function SamplePages() {
    return (
        <div className="sample-pages">
            {/* 定义了侧边导航栏 */}
            <div className="sider">
                <a href="#page1">Page 1</a>
                <a href="#page2">Page 2</a>
                <a href="#page3">Page 3</a>
                <a href="#page4">Page 4</a>
            </div>
            <div className="exp-15-page-container">
                {/* 定义路由配置 */}
                <MyRouter>
                    <Route path="page1" component={Page1} />
                    <Route path="page2" component={Page2} />
                    <Route path="page3" component={Page3} />
                    <Route path="page4" component={Page4} />
                </MyRouter>
            </div>
        </div>
    );
}
