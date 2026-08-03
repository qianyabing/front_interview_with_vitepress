## Nginx安全配置清单

---

### 一、隐藏版本信息（防信息泄露）

Nginx默认会在响应头中暴露版本号，攻击者可据此寻找特定版本的漏洞。

```nginx
http {
    server_tokens off;  # 关闭版本号显示
}
```

**面试话术**：“我曾通过`server_tokens off`隐藏Nginx版本，防止攻击者根据版本号寻找已知漏洞，减少攻击面。”

### 二、安全HTTP响应头（浏览器侧防御）

**1. X-Frame-Options（防点击劫持）**
防止网站被嵌入`<iframe>`实施点击劫持。

```nginx
add_header X-Frame-Options "DENY" always;
```

**2. X-Content-Type-Options（防MIME类型混淆）**
防止浏览器嗅探文件类型，避免恶意文件伪装。

```nginx
add_header X-Content-Type-Options "nosniff" always;
```

**3. Content-Security-Policy（CSP，防XSS）**
限制资源加载来源，白名单之外的脚本无法执行。

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://trusted.cdn.com; img-src 'self' data:;" always;
```

**4. Strict-Transport-Security（HSTS，强制HTTPS）**
强制浏览器后续只通过HTTPS访问。

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

**5. Permissions-Policy（限制浏览器API）**
禁用不需要的浏览器API（摄像头、地理位置等）。

```nginx
add_header Permissions-Policy "geolocation=(), camera=(), microphone=()" always;
```

**面试话术**：“在WeLink项目中，我关注过安全响应头配置。例如通过`X-Frame-Options: DENY`防止点击劫持，通过CSP限制脚本来源防御XSS，配合HSTS强制HTTPS防止中间人攻击。这些响应头在Nginx层统一配置，所有应用自动继承，比在代码里逐个设置更可靠。”

### 三、HTTPS与SSL/TLS加密（传输层安全）

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/fullchain.pem;      # 证书
    ssl_certificate_key /path/to/privkey.pem;    # 私钥

    ssl_protocols TLSv1.2 TLSv1.3;                # 仅启用安全协议
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:...;
    ssl_prefer_server_ciphers on;                 # 优先服务器端加密套件

    ssl_session_cache shared:SSL:10m;             # 会话缓存加速
    ssl_session_timeout 1d;
    ssl_stapling on;                              # OCSP装订加速证书验证
    ssl_stapling_verify on;
}

server {
    listen 80;
    return 301 https://$server_name$request_uri;  # HTTP强制跳转HTTPS
}
```

**面试话术**：“HTTPS配置中，我关注三个核心点：协议版本（仅TLSv1.2+）、加密套件（优先ECDHE前向保密）、以及HSTS强制跳转。还要注意`ssl_certificate`必须包含完整的证书链，否则浏览器会报安全警告。”

### 四、限制HTTP请求方法（防越权操作）

仅允许GET/POST/HEAD，拒绝PUT/DELETE等。

```nginx
if ($request_method !~ ^(GET|POST|HEAD)$ ) {
    return 403;
}
```

或用`limit_except`：

```nginx
location / {
    limit_except GET POST HEAD { deny all; }  # 拒绝其他方法
}
```

### 五、IP访问控制（防未授权访问）

后台管理路径限制只允许公司内网IP访问。

```nginx
location /admin/ {
    allow 192.168.1.0/24;   # 允许内网
    deny all;                # 拒绝其他
}
```

### 六、限流（防暴力破解/DDoS）

限制单个IP的请求频率。

```nginx
http {
    limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;
    # 每分钟最多5次请求
    server {
        location /login {
            limit_req zone=login_limit burst=10 nodelay;
            proxy_pass http://backend;
        }
    }
}
```

**参数说明**：

- `rate=5r/m`：每分钟最多5次
- `burst=10`：允许瞬间突发10次
- `nodelay`：超过直接返回错误，不排队
- 触发限流返回`503 Service Temporarily Unavailable`，可自定义为`429 Too Many Requests`

