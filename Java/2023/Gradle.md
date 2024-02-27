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

## 4.配置 Gradle 从国内源/内网下载

1. 配置只在当前项目生效

```java
// 在 build.gradle 文件内修改/添加 repositories 配置
repositories {
    maven {
        url "http://maven.aliyun.com/nexus/content/groups/public"
    }
}
```

2. 配置全局生效

- 找到 `~/.gradle/init.gradle` 文件，如果找不到 `init.gradle` 文件，自己新建一个

```java
allprojects {
    repositories {
        maven {
            url "http://maven.aliyun.com/nexus/content/groups/public"
        }
    }
}

```

3. 验证是否修改成功

- 在 `build.gradle` 文件内增加一个任务

```java
task showRepos {
    doLast {
        repositories.each {
            println "repository: ${it.name} ('${it.url}')"
        }
    }
}

```

- 执行 gradle -q showRepos 任务，如果输出了刚刚配置的地址就说明修改成功

```shell
# repository: maven ('http://maven.aliyun.com/nexus/content/groups/public')
$ gradle -q showRepos
```

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

## 7.Gradle JVM 进程

1. Gradle 是运⾏在 JVM 实例上的⼀个程序，内部使⽤ Groovy 语⾔
2. Groovy 是⼀种 JVM 上的脚本语⾔，基于 java 扩展的动态语⾔
3. Gradle 会把 `.gradle Groovy` 脚本编译成 `.class java` 字节码⽂件在 JVM 上运⾏，最终还是 java 的运行机制
4. Gradle 构建⼯具在不同场景下会分别使⽤ 3 个 JVM 进程：
5. Gradle JVM 进程 1 - Client 进程
   1. client 进程的任务是查找并和 Daemon 进程通信
   2. Daemon 进程没启动，client 进程会启动⼀个新的 Daemon 进程
   3. Daemon 进程已经存在了，client 进程就给 Daemon 进程传递本次构建相关的参数和任务，然后接收 Daemon 进程发送过来的⽇志
   4. gradle.properties ⾥⾯设置的参数，全局 init.gradle 初始化脚本的任务这些都需要 client 进程传递给 Daemon 进程。
6. Gradle JVM 进程 2 - Daemon 进程
   1. Daemon 进程负责具体的构建任务。
   2. 使⽤ AS 打包 APK 这依靠的不是 AS 这个 IDEA 开发⼯具，⽽是 Gradle 构建⼯具⾃⼰启动的、专⻔的⼀个负责构建任务的进程：Daemon
   3. Daemon 进程是守护进程，会缓存插件、依赖等资源，构建结束会休眠，等待下一次构建，为了节省系统资源，加快构建速度
   4. 每个 Gradle 版本对应 1 个 Daemon 进程
   5. Daemon 进程在以下情况会失效
      1. 修改 JVM 配置会造成启动新的构建进程
      2. Gradle 将杀死任何闲置了 3 ⼩时或更⻓时间的守护程序
      3. ⼀些环境变量的变化，如语⾔、keystore、keyStorePassword、keyStoreType 这些变化都会造成旧有的守护进程失效
7. Gradle JVM 进程 3 - Wrapper 进程
   1. `Wrapper` 进程负责下载管理 `Gradle` 版本
   2. 根据 `gradle.properties` ⾥⾯的参数⾃⾏去 `gradle-wrapper.jar` ⾥⾯的下载程序去下载 `Gradle` ⽂件，完事 `wrapper` 进程会关闭。

## 8.Groovy 语法

1. Groovy 是⼀种基于 JVM 的动态语⾔，他的语法和 Java 相似，最终也是要编译 .class 在 JVM 上运⾏。
2. Groovy 完全兼容 Java 并且在此基础上添加了很多动态类型和灵活的特性，⽐如⽀持闭包，⽀持 DSL（领域特定语⾔），是⼀⻔⾮常灵活的动态脚本语⾔。
3. 要执⾏ groovy 的脚本必须要安装 groovy 环境，或者使⽤ Java 的 ClassLoader 来调⽤，这⾥主要讲解语法，不对 groovy 的执⾏环境进⾏讲解。

## 9.Gradle 的构建过程

1. `Initialization` --> 初始化阶段。按顺序执⾏ `init.gradle` -> `settings.gradle` 脚本，⽣成 `Gradle`、`Setting`、`Project` 对象
   - 获取 Gradle Home、Gradle User Home ⽬录
   - 添加全局监听
   - 给所有项⽬添加设置、依赖等
   - Initialization 阶段会按照先后顺序运⾏ 2 个 Groovy 脚本
     - Init Script：创建内置对象 Gradle
     - Setting Script：创建内置对象 Setting、每个 module 对应的 Project 对象
2. `Configuration` --> 编译阶段，也叫配置阶段。按顺序执⾏ `root` `build.gradle` -> ⼦项⽬`build.gradle` 脚本，⽣成 Task 执⾏流程图
3. `Execution` --> 执⾏阶段。按照 `Task` 执⾏图顺序运⾏每⼀个 Task，完成⼀个个步骤，⽣成最终 APK ⽂件

## 10.Gradle 中的 Task 任务

1. Task 任务可以编译 java 代码、编译 C/C++ 代码、编译资源⽂件⽣成对应的 R ⽂件、打包⽣成 jar、aar 库⽂件、签名、混淆、图⽚压缩、打包⽣成 APK ⽂件、包/资源发布等。
2. 不同类型的项⽬ Task 任务种类不同，Gradle 现在可以构建 java、android、web、lib 项⽬。

## 11.Gradle 中的插件

- https://github.com/jeanboydev/Android-ReadTheFuckingSourceCode/blob/master/article/gradle/Gradle-%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91.md

## 12.Gradle SpringBoot 项目

1. springboot 官方不再支持 java8，创建 springboot 时，选择不了 java8
2. 将`Spring Initializr`中的`https://start.spring.io`修改成`https://start.aliyun.com`

## 13.Gradle 微服务项目

## 14.Gradle 安装报错

1. 报错`You have JVM property https.proxyHost set to '...'.`
2. 选择 Help -> Edit Custom VM Options
3. 找到`idea.vmoptions`的路径，添加以下内容

```java
-Dhttp.proxyHost
-Dhttp.proxyPort
-Dhttps.proxyHost
-Dhttps.proxyPort
-DsocksProxyHost
-DsocksProxyPort
```

4. 选择 file -> Invalidate Caches，等待 gradle 重新下载
