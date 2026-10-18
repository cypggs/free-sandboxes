# 贡献指南

感谢你帮忙维护这份免费沙箱清单。目标很简单：**信息准确、可验证、对使用者有用**。

## 收录标准

符合以下条件的产品可以收录：

- 能拿到云端 Linux 沙箱、VM 或完整的云端开发环境；
- 有明确的免费额度、免费试用或免注册试用；
- 信息能从官方文档、定价页或产品页面验证；
- 不是纯 Web IDE、在线代码片段工具或没有后端 VM 的产品。

暂不收录：

- 只有销售联系、没有公开定价和免费额度的企业产品；
- 需要企业审核、无法自助注册的产品；
- 已经停止新用户注册或即将关停的产品；
- 推广软文里才有、官方页面查不到的“免费”。

## 修改数据

所有产品数据集中在 [`docs/data.js`](docs/data.js) 的 `window.SANDBOX_DATA.products` 数组里。一个条目长这样：

```js
{
  id: "example",
  name: "Example Sandbox",
  initials: "EX",
  category: "agent",              // agent | dev | vm
  tagline: "一句话说明它是什么",
  freeType: "recurring",          // recurring | credit | promo | anonymous | always
  freeQuota: "免费额度的一句话摘要",
  quotaNote: "并发、存储、流量等补充",
  specs: "单机配置",
  specsNote: "规格补充",
  signup: "注册门槛",
  card: "no",                     // no | optional | yes
  ease: 4,                        // 1–5
  freeScore: 4,                   // 1–5
  speed: "启动速度",
  session: "生命周期 / 空闲回收",
  persistence: "持久化说明",
  api: "API / CLI / SDK",
  bestFor: "适合场景",
  caveats: ["坑点 1", "坑点 2"],
  quickstart: "可选的一行命令",
  links: [
    { label: "官网", url: "https://example.com" },
    { label: "文档", url: "https://example.com/docs" },
    { label: "定价", url: "https://example.com/pricing" }
  ],
  verified: "2026-10-18",
  rank: 12
}
```

注意事项：

- `verified` 写你实际查看官方页面的日期，格式 `YYYY-MM-DD`。
- `rank` 只影响默认排序，新增产品可以先用较大的数字。
- `card` 必须明确：`no` 表示官方明确无需绑卡；`optional` 表示不绑卡也能用但有额度/功能差异；`yes` 表示必须绑卡验证。
- `caveats` 写真正影响使用的限制，不要写营销话术。
- 如果产品没有公开某字段，写“官方未公开”，不要猜。

## 更新页面和 README

1. 修改 `docs/data.js`。
2. 同步更新 `README.md` 里的对比表、快速选择或官方入口（如果新增了产品）。
3. 本地预览：

   ```bash
   python3 -m http.server 8000 -d docs
   ```

   打开 <http://localhost:8000>，检查筛选、排序、展开详情和深色/浅色模式。

4. 提交 PR，并在描述里附上官方来源链接和核实日期。

## 评分标准

- **上手便捷（1–5）**：5 = 免注册/一条命令；4 = 常规注册几分钟内可用；3 = 邀请码/排队/额外配置；2 = 绑卡验证 + 容量限制；1 = 审核或复杂企业流程。
- **免费力度（1–5）**：5 = 长期额度或配置很猛；4 = 周期性额度足够日常；3 = 一次性试用额度；2 = 小额或严格限制；1 = 名义免费。

评分是编辑判断，不是厂商数据。修改评分时请在 PR 里说明理由。

## PR 检查清单

- [ ] 所有数据都有官方来源，并在 PR 描述中附上链接
- [ ] `verified` 日期已更新
- [ ] `README.md` 已同步
- [ ] 本地页面预览正常：筛选、排序、展开、复制命令、主题切换
- [ ] 没有加入推广链接、affiliate 链接或未核实的宣传
- [ ] 文案简洁、中文为主，产品名保留官方拼写

## 发现错误

如果只是额度或价格过期，直接提 [Issue](https://github.com/cypggs/free-sandboxes/issues) 也可以，附上官方链接和变化内容即可。