**面试话术**：“为防暴力破解登录，我曾配置Nginx限流，对登录接口限制每个IP每分钟最多5次请求。即使黑客有密码字典，也无法快速爆破。这个配置对保护用户账号安全非常有效。”

### 七、防盗链（防资源滥用）

防止其他网站直接引用图片、视频等资源。

```nginx
location ~* \.(jpg|png|gif|mp4)$ {
    valid_referers none blocked yourdomain.com *.yourdomain.com;
    if ($invalid_referer) {
        return 403;
    }
}
```

`valid_referers`指定允许的来源域名，不匹配时`$invalid_referer`为true。

### 八、防止恶意请求参数（网关层拦截）

直接在Nginx层拦截SQL注入、XSS等恶意参数。

```nginx
# 拦截SQL注入特征
if ($args ~* "(union|select|insert|update|delete|drop|truncate|or|and)") {
    return 403;
}
# 拦截XSS特征
if ($args ~* "<script>|<iframe>|onclick=|javascript:") {
    return 403;
}
# 拦截路径遍历
if ($request_uri ~* "\.\./|/etc/passwd") {
    return 403;
}
```

### 九、其他基础安全加固

```nginx
http {
    client_max_body_size 10M;                    # 限制请求体大小
    autoindex off;                               # 关闭目录列表

    location ~ /\.git { deny all; }              # 禁止访问.git目录
    location ~ /\.(log|conf|env)$ { deny all; }  # 禁止敏感文件
}
```

### 面试话术模板（背下来）

> “面试官，关于Nginx安全配置，我总结为五个维度：
> 
> **第一，信息隐藏**：通过`server_tokens off`隐藏版本号。
> 
> **第二，浏览器侧防御**：配置安全响应头——`X-Frame-Options: DENY`防点击劫持，`X-Content-Type-Options: nosniff`防MIME混淆，`CSP`限制脚本来源防XSS，`HSTS`强制HTTPS。
> 
> **第三，传输层加密**：启用HTTPS，仅支持TLSv1.2+，优先ECDHE前向保密套件。
> 
> **第四，访问控制**：`allow/deny`做IP白名单，`limit_req`限流防暴力破解。
> 
> **第五，请求过滤**：限制HTTP方法，拦截恶意参数。
> 
> 这些配置中，安全响应头和限流我印象最深——WeLink的登录接口就配置了IP限流，有效防止了暴力破解攻击。虽然这些配置通常由运维负责，但作为前端，理解它们能帮我们在开发时就规避安全问题。”



你问得非常及时！我必须诚实地告诉你：**在我上一轮的长篇梳理中，我把 XSS 和 CSRF 漏掉了（它们没有放进“Nginx配置清单”里）。**

不过别担心，这恰好能让你在面试中展现出“辩证思考”的能力。因为它们的防护策略是**前后端分工**的：

- **XSS（跨站脚本攻击）**：**前端代码层（最主要）+ Nginx（辅助，通过 CSP 响应头）**。
- **CSRF/XSRF（跨站请求伪造）**：**后端代码层（最主要）+ Nginx（辅助，通过 SameSite 属性）**。

下面我把这两块内容，按照“**前端要做什么 + Nginx能帮你什么**”的逻辑，彻底给你补齐。

---

### 一、 XSS（跨站脚本攻击）的完整防御链条

**攻击本质**：黑客在你的网页里注入了恶意 `<script>` 标签。

**1. 前端代码层（第一道防线，绝对主力）**

- **输出编码（转义）**：在渲染用户输入的内容时，将 `<` 转成 `&lt;`，`>` 转成 `&gt;`。React 的 JSX 默认做了这一点，但 Vue 的 `v-html` 或 React 的 `dangerouslySetInnerHTML` 是高风险操作。
- **输入过滤（消毒）**：如果需要展示富文本（如 WeLink 的消息支持加粗、斜体），**绝对不能只用正则**。必须使用专业库，如 **`DOMPurify`**，过滤掉 `onerror`、`<script>` 等恶意标签，只保留安全的白名单标签。

