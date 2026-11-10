GitHub Pages 静态成品

重要：ZIP 是下载和传输用的压缩包，不是上传到 GitHub 的网站文件。
请先解压，再将其中的 index.html、style.css、script.js、public 文件夹和 .nojekyll 上传。
ZIP 总大小约47MB，并不代表里面有单个资源超过25MiB。
已检查：全部待上传文件都小于25MiB；最大视频为17.61MiB；index.html仅24,210字节，不含内嵌图片或视频。
当前没有超限图片或PDF，因此未对它们做无必要的有损压缩；现有页面设计和资源引用保持不变。
UPLOAD-FILE-SIZES.json 提供逐文件大小与校验信息。

如果 GitHub 上传框显示 portfolio-github-pages*.zip，请先移除该项，再上传解压后的文件。
不要上传原项目中的 outputs 整个目录、大型原始视频或 export-work 工作目录。

上传哪些文件
解压 portfolio-github-pages.zip 后，将解压目录内的全部文件和 public 文件夹上传到仓库发布目录。
index.html 必须直接位于发布目录最外层，不能再套一层 github-pages 文件夹。
需要保留：index.html、style.css、script.js、public/、.nojekyll。本说明文件可保留。
这是纯静态网页成品，不需要 npm install、Node.js、构建或后端。

发布方式（由你自行操作；本次未上传或发布）
1. 将上述文件上传至仓库 main 分支根目录。
2. 仓库 Settings → Pages → Deploy from a branch，选择 main 和 /(root)。
3. 发布地址为 https://用户名.github.io/仓库名/。
4. 上传解压后的文件，不要只上传 ZIP；注意一并上传隐藏文件 .nojekyll。
5. 图片、字体、PDF和视频均在 public/assets 中。不要遗漏整个 public 文件夹。

包含内容
- 当前作品集首页、作品展示、About Me 的设计、文字、图片和交互。
- 本地 Gochi Hand、Manrope 字体及其开源许可，页面无须向 Google Fonts 请求字体。
- 一点灰第一集完整视频：针对网页直接上传压缩为约18MB、272×480，内容、声音与101.6秒时长保留；原项目高清原片未修改。
- 简历：使用桌面《傅媛雅婕简历.pdf》（2026-11-05更新），文件为 public/assets/documents/resume.pdf。
- 简历下载入口：Menu → Resume，以及 About Me 联系方式下的 Download Résumé。

路径与功能
- 页面使用相对资源路径与页内锚点，可部署到仓库子路径，无需填具体用户名或仓库名。
- 拖动工牌、Menu、Projects 子菜单、胶卷循环与拖动、快门闪光、小猫悬停及视频播放均为浏览器端功能，无需本地预览服务或后端。
- E-mail 会调用访客的邮件应用；Wechat 为文字联系方式，无后台表单。
- “视频作品”的7张缩略图沿用原网页，只展示作品数据；没有对应7条视频源，不会凭空增加视频播放。
- 桌面版和手机端沿用当前设计，包括工牌覆盖文字与小猫原有位置。
- 文件均为实际文件，不含 .icloud 占位、桌面绝对路径、开发工具或本机素材缓存路径。

维护
替换简历时使用同名 resume.pdf；替换图片和视频时同步更新引用。
不需要上传原项目中的 tools、tmp、work、缓存配置或大型视频原片。

参考
https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github
