# spring 学习

> https://spring.io/

## 1.初始 spring

1. 简化开发
   1. IOC
   2. AOP
      1. 事务处理
2. 框架整合
   1. MyBatis
   2. MyBatis-plus
   3. Struts
   4. Struts2
   5. Hibernate
3. Spring 最重要的框架
   1. Spring Framework，底层框架
   2. Spring Boot，快速开发
   3. Spring Cloud，分布式开发

## 2.Spring Framework

- Data Access: 数据访问
- Data Integration: 数据集成
- Web: Web 开发
- AOP: 面向切面编程
- Aspects: AOP 思想实现
- Core Container: 核心容器
- Test: 单元测试
- ![20231127013235-2023-11-27](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231127013235-2023-11-27.png)

## 3.Spring 核心概念

1. IOC(Inversion of Control 控制反转)
   1. 使用对象时，不用手动使用 new 产生对象，转换为由外部提供对象
   2. 对象的创建控制权由程序转移到外部，这种思想称为控制反转
   3. 目的：解耦
   4. Spring 提供了一个容器，称为 IOC 容器，用来充当 IOC 思想中的外部
   5. IOC 容器负责对象创建、初始化过程，被创建或被管理的对象在 IOC 容器中称为 Bean
2. DI(Dependency Injection 依赖注入)
   1. 在容器中建立 bean 与 bean 之间依赖关系的整个过程，称为依赖注入
   2. 从程序中去除 DAO 对象时，已经绑定好了依赖关系

## 4.IOC 入门案例

1. 流程
   1. 管理 Service Dao
   2. 通过配置将被管理的对象告知 IOC 容器
   3. 通过接口获取 IOC 容器
   4. 通过接口方法获取 bean
   5. 使用 spring 导入 pom.xml 坐标
2. 案例

   1. pom.xml

   ```xml
   <!-- 导入spring的坐标spring-context，对应的版本是5.2.10.RELEASE -->
   <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
      <version>5.2.10.RELEASE </verion>
   </dependency>
   ```

   2. 定义 Spring 管理的类

   ```java
   public interface BookService {
      public void save();
   }

   public class BookServiceImpl implements BookService {
      private BookDao bookDao = new BookDaoImpl();

      public void save() {
         bookDao.save();
      }
   }
   ```

   3. resource -> applicationContext.xml

   ```xml
   <!-- 配置bean，id为bean的名字，class为bean的类型 -->
   <bean id="bookService" class="com.itheima.dao.impl.BookServiceImpl">
   ```

   3. App2.java

   ```js
   public class App {
      public static void main(String[] args) {
         // 初始化，加载配置文件得到上下文对象，获取IOC容器
         ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml")
         // 获取bean
         BookService bookService = ctx.getBean('bookService');
         bookService.save();
      }
   }
   ```

## 5.DI 入门案例

1. 删除使用 new 的形式创建对象的代码

```java
public class BookServiceImpl implements BookService {
   // private BookDao bookDao = new BookDaoImpl();

   public void save() {
      bookDao.save()
   }
}
```

2. 提供依赖对象对应的 setter 方法

```java
public class BookServiceImpl implements BookService {
   private BookDao bookDao;

   public void save() {
      bookDao.save()
   }

   public void setBookDao(BookDao bookDao) {
      this.bookDao = bookDao;
   }
}
```

3. 配置 service 与 dao 之间的关系

```xml
<bean id="bookService" class="com.itheima.dao.impl.BookServiceImpl">
   <property name="bookDao" ref="bookDao" />
</bean>
<bean id="bookDao" class="com.itheima.dao.impl.BookDaoImpl" />
```
