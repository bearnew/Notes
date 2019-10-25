## nginx实现https
#### 1.openssl
1. ssl, 是在TCP上做的一个安全通信层
2. openssl用来实现ssl的交互过程，包括密钥证书管理、对称加密、非对称加密
#### 2.用openssl生成CSR(Certificate Signing Request)
1. 生成RSA密钥（私钥）
    ```js
        // 生成1个2048位的密钥，同时有1个des3方法加密的密码，每次都需要输入密码
        `openssl genrsa -des3 -out localhost.pem 2048`
        // 生成1个2048位的密钥，不需要每次都输入密码
        `openssl genrsa -out localhost.pem 2048`
    ```
2. 生成证书请求（用于服务器）
    * 用pem文件生成1个CSR证书请求，用CSR证书请求文件去CA(数字证书颁发机构)申请1个数字证书，CA会给你1个新的文件cacert.pem(可用的数字证书)
    * `openssl req -new -key localhost.pem -out localhost.csr `
    * key: 私钥key
    * pem: 密钥
    * csr: Certificate Signing Request (CSR) file 证书签名请求
    * crt: certificate 证书
3. 生成证书请求（用于nginx）
    1. 生成server.key（基于des3算法生成的rsa私钥，生成的私钥必须输入至少4位密码）
        `openssl genrsa -des3 -out server.key 2048`
    2. 生成无密码的server.key
        `openssl rsa -in server.key -out server.key`
    3. 生成CA的crt
        `openssl req -new -x509 -key server.key -out ca.crt -days 3650 `
    4. 基于ca.crt生成csr
        ` openssl req -new -key server.key -out server.csr`
    5. 生成crt（已认证）
        `openssl x509 -req -days 3650 -in server.csr -CA ca.crt -CAkey server.key -CAcreateserial -out server.crt`
    6. 配置nginx
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
    * `openssl req -new -x509 -key localhost.pem -out cacert.pem -days 1095 `
#### 3.安装和配置SSL证书
