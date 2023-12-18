# Maven

## 1.Maven-依赖管理工具

- 依赖的 jar 包自动下载
- 通过坐标查找 jar 包位置，本地仓库查找->镜像网站查找
- 自动管理 jar 包的依赖关系
- ![20231219015325-2023-12-19](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231219015325-2023-12-19.png)

## 2.Maven-构建工具

- 将 java 工程生成 jar 包
- 将 web 工程构建成 war 包

## 3.Maven 工作原理

- ![20231219020643-2023-12-19](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231219020643-2023-12-19.png)

## 4.Maven 的 GAVP

1. `GroupID`格式
   - com.[公司/BU].[业务线].[子业务线]
   - 如 com.alibaba.sourcing.multilang
2. `ArtifactID`格式:
   - 产品线名-模块名
   - 如：tc-client，tair-tool
3. `Version`版本号格式:
   - 主版本号.次版本号.修订号
   - 如：主版本 1.0.0，功能调整 1.1.0，bug 修改 1.1.1
4. `Packaging`定义规则
   - `idea` 根据 packaging 的值，识别 maven 项目类型
   - `jar`: 普通的 java 工程，打包以后时.jar 结尾的文件
   - `war`: java 的 web 工程，打包以后.war 结尾的文件
   - `pom`: 不会打包，用来继承父工程
