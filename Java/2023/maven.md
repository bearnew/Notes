# Maven

> https://mvnrepository.com/

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

## 5.idea 创建 Maven 工程

1. idea 创建 Maven 工程
   - ![20231223123815-2023-12-23](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231223123815-2023-12-23.png)
2. 创建 html
   - ![20231223124248-2023-12-23](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231223124248-2023-12-23.png)
3. 配置 tomcat
   - ![20231223124456-2023-12-23](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231223124456-2023-12-23.png)
   - ![20231223124519-2023-12-23](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231223124519-2023-12-23.png)
   - ![20231223124656-2023-12-23](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231223124656-2023-12-23.png)
   - ![20231223124718-2023-12-23](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231223124718-2023-12-23.png)
   - ![20231223124834-2023-12-23](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231223124834-2023-12-23.png)
   - ![20231223125010-2023-12-23](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231223125010-2023-12-23.png)
   - ![20231223125051-2023-12-23](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231223125051-2023-12-23.png)

## 6.maven 项目结构

- ![20231224011000-2023-12-24](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231224011000-2023-12-24.png)

## 7.lombok

1. 提供注解，帮助生成`get` `set`方法和`toString`方法

```java
@Data
@AllArgsConstructor // 有参构造
@NoArgsConstructor // 无参构造
public class User {
   private Integer id;
   private String username;
   private String password;
}
```

2. 通过 idea 左侧的`Structure`可以看到生成的`get` `set`方法

## 8.在 pom.xml 所在目录中执行 mvn 命令

- ![20231224012308-2023-12-24](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231224012308-2023-12-24.png)
- `mvn compile`将`java`文件编译成`.class`结尾的字节码文件
- `mvn package`将`java`工程打包成`jar`包
- 添加打`war`包的`maven-war-plugin`插件到 pom.xml，执行`mvn package`将`web`工程打包成`war`包
- 通过将`mvn install`将坐标中的包安装到本地仓库
- `mvn clean`将编译出的`target`文件清理掉
- 在 src 的 test 目录下创建文件测试，执行`mvn test`

```java
// 类以Test结尾
public class MavenTest {
   @Test
   // 方法以test开头
   public void testAssert() {
      int a = 10;
      int b = 20;
      // 断言
      Assertions.assertEquals(a + b, 20)
   }
}
```

## 9.在 idea 的可视化中执行 mvn 命令

- ![image.png-2023-12-24](https://raw.githubusercontent.com/bearnew/picture/master/picGo/image.png-2023-12-24.png)

## 10.mvn 命令的生命周期

- clean -> compile -> test -> package -> install -> deploy

## 11.maven 依赖管理

1. 通过定义 POM 文件，Maven 能够自动解析项目的依赖关系
2. 通过 Maven 仓库自动下载和管理依赖
3. pom 中的`dependencies`定义依赖
4. pom 中的`properties`用于自定义属性
5. ![20231225012115-2023-12-25](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231225012115-2023-12-25.png)

## 12.maven 依赖范围

- ![20231225012643-2023-12-25](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231225012643-2023-12-25.png)

## 13.Maven 下载失败

1. 下载失败
   1. 网络问题
   2. 依赖项的 GVNP 是否对应
   3. 本地 Maven 仓库或缓存被污染损坏
2. 删除本地 jar 包的缓存文件.lastUpdated 文件
3. 脚本批量删除缓存文件

```shell
find ~/.m2/repository -name "*.lastUpdated" -type f -delete
```

## 14.maven 的构建配置

1. 指定打包命名

```xml
<!-- 默认的打包名称：artifactid+version.打包方式 -->
<build>
   <finalName>maven_web-1.0.war</finalName>
</build>
```

2. 指定打包文件
   - 在 java 文件夹中添加 java 类，会自动打包编译到 classes 文件夹下
   - 在 java 文件中添加 xml 文件，默认不会打包
   - 默认情况，按照 maven 工程结构放置的文件会默认被编译和打包
   ```xml
   <build>
      <!-- 设置要打包的资源位置 -->
      <resources>
         <resource>
            <!-- 设置资源所在目录 -->
            <directory>src/main/java</directory>
            <includes>
               <!-- 设置包含的资源类型 -->
               <include>**/*.xml</include>
            </includes>
         </resource>
      </resources>
   </build>
   ```
3. 构建配置插件
   - 在 build/plugins/plugin 标签中引入插件
   - 常用的插件: 修改 jdk 版本、tomcat 插件、mybatis 分页插件、mybatis 逆向工程插件
   - ![20231227013119-2023-12-27](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231227013119-2023-12-27.png)
4. Maven 依赖传递特性
   - C->B->A，执行 C 会自动下载 B 和 A，这就是依赖的传递性
   - 依赖传递终止
     - 非`compile`范围进行依赖传递
     - 使用`optional`配置终止传递
     - 依赖冲突(传递的依赖已经存在)
   - 依赖冲突优先级
     - 依赖路径更短的被依赖
     - 依赖路径长度相同，在`depencies`中先声明的被依赖
   - 使用`exclusions`排除依赖
     - ![20231227014506-2023-12-27](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231227014506-2023-12-27.png)

## 15.maven 的继承

1. 继承的概念
   1. 一个项目继承另一个项目的配置信息，共享同一配置信息，简化项目的管理和维护
2. 继承的作用
   - 在父工程中统一管理项目的依赖信息
   - 背景
     - 对大型项目模块拆分
     - 1 个 project 下，创建多个 module
     - 每个 module 都需要配置自己的依赖信息
   -
3. 继承语法
   - ![20231230014709-2023-12-30](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231230014709-2023-12-30.png)
4. 父工程统一管理依赖
   - ![20231230014816-2023-12-30](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231230014816-2023-12-30.png)
   - ![20231230014912-2023-12-30](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231230014912-2023-12-30.png)
   - ![20231230014955-2023-12-30](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231230014955-2023-12-30.png)
5. 聚合
   1. 聚合作用
      - 管理多个子项目，通过聚合，将多个子项目组织在一起，方便管理和维护
      - 聚合后，在一个命令中构建和发布多个相关项目，简化部署和维护工作
      - 优化多个项目的构建顺序
      - 统一管理依赖
   2. 父项目中的聚合语法
      - ![20231230015308-2023-12-30](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231230015308-2023-12-30.png)

## 16.maven 的私服

1. 私服优势
   - 节省外网带宽
   - 下载速度更快
   - 便于部署公司内部私有构件
   - Nexus 提供的权限管理、RELEASE/SHAPSHOT 版本控制， 提高项目稳定性
2. 使用 Nexus 搭建 Maven 私服
   - https://www.hangge.com/blog/cache/detail_2844.html
