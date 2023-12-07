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

## 6.Bean 基础配置

1. bean 的别名

```js
// 定义bean的别名，可定义多个，使用逗号(,)分号(;)空格()分隔
<bean
  id="bookDao"
  name="dao bookDaoImpl"
  class="com.itheima.dao.impl.BookDaoImpl"
/>
```

2. bean 的作用范围
   1. singleton: 单例(默认)
   2. prototype: 非单例

```js
// 非单例，每次调用都会生成1个实例
<bean
  id="bookDao"
  name="dao bookDaoImpl"
  class="com.itheima.dao.impl.BookDaoImpl"
  scope="prototype"
/>
```

3. 适合交给容器进行管理的 bean
   - 表现层对象
   - 业务层对象
   - 数据层对象
   - 工具对象
4. 使用构造方法创建 bean 对象
   - spring 创建 bean 使用的时无参构造方法

```java
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

5. 静态工厂创建 bean 对象

```xml
<bean id="orderDao" class="com.itheima.factory.OrderDaoFactory" factory-method="getOrderDao " />
```

```js
package com.itheima.factory;

public class OrderDaoFactory {
   public static OrderDao getOrderDao() {
      System.out.println("factory setup...")
      return new OrderDaoImpl();
   }
}
```

6. 实例工厂创建 bean 实例对象

```xml
<bean id="userFactory" class="com.itheima.factory.UserDaoFactory" />
<bean id="userDao" factory-method="getUserDao" factory-bean="userFactory" />
```

- 优化后

```java
public class UserDaoFactoryBean implements FactoryBean<UserDao> {
   public UserDao getObject() throws Exception {
      return new UserDaoImpl();
   }

   public Class<?> getObjectType() {
      return UserDao.class;
   }
}
```

```xml
<bean id="userDao" class="com.itheima.factory.UserDaoFacotryBean" />
```

7. bean 的生命周期
   1. 初始化容器
      1. 创建对象(内存分配)
      2. 执行构造方法
      3. 执行属性注入(set 操作)
      4. 执行 bean 初始化方法
   2. 使用 bean
      1. 执行业务操作
   3. 关闭/销毁容器
      1. 执行 bean 销毁方法
   4. 关闭容器的 2 种方式
      1. ConfigurableApplicationContext.close()
      2. ConfigurableApplicationContext.registerShutdownHook()

```xml
<!-- 使用配置控制生命周期 -->
<bean id="bookDao" class="com.itheima.dao.impl.BookDaoImpl" init-method="init" destroy-method="destroy" />
```

```java
package com.itheima.dao.impl;

import com.itheima.dao.BookDao;

public class BookDaoImpl implements BookDao {
   public void save() {
      System.out.println("book dao save...");
   }
   public void init() {
      System.out.println("init...");
   }
   public void destroy() {
      System.out.println("destroy...");
   }
}
```

```java
// 使用接口的形式控制生命周期
public class BookServiceImpl implements BookService, InitializingBean, DisposableBean {
   public void save() {
      System.out.println("book service save...")
   }
   public void afterPropertiesSet() throws Exception {
      System.out.println("afterPropertiesSet")
   }
   public void destroy() throws Exception {
      System.out.println("destroy")
   }
}
```

## 7.setter 注入

1. 引用类型

   - 在 bean 中定义引用类型属性并提供可访问的`set`方法

   ```java
   public class BookServiceImpl implements BookService {
      private BookDao bookDao;

      public void setBookDao(BookDao bookDao) {
         this.bookDao = bookDao;
      }
   }
   ```

   - 配置种使用`property`标签`ref`属性注入引用类型对象

   ```xml
   <bean id="bookService" class="com.itheima.service.impl.BookServiceImpl">
      <property name="bookDao" ref="bookDao" />
   </bean>
   ```

2. 简单类型
   - 在 bean 中定义简单类型属性并提供可访问的`set`方法
   ```java
   public class BookDaoImpl implements BookDao {
      private int connectionNumber;
      public void setConnectionNumber(int connectionNumber) {
         this.connectionNumber = connectionNumber;
      }
   }
   ```
   - 配置中使用`property`标签`value`属性注入简单类型数据
   ```xml
   <bean id="bookDao" class="com.itheima.dao.impl.BookDaoImpl">
      <property name="connectionNumber" value="10" />
   </bean>
   ```

## 8.构造器注入

1. 引用类型
   - 在 bean 中定义引用类型属性并提供可访问的构造方法
   ```java
   public class BookServiceImpl implements BookService {
      private BookDao bookDao;
      public BookServiceImpl(BookDao bookDao) {
         this.bookDao = bookDao;
      }
   }
   ```
   - 配置中使用`constructor-arg`标签`ref`属性注入引用类型对象
   ```xml
   <bean id="bookService" class="com.itheima.service.impl.BookServiceImpl">
      <constructor-arg name="bookDao" ref="bookDao" />
   </bean>
   ```
2. 简单类型
   - 在 bean 中定义简单类型属性并提供可访问的`set`方法
   ```java
   public class BookDaoImpl implements BookDao {
      private int connectionNumber;
      public void setConnectionNumber(int connectionNumber) {
         this.connectionNumber = connectionNumber;
      }
   }
   ```
   - 配置中使用`constructor-arg`标签`value`属性注入简单类型数据
   ```xml
   <bean id="bookDao" class="com.itheima.dao.impl.BookDaoImpl">
      <constructor-arg name="connectionNumber" value="10" />
   </bean>
   ```
3. 参数适配

   - 配置中使用`constructor-arg`标签`type`属性设置按形参类型注入

   ```xml
   <bean id="bookDao" class="com.itheima.dao.impl.BookDaoImpl">
      <constructor-arg type="int" value="10" />
      <constructor-arg type="java.lang.String" value="mysql" />
   </bean>
   ```

   - 配置中使用`constructor-arg`标签`index`属性设置按形参位置注入

   ```xml
   <bean id="bookDao" class="com.itheima.dao.impl.BookDaoImpl">
      <constructor-arg index="0" value="10" />
      <constructor-arg index="1" value="mysql" />
   </bean>
   ```

## 9.依赖注入方式选择

1. 强制依赖使用构造器进行，使用 setter 注入有概率不进行注入导致 null 对象出现
2. 可选依赖使用 setter 注入，灵活性强
3. Spring 推荐使用构造器进行数据初始化，相对严谨
4. 自己开发的模板推荐使用 setter 注入
