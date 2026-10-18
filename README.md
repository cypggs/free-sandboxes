# Free Sandboxes · 免费云端沙箱清单

> 给 AI Agent 和开发者的一页式免费沙箱指南。机器配置、免费额度、注册门槛、闲置回收和隐藏坑点，全部对着官方文档核实。

[![License: MIT](https://img.shields.io/badge/license-MIT-c8f56a?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-7fe0c3?style=flat-square)](CONTRIBUTING.md)
[![Updated](https://img.shields.io/badge/updated-2026--10--18-8ab4ff?style=flat-square)](docs/data.js)
[![GitHub Pages](https://img.shields.io/badge/live-page-f59e9e?style=flat-square)](https://cypggs.github.io/free-sandboxes/)

**在线对比页面：<https://cypggs.github.io/free-sandboxes/>**

A Chinese-first, curated comparison of free cloud sandboxes and VMs for AI agents and developers.

---

## 为什么做这个

“注册送 VM”看起来都很香，但真正决定体验的是：

- 免费额度是**每月重置**，还是**一次性试用**？
- 要不要**绑卡**？绑卡会不会预授权？免费档会不会偷偷扣费？
- 免费档能不能**持久化**？闲置多久被回收？
- 标称配置很大，实际能不能**创建成功**？
- 是完整 Linux VM，还是只能跑代码片段的沙箱？

这个仓库把这些信息压成一张表，并提供一个可筛选、可排序、可展开详情的网页。不接推广链接，不收录“名义免费”的付费产品。

## 快速选择

| 你的需求 | 推荐 | 原因 |
|---|---|---|
| 30 秒拿到 root shell | **Railway Free VM** | 无需账号/信用卡，`ssh railway.new` 直接进 2C2G VM |
| 想要最大的免费机器 | **Instabox** | Beta 期 5 台 4C8G，root + Docker + 快照，但需要邀请码 |
| 长期跑 Agent / 服务 | **Freestyle** | 每月 200 vCPU 小时，额度重置，10 台并发 |
| 完整 IDE 写代码 | **GitHub Codespaces** | 120 core-hours/月，浏览器里开 VS Code |
| 永久免费 VM | **Oracle Cloud** | 2C12G ARM + 200 GB 存储，但必须绑卡且容量紧张 |
| 跑代码片段 / 评测 | **E2B / Daytona** | 微 VM、启动快，但额度是一次性的 |

## 完整对比

数据核实于 **2026-10-18**。评分是编辑判断，不是厂商数据；详细说明和官方链接见下方。

| 产品 | 免费模式 | 免费额度 | 单机配置 | 注册门槛 | 上手 | 注意 |
|---|---|---|---|---|---|---|
| [Instabox](https://instabox.sh) | 推广期 | 5 台，每台 4C8G | 4 vCPU / 8 GiB / 20 GB | GitHub/Google + 邀请码 | 3/5 | Beta 价格未定；30 分钟闲置暂停 |
| [Railway Free VM](https://railway.com/free-vm) | 免注册 | 每 IP 每天 3 台，24h 内领取 | 2 vCPU / 2 GB | 无需账号，SSH Key | 5/5 | 领取前预览 URL 只允许创建者 IP |
| [Freestyle](https://www.freestyle.sh) | 周期性 | 200 vCPU-h + 400 GiB-h/月 | 4 vCPU / 8 GiB / 32 GB | 注册；加卡 $1 验证 | 4/5 | 免费额度是硬上限 |
| [E2B](https://e2b.dev) | 一次性 | $100 | 默认 2 vCPU / 4 GiB | 注册，无需卡 | 5/5 | 免费档单会话 1 小时 |
| [GitHub Codespaces](https://github.com/features/codespaces) | 周期性 | 120 core-h + 15 GB/月 | 2–32 核 | GitHub 账号 | 5/5 | 存储也计入月额度 |
| [Modal](https://modal.com) | 周期性 | $30/月（绑卡）；无卡约 $5/月 | 按需 | 注册 | 4/5 | $30 档社区反馈需绑卡 |
| [Vercel Sandbox](https://vercel.com/sandbox) | 周期性 | 5 CPU-h + 420 GB-h/月 | 最大 4 vCPU / 8 GB | Vercel 账号 | 4/5 | Hobby 单会话 45 分钟 |
| [Google Cloud Shell](https://shell.cloud.google.com) | 周期性 | 50 小时/周 | 官方未公开 | Google 账号 | 5/5 | 40 分钟无操作回收 |
| [Daytona](https://www.daytona.io) | 一次性 | $200 | 按需 | 注册，无需卡 | 4/5 | 额度一次性 |
| [Blaxel](https://blaxel.ai) | 一次性 | 最高 $200 | 按需 | 注册，无需卡 | 4/5 | 免费档 10 个沙箱 |
| [Oracle Cloud Always Free](https://www.oracle.com/cloud/free/) | 永久 | 2 OCPU/12 GB ARM + 2 台 AMD | A1.Flex / AMD 微型 | 信用卡验证 | 2/5 | 容量紧张；2026-06 额度减半 |

## 先分清“免费”是哪一种

| 类型 | 特点 | 适合 | 本清单中的例子 |
|---|---|---|---|
| **周期性免费** | 每月/每周重置固定额度，通常是硬上限 | 长期使用、稳定跑 Agent | Freestyle、Modal、Vercel、Codespaces、Cloud Shell |
| **一次性额度** | 注册送固定金额，用完即止 | 短期评测、压测、验证想法 | E2B、Daytona、Blaxel |
| **推广期免费** | Beta/内测期免费，价格和规则随时会变 | 尝鲜，不建议押生产 | Instabox |
| **免注册试用** | 不用账号和卡，直接拿临时 VM | 快速验证、临时脚本 | Railway Free VM |
| **永久免费** | Always Free，不设到期日，通常要绑卡 | 长期自建服务 | Oracle Cloud Always Free |

## 避坑清单

1. **一次性额度 ≠ 永久免费。** E2B、Daytona、Blaxel 的额度不是每月重置；跑长任务前先算清每小时成本。
2. **免费档往往是硬上限。** Freestyle 额度用完直接暂停，Vercel 超额暂停到下月；不会悄悄扣费，但会中断任务。
3. **绑卡不等于扣费，但可能预授权。** Oracle 必须绑卡验证；Freestyle 加卡触发 $1 验证；Modal 的 $30 档社区反馈需绑卡。虚拟卡/预付卡可能不被接受。
4. **闲置回收比你想的快。** Instabox 30 分钟、Cloud Shell 40 分钟、Codespaces 默认 30 分钟、Oracle 7 天低负载可能回收。
5. **容量和区域是隐形门槛。** Oracle ARM 经常无货；Railway 每 IP 每天 3 台；Vercel 只有部分区域。能创建成功有时比配置更重要。
6. **Beta 价格随时会变。** Instabox 官方原话是 “Free until we figure it out”。任何免费额度都以官方当天页面为准。

> 免费沙箱没有生产级 SLA，可能随时回收、限流或改价。重要数据请定期备份。

## 评分标准

- **上手便捷（1–5）**：5 = 免注册/一条命令；4 = 常规注册几分钟内可用；3 = 邀请码/排队/额外配置；2 = 绑卡验证 + 容量限制；1 = 审核或复杂企业流程。
- **免费力度（1–5）**：5 = 长期额度或配置很猛；4 = 周期性额度足够日常；3 = 一次性试用额度；2 = 小额或严格限制；1 = 名义免费。

评分只用于快速排序，具体情况请展开网页里的详情，或直接看官方文档。

## 官方入口

- **Instabox** — [官网](https://instabox.sh) · [文档](https://instabox.sh/docs) · [定价](https://instabox.sh/pricing)
- **Railway Free VM** — [官网](https://railway.com/free-vm) · [Cloud Agents 文档](https://docs.railway.com/cloud-agents) · [定价](https://railway.com/pricing)
- **Freestyle** — [官网](https://www.freestyle.sh) · [文档](https://www.freestyle.sh/docs) · [定价](https://www.freestyle.sh/pricing)
- **E2B** — [官网](https://e2b.dev) · [文档](https://e2b.dev/docs) · [定价](https://e2b.dev/pricing)
- **GitHub Codespaces** — [产品页](https://github.com/features/codespaces) · [文档](https://docs.github.com/en/codespaces) · [计费](https://docs.github.com/en/billing/concepts/product-billing/github-codespaces)
- **Modal** — [官网](https://modal.com) · [文档](https://modal.com/docs) · [定价](https://modal.com/pricing)
- **Vercel Sandbox** — [产品页](https://vercel.com/sandbox) · [文档](https://vercel.com/docs/sandbox) · [定价](https://vercel.com/docs/sandbox/pricing)
- **Google Cloud Shell** — [打开](https://shell.cloud.google.com) · [文档](https://docs.cloud.google.com/shell/docs) · [限制](https://docs.cloud.google.com/shell/docs/limitations)
- **Daytona** — [官网](https://www.daytona.io) · [文档](https://www.daytona.io/docs) · [定价](https://www.daytona.io/pricing)
- **Blaxel** — [官网](https://blaxel.ai) · [文档](https://docs.blaxel.ai) · [定价](https://www.blaxel.ai/pricing)
- **Oracle Always Free** — [官网](https://www.oracle.com/cloud/free/) · [Always Free 文档](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm) · [注册](https://signup.cloud.oracle.com)

## 数据说明

- 核实日期：**2026-10-18**。
- 数据来自各产品官方文档/定价页；Instabox 官网是 SPA，部分限额信息取自其前端文档 Bundle。
- 免费政策变化很快，使用前请以官方页面为准。
- 发现过期信息或有新的免费沙箱：欢迎提 [Issue](https://github.com/cypggs/free-sandboxes/issues) 或 PR。

## 贡献

数据源在 [`docs/data.js`](docs/data.js)，页面在 `docs/`。新增或修改产品时：

1. 在 `docs/data.js` 增加/更新条目，附官方链接和核实日期。
2. 更新本 README 的对比表。
3. 本地预览：`python3 -m http.server 8000 -d docs`，打开 <http://localhost:8000>。
4. 提交 PR，说明数据来源。

详见 [CONTRIBUTING.md](CONTRIBUTING.md)。不接受推广链接、affiliate 链接和未核实的“免费”宣传。

## License

[MIT](LICENSE) © 2026 cypggs
