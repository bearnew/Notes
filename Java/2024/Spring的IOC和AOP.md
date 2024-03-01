# Spring 的 IOC 和 AOP

## 1.IOC

> IOC 是 Spring 全家桶各个功能模块的基础，创建对象的容器

### 1. 概念

- 控制反转，将对象的创建进行反转，常规情况下，对象都是开发者手动创建的，使用 IOC 开发者不再需要创建对象，而是由 IOC 容器根据需求自动创建项目所需对象

### 2. 基于 XML 实现 IOC

> Spring 会根据 XML 文件中的配置来实例化对象并管理它们的生命周期，实现了 IoC 和依赖注入。

1. 创建一个接口和一个实现类：

```java
// 接口
public interface MessageService {
    String getMessage();
}

// 实现类
public class EmailService implements MessageService {
    @Override
    public String getMessage() {
        return "Email message";
    }
}
```

2. 更新 Spring 配置文件 applicationContext.xml：

```xml
<!-- 配置bean -->
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 声明bean -->
    <bean id="emailService" class="com.example.EmailService" />

    <!-- 声明依赖注入 -->
    <bean id="messageProcessor" class="com.example.MessageProcessor">
        <property name="messageService" ref="emailService" />
    </bean>

</beans>
```

3. 创建一个处理器类来处理消息

```java
public class MessageProcessor {
    private MessageService messageService;

    // setter方法用于依赖注入
    public void setMessageService(MessageService messageService) {
        this.messageService = messageService;
    }

    public void processMessage() {
        System.out.println(messageService.getMessage());
    }
}
```

4. 更新 MainApp

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class MainApp {
    public static void main(String[] args) {
        // 加载Spring配置文件
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");

        // 从容器中获取bean
        MessageProcessor messageProcessor = (MessageProcessor) context.getBean("messageProcessor");

        // 调用方法
        messageProcessor.processMessage();
    }
}
```

### 3. 基于注解实现 IOC

> Spring 会自动扫描标记了 @Component 注解的类，并进行实例化和依赖注入。在处理器类中，@Autowired 注解用于自动装配 MessageService 的实现类。您可以根据需要在其他类中使用 @Autowired 注解来进行依赖注入。

1. 创建一个接口和一个实现类

```java
// 接口
public interface MessageService {
    String getMessage();
}

// 实现类
@Component
public class EmailService implements MessageService {
    @Override
    public String getMessage() {
        return "Email message";
    }
}
```

2. 创建一个处理器类并在其中注入依赖

```java
@Component
public class MessageProcessor {
    private final MessageService messageService;

    @Autowired
    public MessageProcessor(MessageService messageService) {
        this.messageService = messageService;
    }

    public void processMessage() {
        System.out.println(messageService.getMessage());
    }
}
```

3. 在 Spring 配置类中启用组件扫描并初始化 IoC 容器

```java
@Configuration
@ComponentScan(basePackages = "com.example")
public class AppConfig {
}
```

4. 编写一个类来加载 Spring 容器并获取 bean

```java
public class MainApp {
    public static void main(String[] args) {
        // 加载Spring配置类
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);

        // 从容器中获取bean
        MessageProcessor messageProcessor = context.getBean(MessageProcessor.class);

        // 调用方法
        messageProcessor.processMessage();

        // 关闭容器
        context.close();
    }
}
```

## 2.AOP

> AOP 以 IOC 为基础，AOP 是面向切面编程，抽象化的面向对象，AOP 要做的就是将日志代码全部抽象出去统一进行处理，计算器方法中只保留核心业务代码，做到核心业务和非业务代码的解耦合

1. 创建一个接口 Calculator

```java
public interface Calculator {
    int add(int a, int b);
}
```

2. 创建一个实现类 CalculatorImpl

```java
public class CalculatorImpl implements Calculator {
    @Override
    public int add(int a, int b) {
        return a + b;
    }
}
```

3. 创建一个切面类 LoggingAspect，用于记录日志

```java
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    @Before("execution(* Calculator.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        System.out.println("Logging before method: " + joinPoint.getSignature().getName());
    }
}
```

4. 创建 Spring 配置文件 applicationContext.xml，配置 AOP

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd">

    <bean id="calculator" class="CalculatorImpl" />

    <bean id="loggingAspect" class="LoggingAspect" />

    <aop:aspectj-autoproxy />
</beans>
```

5. 创建一个测试类 MainApp，用于测试 AOP

```java
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class MainApp {
    public static void main(String[] args) {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        Calculator calculator = (Calculator) context.getBean("calculator");
        System.out.println("Result: " + calculator.add(5, 3));
        context.close();
    }
}
```
