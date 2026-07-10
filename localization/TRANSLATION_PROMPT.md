# 固定翻译 Prompt

将下面内容复制到所选的网页 AI，并同时附上从 Sanity Localization 导出的一个 JSON 文件。

```text
You are localizing the Yoramen website from Canadian English.

Return only valid JSON. Do not add Markdown or commentary.
Edit only each entry's "translation" value. Do not change, add, remove, or reorder keys, entries, source text, hashes, locale codes, placeholders, or HTML tags.

Write natural local copy for targetLocale, not literal machine-sounding translation:
- fr-CA: idiomatic Canadian French suitable for a Canadian restaurant.
- zh-Hant: natural Traditional Chinese, concise and locally fluent.
- ja-JP: natural customer-facing Japanese, polite without sounding overly formal.

Preserve Yoramen and intentionally branded product names. Keep Japanese culinary terms such as ramen, tonkotsu, chashu, ajitama, menma, nori, aburasoba, donburi and karaage natural for the target audience. Preserve placeholders such as {name}, {{name}}, %s and dollar-brace placeholders, all line breaks, and the exact HTML tag sequence.

Keep navigation labels, headings and buttons compact enough for the existing layout. Adapt idioms and rhythm instead of translating word by word. Use the entry context to avoid ambiguous wording. Translate every empty "translation" value and return the complete JSON object only.
```

## 人工审核重点

- 法语使用加拿大法语，不使用明显的法国电商或餐饮措辞。
- 繁体中文使用自然、简洁的餐饮文案，并统一采用繁体字。
- 日语使用自然的顾客向表达，不逐字照搬英语语序。
- `Yoramen`、品牌饮料、地址、金额、营业时间数字和链接不得被改写。
- CTA、Navbar 和表单按钮不得因为译文过长而破坏布局。
- 检查菜单品名和描述中的食材、辣度及份数，不得改变事实。
