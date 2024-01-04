# Gradle

## 1. 简介

1. Gradle 时继 Maven 之后的新一代构建工具，采用基于 groovy 的 DSL 语言作为脚本
2. 优点
   1. 脚本更加简洁、优雅、灵活
   2. 增量构建和缓存使 Gradle 的速度优于 Maven
3. 区别
   1. `maven` 的核心配置在 `pom.xml`，`gradle` 的核心配置在 `build.gradle`

## 2.gradle 目录结构

├─build.gradle 核心配置
├─gradlew.bat windows 执行命令
├─gradlew linux 执行命令
├─gradle
│ ├─wrapper
│ │ ├─gradle-wrapper.jar 本地没有找到与 wrapper.properties 版本相同的 Gradle，IDEA 会自动安装 gradle 环境
│ │ ├─gradle-wrapper.properties 版本、安装目录等配置

## 3.gradle 常用命令

| 用途            | 命令                 |
| :-------------- | :------------------- |
| 帮助命令        | gradle --help        |
| 查看版本        | gradle -v            |
| 清空 build 目录 | gradle clean         |
| 构建            | gradle build         |
| 跳过测试构建    | gradle build -x test |

## 4.配置 Gradle 从国内源下载

- ![20240105011638-2024-01-05](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20240105011638-2024-01-05.png)

## 5.gradle 中的名词

1. group: module 所在组
2. name: module 的名称
3. version: module 的版本号
4. apply: 在 module 中应用 1 个插件
5. dependencies: 声明 module 以来的 jar 包或者其他 module
6. repositories: 声明仓库，告诉程序去哪个仓库找对应的 module、jar 包等依赖
7. task: 用来声明 module 的任务，其对应 org.gradle.apiTask

## 6.gradle 依赖管理的 scope

| scope                           | 用途                                              |
| :------------------------------ | :------------------------------------------------ |
| implementation                  | 编辑和运行都包含在内，module 使用者编译不会被包含 |
| api                             | 编译和运行都可见，module 的使用者编译能看到       |
| compileOnly                     | 编译时可见                                        |
| runtimeOnly                     | 运行时可见                                        |
| testImplementaion               | 测试编译和运行时可见                              |
| testCompileOnly/testRuntimeOnly |                                                   |
