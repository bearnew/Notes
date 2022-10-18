## nginx 实现 https

#### 1.openssl

1. ssl, 是在 TCP 上做的一个安全通信层
2. openssl 用来实现 ssl 的交互过程，包括密钥证书管理、对称加密、非对称加密

#### 2.用 openssl 生成 CSR(Certificate Signing Request)

1. 生成 RSA 密钥（私钥）
   ```js
   // 生成1个2048位的密钥，同时有1个des3方法加密的密码，每次都需要输入密码
   `openssl genrsa -des3 -out localhost.pem 2048` // 生成1个2048位的密钥，不需要每次都输入密码
   `openssl genrsa -out localhost.pem 2048`;
   ```
2. 生成证书请求（用于服务器）
   - 用 pem 文件生成 1 个 CSR 证书请求，用 CSR 证书请求文件去 CA(数字证书颁发机构)申请 1 个数字证书，CA 会给你 1 个新的文件 cacert.pem(可用的数字证书)
   - `openssl req -new -key localhost.pem -out localhost.csr `
   - key: 私钥 key
   - pem: 密钥
   - csr: Certificate Signing Request (CSR) file 证书签名请求
   - crt: certificate 证书
3. 生成证书请求（用于 nginx）
   1. 生成 server.key（基于 des3 算法生成的 rsa 私钥，生成的私钥必须输入至少 4 位密码）
      `openssl genrsa -des3 -out server.key 2048`
   2. 生成无密码的 server.key
      `openssl rsa -in server.key -out server.key`
   3. 生成 CA 的 crt
      `openssl req -new -x509 -key server.key -out ca.crt -days 3650 `
   4. 基于 ca.crt 生成 csr
      ` openssl req -new -key server.key -out server.csr`
   5. 生成 crt（已认证）
      `openssl x509 -req -days 3650 -in server.csr -CA ca.crt -CAkey server.key -CAcreateserial -out server.crt`
   6. 配置 nginx
      ```js
      server {
          listen                      80;
          server_name                 localhost;
          listen                      443 ssl;
          ssl_certificate             /etc/nginx/ssl/server.crt;
          ssl_certificate_key         /etc/nginx/ssl/server.key;
          ssl_session_cache           shared:SSL:1m;
          ssl_session_timeout         5m;
          ssl_protocols               SSLv2 SSLv3 TLSv1.2;
          ssl_ciphers                 HIGH:!aNULL:!MD5;
          ssl_prefer_server_ciphers   on;
          location /my-project/ {
              alias    /home/lvcy/my-project/dist/;
          }
      }
      ```
   7. 重启
      `sudo nginx -s reload`
4. 自己做测试，证书的申请机构和颁发机构都是自己，通过私钥`localhost.pem`生成公钥`cacert.pem`
   - `openssl req -new -x509 -key localhost.pem -out cacert.pem -days 1095 `

#### 3.https 相关配置

1. 新版本`chrome`本地`https`无法访问，鼠标点击页面任意位置，直接输入`thisisunsafe`即可跳过
2. `webpack-dev-server`的`https: true`默认使用自签名证书
3. 通过`devcert`编写代码生成证书和密钥

```js
<!--webpack.config.js-->

async webpackConfig(){
    let ssl = await devcert.certificateFor("h5.dev.weidian.com", { getCaPath: true });

    <!--key和cert分别就是开启Https服务的证书和秘钥-->
    const { key, cert } = ssl;

    return {
        "dev-server":{
            https: {
                key, cert;
            }
        }
    }
}

module.exports = webpackConfig()

```
#### 4.使用mkcert配置证书
https://zhuanlan.zhihu.com/p/158350413