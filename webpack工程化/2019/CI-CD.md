## CI/CD

> CI(Continuous Integration)持续集成, 持续集成（CI）是在源代码变更后自动检测、拉取、构建和单元测试的过程
> CD(Continuous Delivery & Depolyment)持续交互&部署, 自动监测源代码变更并通过构建、测试、打包生成可部署的版本

1. Gitlab runner
    - CI 的执行环境，负责执行`gitlab-ci.yml`文件，并将结果返回给`GitLab`系统
    - Runner 有 docker, 虚拟机, shell 三种方式
    - Gitlab 提供了共享 Runner，我们不用处理 Runner
2. 新建`.gitlab-ci.yml`
    1. pipeline
        - `Pipeline`相当于一次构建任务，包含多个流程，
        - 包括安装依赖，运行测试，编译、部署测试服务器、部署生产服务器流程
        - 任何 push 或者 Merge request 都会触发 pipeline
    2. stages
        - 构建阶段，1 次`Pipeline`中定义多个`Stage`
        - Stage 按顺序运行，所有 Stage 完成，pipeline 才会构建成功
        - 1 个 Stage 就是 1 个 Job
        ```js
        stages: -test - build - deploy;
        ```
    3. Jobs
        - 某个 Stage 里面执行的工作
        - Stage 中定义的多个 job 会并行执行
        - job.script, 定义 job 要运行的命令，必填
        - job.stage, 定义 job 对应的 stage, 如:test
        - job.artifacts, 定义 job 中生成的附件
        - Job.variables, job 中的环境变量
        - job.tags, 指定该 job 使用的 runner
        - job.only, 该 job 的约束条件，比如只有 master 才执行该 job
            ```js
            only: -master;
            ```
        - environment, 定义 job 的部署环境
    4. before_script
        - 定义任何 jobs 运行前都要执行的命令
    5. after_script
        - 定义任何 jobs 完成后都要执行的命令
    6. variables
        - 定义环境变量
    7. cache
        - 定义需要缓存的文件
        - 缓存的文件可以跨 job, 跨 pipeline 使用
3.

## 单元测试

1. 使用`husky`强制约束单元测试
    - https://github.com/typicode/husky
2. 使用`jest`实现单元测试
    - https://jestjs.io/docs/en/getting-started
3. React Testing Library
    - https://github.com/testing-library
