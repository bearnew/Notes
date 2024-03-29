# severless

## 1.serverless 简介

1. 无服务器架构，Serverless 不是具体的一个编程框架、类库或者工具。简单来说，Serverless 是一种软件系统架构思想和方法
2. 用户无须关心软件应用运行涉及的底层服务器的状态、资源（比如 CPU、内存、磁盘及网络）及数量。
3. 软件应用正常运行所需要的计算资源由底层的云计算平台动态提供。
4. 目的是提高应用交付的效率，降低应用运营的工作量和成本。

## 2.serverless 两种方案

1. **FaaS**
   1. `FaaS` 提供了一个计算平台，在这个平台上，应用以一个或多个函数的形式开发、运行和管理。
   2. `FaaS` 平台提供了函数式应用的运行环境，一般支持多种主流的编程语言，如 Java、PHP 及 Python 等
   3. `FaaS` 可以根据实际的访问量进行应用的自动化动态加载和资源的自动化动态分配。
   4. 大多数 FaaS 平台基于事件驱动（Event Driven）的思想，可以根据预定义的事件触发指定的函数应用逻辑。
2. **Bass**
   1. 通过 BaaS 平台将应用所依赖的第三方服务，如数据库、消息队列及存储等服务化并发布出来，用户通过向 BaaS 平台申请所需要的服务进行消费，而不需要关心这些服务的具体运维。
   2. 许多应用都有存储数据的需求，大部分应用会将数据存储在数据库中。传统情况下，数据库都是运行在数据中心里，由用户运维团队负责运维。在 DBaaS 的场景下，用户向 DBaaS 平台申请数据库资源，而不需要关心数据库的安装部署及运维。

## 3.serverless 特点

1. 按需加载
2. 事件驱动

   - Serverless 架构的应用并不总是一直在线，而是按需加载执行。应用的加载和执行由事件驱动，比如 HTTP 请求到达、消息队列接收到新的信息或存储服务的文件被修改了等。通过将不同事件来源（Event Source）的事件（Event）与特定的函数进行关联，实现对不同事件采取不同的反应动作，这样可以非常容易地实现事件驱动（Event Driven）架构。

3. 状态非本地持久化
4. 非会话保持
5. 自动弹性伸缩
6. 应用函数化

## 4.serverless 局限

1. 控制力
   - 用户对底层的计算资源没有控制力
2. 可移植性
   - 用户将一个平台上的 Serverless 应用移植到另一个平台时所需要付出的成本会比较高
3. 安全性
   - 用户不能直接控制应用实际所运行的主机
4. 性能
   - 应用的首次加载及重新加载的过程将产生一定的延时
5. 技术成熟度

## 5.计算资源的演变
- 云计算之前，以物理机为资源管理单位。用户完全独占整台实体计算资源，安全性好，但存在着明显的资源利用率低，环境配置管理复杂等问题
- IaaS以对硬件进行虚拟化为基础，减轻了用户管理底层物理资源的成本，一台物理机可虚拟化多台设备，提高了资源利用率，降低了IT硬件管理成本
- PaaS是构建在 IaaS 之上的一种平台服务，提供系统部署、监控和服务发现等功能，用户只需要部署自己的应用即可，降低了服务管理成本
- FaaS则向前再迈进了一步，不仅完全托管了底层资源，也提供了定制的程序运行时，这就为快速部署和基础组件使用优化提供了空间，做到“业务的归业务，基础设施的归基础设施”，技术边界进一步明确，生产效率也自然会得到提高

## 6.fass的应用场景
1. 移动及 Web 应用
   - 构建可弹性扩展的移动或 Web 应用程序，轻松创建丰富的无服务器后端
2. 接口聚合(BFF)
   - 借助于FaaS运行时提供的RPC、Cache、DB访问等能力，快速搭建BFF服务层
3. SSR
   - 借助于内置的Node开发组件库和页面级发布能力，为 SSR 应用开发带来天然隔离性和动态修复能力，较好地避免页面间交叉污染
4. 消息订阅处理
   - 使用消息队列作为函数触发器，在消息队列中接收到消息时将触发云函数的运行，并会将消息作为事件内容传递给云函数。无须配置消息订阅逻辑，开发者只关注消息处理的业务逻辑，Serverless计算模式，支持多种语言消费。例如，在 Kafka 中接收到业务消息时，云函数可以将消息内容经过业务处理后，保存到数据库或请求外部API继续流转。
5. 定时任务
   - 用户可以编写函数来处理定时任务。定时器会在指定时间自动触发函数执行