**2. Nginx 层（第二道防线，强力兜底）**
在 Nginx 中配置 **CSP（内容安全策略）**。这是浏览器的终极“免死金牌”，即使前端代码有漏洞漏掉了恶意脚本，只要 CSP 限制了 `script-src` 只允许 `self`（同源）或可信 CDN，浏览器会直接拦截该脚本的执行。

```nginx
# 在 Nginx 的 location / 下添加
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://cdn.weixin.com; object-src 'none';" always;
```

**面试话术升级**：“防御 XSS 我坚持**‘双重保险’**。**前端层面**，对于富文本使用 DOMPurify 强制消毒；**运维层面**，推动 Nginx 开启 CSP 策略，即使在极端情况下有恶意脚本被注入，浏览器也会因为 CSP 白名单限制而拒绝执行。”

---

### 二、 CSRF/XSRF（跨站请求伪造）的防御策略

**攻击本质**：黑客诱导用户点击链接，利用浏览器自动携带 Cookie 的机制，在用户不知情时发起恶意请求（如改密码、转账）。

**1. 后端代码层（核心）与 Nginx 的配合**

- **CSRF Token（同步令牌）**：后端生成随机 Token 下发到前端，前端发起请求时必须在 Header 或表单中带上这个 Token。**这个逻辑 Nginx 做不了，必须由业务后端代码实现。**
- **SameSite Cookie（最关键且常配在 Nginx）**：Nginx 可以在设置 Cookie 响应头时，强制加上 `SameSite` 属性。

```nginx
# 当后端应用（如 Java/Node.js）返回 Set-Cookie 时，Nginx 可以拦截并添加 SameSite 属性
# 或直接在 Nginx 的反向代理中修改响应头
proxy_cookie_path / "/; SameSite=Lax; Secure; HttpOnly";
```

**2. 关键操作二次验证**

- 对于支付、改密等操作，要求用户输入**密码、短信验证码或人脸识别**。这是最后的堡垒，Nginx 不参与，由业务逻辑实现。

### 三、 补充：`SameSite` 的区别（面试深水区）

面试官极大概率会追问：“`SameSite` 里 `Strict`、`Lax`、`None` 有什么区别？”

- **`Strict`（最严）**：只要是从第三方网站跳转过来的，任何请求都不带 Cookie。比如你从百度点进 WeLink，虽然登录了，但 WeLink 认为你是“新客”，可能还得重登录。
- **`Lax`（推荐，默认）**：大部分跨站请求不带 Cookie，**但顶级的“跳转链接”（`<a href="...">`）带 Cookie**。这是目前最平衡的方案，既防 CSRF，又不影响用户正常从外部链接进来。
- **`None`（最不安全）**：所有跨站请求都带 Cookie。启用此选项**必须**配合 `Secure`（即必须使用 HTTPS），否则浏览器会拒绝设置。

### 四、 面试必背“战略总结”

如果面试官问：“你刚说了很多配置，那对于 XSS 和 CSRF，Nginx 到底能解决什么，解决不了什么？”

**你的满分回答：**

> “**Nginx 解决的是‘传输和策略’问题，解决不了‘业务逻辑’问题。**
> 
> 1. **XSS**：Nginx 靠 **CSP** 告诉浏览器‘什么能执行’，是浏览器侧的免疫系统；但**业务侧的转义和消毒**（比如 DOMPurify）必须由我在前端代码里写，Nginx 看不懂你的业务数据。
> 2. **CSRF**：Nginx 只能帮我在 `Set-Cookie` 时加上 `SameSite` 属性，让浏览器自动拦截跨站请求；但**核心的 Token 校验**（比如 Header 里传了 `X-CSRF-Token`），Nginx 无法校验这个值对不对，必须由后端的业务代码处理。
> 
> 所以我的安全观是：**Nginx 配置好‘篱笆’（策略），代码里写好‘锁’（逻辑），两者结合才叫纵深防御。”**

这样回答，既展示了你会配 Nginx，又清楚地划清了前后端安全的职责边界，绝对能通过二面的安全考察！
