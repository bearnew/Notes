## 1.Java 简介

1. 核心优势：
   1. 跨平台，如 Java 的 int 类型永远都是 32 位
   2. 安全性，Java 很容易构建防病毒，防篡改的系统
   3. 面向对象，适合大型软件的设计和开发
   4. 简单，C++语法的简化版
   5. 高性能，高级语言运行效率低于低级语言，但是 Java 通过 JIT(Just in time)即时编译提高运行效率，将热点字节码编译成机器码，并将结果缓存起来，提高执行效率
   6. 分布式，能够轻松处理 TCP/IP 协议，使访问网络资源和访问本地资源一样简单
   7. 多线程，带来更好的交互响应和实时行为
   8. 健壮性，程序错误会将异常抛出，不会引起机器崩溃
2. Java 各版本
   1. JavaSE(Java Standard Edition): 标准版，定位在个人计算机上使用
   2. JavaEE(Java Enterprise Edition): 企业版，定位在服务端的应用
   3. JavaME(Java Micro Edition): 微型版，定位在消费性电子产品的应用上

## 2.Java 运行机制

1. 运行机制
   - 源文件(.java 文件) -> 编译器(javac) -> 字节码(.class 文件) -> JVM 虚拟机 -> 操作系统
2. java 既有 javac 的编译过程，又有 JVM 的解释过程
3. JVM(Java Virtual Machine)
   1. 用于执行 bytecode 字节码的虚拟计算机，不同操作系统有不同版本的 JVM，屏蔽了底层运行平台的差异，是实现跨平台的核心
4. JRE(Java Runtime Environment)
   1. 包括 java 虚拟机、库函数
5. JDK(Java Development Kit)
   1. 包括 JRE 编译器 和 调试器
6. ![20231125020107-2023-11-25](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231125020107-2023-11-25.png)
