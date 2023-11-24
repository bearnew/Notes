# IntelliJ-IDEA 学习

> https://cdk8s.gitbook.io/github/

## 1. 常用快捷键

- psvm: 生成 main 方法
- sout: 输出打印语句
- cmd + d: 复制
- cmd + shift + 上箭头/下箭头: 代码移动
- alt + enter: 导包，生成变量
- ctrl + /: 单行注释/取消
- ctrl + shift + /: 多行注释/取消
- ctrl + alt + t: 给选中的代码块选择 try catch 等
- alt + insert: 给 class 添加方法/属性

## 2. 搭建 Java web

1. 下载安装 Tomcat
   - 开源的 Web 应用服务器，它实现了 Java Servlet 和 JavaServer Pages（JSP）规范。Tomcat 主要用于 Java Web 应用程序的部署和运行
   - https://zhuanlan.zhihu.com/p/539596475
2. 创建 1 个`maven-archetype-webapp`的项目
   - https://cdk8s.gitbook.io/github/maven-project-introduce
3. 在`Run/Debug Configuration`中添加`Tomcat`服务器，并配置端口号
   - https://cdk8s.gitbook.io/github/maven-project-introduce
4. run

## 3.Debug

1. https://cdk8s.gitbook.io/github/debug-introduce

## 4.Gradle 和 Maven

1. Maven
   - 项目结构和组织良好
   - Maven 自动执行下载 Jar 文件和其他依赖项的任务。
   - Maven 可以通过在 POM 文件中编写依赖代码来轻松地合并新的依赖。
   - Maven 是可扩展的，并且可以使用脚本语言或 Java 轻松编写插件。
2. Gradle
   - Gradle 是一种用于创建插件的工具，是一种灵活的工具。
   - Gradle 高度可定制的属性。该工具可以在各种技术下针对不同的项目进行修改。
   - Gradle 是一种用于创建插件的工具，是一种灵活的工具。
