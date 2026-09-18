# Yoramen Sanity CMS 实施计划

## 1. 目标

把 Sanity 作为 Yoramen 网站的 CMS 内容管理层，让网站的结构和视觉实现继续保留在 Next.js 代码里，而主要业务内容可以通过 Sanity Studio 非代码化管理。

最终目标是：网站结构由开发维护，内容由运营或客户自己维护。

CMS 应该支持 non-coding 管理这些内容：

- 各页面的标题、副标题、正文、CTA、section 文案和 SEO metadata。
- 菜单分类、菜单 item、价格、标签、图片、是否上架。
- 首页或菜单页的 promotion、special offer、limited-time offer。
- Gallery 图片、分类和 testimonial。
- 门店地址、营业时间、电话、Google Map、导航链接。
- Contact 页面信息、表单 label、placeholder、提交成功/失败文案。
- Order 页面第三方订餐 iframe URL 或外链。
- Footer links、social links、privacy/terms 内容、global site settings。

CMS 不应该管理这些内容：

- 页面 layout、动画、parallax、responsive breakpoint、Tailwind class。
- Component architecture、routing、form backend、环境变量和安全相关配置。
- 纯装饰性的实现细节，除非它们本质上是内容，比如 hero image、section image。

## 2. 当前项目情况

当前项目路径：

`F:\2-28-Yoramen&Yomeetea-website-development\yoramen-web`

技术栈：

- Next.js App Router
- React 19
- Tailwind CSS 4
- Framer Motion
- lucide-react

当前已有 route：

- `/`
- `/menu`
- `/about`
- `/gallery`
- `/locations`
- `/contact`
- `/order`
- intercepted modal route for `/order`

当前主要组件：

- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `src/components/HeroSection.tsx`
- `src/components/MangaCollage.tsx`
- `src/components/OrderModal.tsx`
- `src/components/OrderIframe.tsx`

当前明显需要 CMS 化或后续完善的点：

- `OrderIframe` 现在还是 `about:blank`，需要真实第三方订餐 URL。
- Menu 页面现在有 placeholder/repeated ramen images。
- Gallery 页面现在有 repeated images。
- Contact form 目前只是前端模拟 success，没有真实 backend/API。
- Newsletter signup 目前也是前端 UI，没有真实 integration。
- Footer social、Privacy Policy、Terms of Service 目前还是 `#`。
- 大部分页面文案直接 hardcoded 在 page/component 里面。

## 3. 参考项目调研结论

参考项目路径：

`F:\11-14 ISEFY监控摄像头产品网站\3-27-from-ljy`

这个项目也是 Next.js + Sanity，已经有成熟可参考的集成方式。

参考项目的关键做法：

- Sanity Studio 直接嵌入 Next.js，访问路径是 `/studio`。
- 根目录有：
  - `sanity.config.ts`
  - `sanity.cli.ts`
- Sanity 相关代码放在：
  - `src/sanity/env.ts`
  - `src/sanity/client.ts`
  - `src/sanity/image.ts`
  - `src/sanity/schemaTypes/index.ts`
- Schema files 按 document type 拆分。
- 页面使用 server component 直接 `client.fetch(...)`。
- 页面设置 `export const revalidate = 60`，让 published content 大约 60 秒内更新到前台。
- 页面和组件有 fallback content，Sanity 没数据时网站不会空白。
- 图片使用 `@sanity/image-url` 生成 Sanity CDN 图片 URL。

参考项目依赖：

```bash
sanity
next-sanity
@sanity/image-url
@sanity/vision
```

推荐 Yoramen 沿用这个模式：

- 保持轻量，不做过度复杂的 page builder。
- Studio 也嵌入 `/studio`。
- 先做 domain-specific schema，不做让客户随意拖拽 layout 的 CMS。
- 重要页面使用 singleton document，避免客户创建多个 Home Page、Menu Page。
- collection 内容如 menu item、promotion、location 独立管理。

## 4. Sanity 项目信息

你给的 Sanity project 地址：

`https://www.sanity.io/organizations/o02hMA5BP/project/08xf72v9/studios`

计划使用的环境变量：

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=08xf72v9
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-24
```

注意：

- `.env.local` 不提交到 Git。
- 如果后续需要 seed/import script，再加 write token：

```bash
SANITY_API_WRITE_TOKEN=...
```

这个 token 不能加 `NEXT_PUBLIC_` 前缀，也不能提交到 Git。

## 5. Sanity 后台需要确认的设置

开始实际接入前，需要在 Sanity project dashboard 里确认：

- Dataset：
  - 默认建议使用 `production`。
  - 如果项目里已有指定 dataset，以后台实际配置为准。
- CORS origins：
  - `http://localhost:3000`
  - `http://127.0.0.1:3000`
  - `http://localhost:3001`
  - `http://127.0.0.1:3001`
  - 后续正式 domain。
- Studio：
  - 本项目会内嵌 Studio 到 `/studio`。
  - Sanity hosted Studio 可以保留，但 repo-based embedded Studio 更方便 schema version control。
- Access：
  - 开发阶段需要 owner/admin 权限。
  - 后续客户/运营人员可以配置 editor 权限。
- API token：
  - 只有 seed/import 或后端写入 Sanity 时需要。
  - 普通 published content 前台读取不需要 token。

当前阶段不一定要马上改后台设置。真正开始开发和测试 `/studio` 时再确认 CORS 会更准确。

## 6. CMS 内容模型设计

整体原则：

- 页面结构保持在代码中。
- 页面文案、图片、链接、价格、门店信息放到 CMS。
- 用 structured fields 管理设计固定的模块。
- 只有长文内容使用 Portable Text。
- 避免让客户编辑 Tailwind class、HTML、script 或 animation config。

## 7. Global Singleton Documents

这些 document 每种只应该有一个。需要通过 Sanity Studio structure 做成 singleton，避免客户误创建多个。

### 7.1 `siteSettings`

用途：管理全站级内容。

建议字段：

- `title`
- `defaultSeo`
  - `metaTitle`
  - `metaDescription`
  - `ogImage`
- `brand`
  - `logoDark`
  - `logoLight`
  - `favicon`
  - `altText`
- `navigation`
  - array of link item
  - label
  - href
  - openInNewTab
- `primaryCta`
  - label
  - href
- `footer`
  - brand blurb
  - explore links
  - visit links
  - social links
  - legal links
  - copyright text
- `contact`
  - general email
  - partnerships email
  - phone
- `ordering`
  - providerName
  - iframeUrl
  - externalOrderUrl
  - fallbackTitle
  - fallbackMessage
  - enabled
- `newsletter`
  - enabled
  - provider
  - endpoint or integration note

### 7.2 `homePage`

用途：管理首页主要内容。

建议字段：

- `seo`
- `hero`
  - eyebrow
  - headlineLine1
  - headlineEmphasis
  - body
  - primaryCta
  - secondaryCta
  - bottomBadges
  - backgroundImage
  - bowlImage
  - patternImage
- `philosophySection`
  - eyebrow
  - title
  - emphasis
  - paragraphs
  - cta
  - video
  - collageImages
- `promiseSection`
  - eyebrow
  - title
  - cta
  - cards
    - number
    - title
    - description
    - image
- `specialsSection`
  - eyebrow
  - title
  - intro
  - promotions reference list or auto query
- `newsletterSection`
  - title
  - description
  - inputPlaceholder
  - buttonLabel

### 7.3 `menuPage`

用途：管理 Menu 页面 header 和页面级 CTA。

建议字段：

- `seo`
- `eyebrow`
- `title`
- `description`
- `categoryNavEnabled`
- `comboCta`
  - title
  - description
  - buttonLabel
  - buttonHref

Menu category 和 menu item 不建议嵌在 `menuPage` 里，而是作为独立 collection documents。

### 7.4 `aboutPage`

用途：管理 Our Story 页面。

建议字段：

- `seo`
- `eyebrow`
- `title`
- `subtitle`
- `introImage`
- `paragraphs`
- `quote`
- `timelineTitle`
- `timelineItems` reference list or auto query
- optional decorative image controls

### 7.5 `galleryPage`

用途：管理 Gallery 页面 header 和 testimonial section。

建议字段：

- `seo`
- `eyebrow`
- `title`
- `description`
- `categories`
- `testimonialSectionTitle`

Gallery images 和 testimonials 应该是独立 documents。

### 7.6 `locationsPage`

用途：管理 Locations 页面 intro 和页面级设置。

建议字段：

- `seo`
- `eyebrow`
- `title`
- `description`
- `primaryLocationLabel`

实际门店作为独立 `location` documents，方便未来多门店扩展。

### 7.7 `contactPage`

用途：管理 Contact 页面文案、联系 blocks、表单 label 和提交提示。

建议字段：

- `seo`
- `eyebrow`
- `title`
- `description`
- `contactCardTitle`
- `contactCardDescription`
- `contactBlocks`
  - label
  - type
  - value
  - href
  - icon
- `form`
  - labels
  - placeholders
  - submitLabel
  - submittingLabel
  - successMessage
  - errorMessage

### 7.8 `orderPage`

用途：管理 Order 页面和第三方订餐 integration。

建议字段：

- `seo`
- `title`
- `description`
- `providerName`
- `iframeUrl`
- `externalOrderUrl`
- `fallbackTitle`
- `fallbackMessage`
- `enabled`

说明：

- 如果第三方订餐系统允许 iframe，就使用 `iframeUrl`。
- 如果 provider 阻止 iframe embedding，就使用 `externalOrderUrl`，前台显示跳转按钮。

## 8. Collection Documents

### 8.1 `menuCategory`

用途：管理菜单分类。

字段：

- `title`
- `slug`
- `description`
- `sortOrder`
- `visible`

示例：

- Signature Series
- Spicy Series
- Sides & Add-ons
- Drinks
- Seasonal

### 8.2 `menuItem`

用途：管理具体菜品。

字段：

- `name`
- `slug`
- `category` reference to `menuCategory`
- `description`
- `price`
- `image`
- `tags`
- `spiceLevel`
- `dietaryLabels`
- `available`
- `featured`
- `sortOrder`
- `orderLinkOverride`

说明：

- 第一阶段建议 `price` 用 string，例如 `$16.50`。
- 如果未来接入 cart/order API，再增加 numeric price 和 currency fields。

### 8.3 `promotion`

用途：管理首页 Special Offers / Limited Time。

字段：

- `title`
- `priceOrBadge`
- `description`
- `image`
- `ctaLabel`
- `ctaHref`
- `availabilityText`
- `startsAt`
- `endsAt`
- `active`
- `sortOrder`

### 8.4 `storyTimelineItem`

用途：管理 About 页 timeline。

字段：

- `year`
- `title`
- `description`
- `image`
- `sortOrder`
- `visible`

### 8.5 `galleryImage`

用途：管理 Gallery 图片。

字段：

- `title`
- `category`
- `image`
- `altText`
- `aspectRatio`
- `sortOrder`
- `visible`

### 8.6 `testimonial`

用途：管理客户评价。

字段：

- `quote`
- `author`
- `dateLabel`
- `source`
- `visible`
- `sortOrder`

### 8.7 `location`

用途：管理门店。

字段：

- `name`
- `label`
- `address`
- `phone`
- `hours`
- `waitNote`
- `mapEmbedUrl`
- `directionsUrl`
- `latitude`
- `longitude`
- `image`
- `isPrimary`
- `sortOrder`
- `visible`

### 8.8 `legalPage`

用途：管理 Privacy Policy、Terms of Service 等 legal 页面。

字段：

- `title`
- `slug`
- `seo`
- `content`
- `lastUpdated`

### 8.9 `faq`

可选，但建议预留。

字段：

- `question`
- `answer`
- `category`
- `sortOrder`
- `visible`

## 9. Reusable Object Types

这些 object schema 可以被多个 document 复用。

### 9.1 `seo`

字段：

- `metaTitle`
- `metaDescription`
- `ogImage`
- `noIndex`

### 9.2 `cta`

字段：

- `label`
- `href`
- `style`
- `openInNewTab`

### 9.3 `linkItem`

字段：

- `label`
- `href`
- `openInNewTab`

### 9.4 `imageWithAlt`

字段：

- `image`
- `alt`
- `caption`

### 9.5 `richText`

Portable Text，支持：

- paragraph
- headings where needed
- bullet lists
- links
- inline strong/emphasis
- image blocks for long-form content

注意：

- 首页、菜单卡片、promotion card 这种固定设计模块不要用 richText。
- 这些地方用 structured fields，更稳定、更好维护。

### 9.6 `businessHours`

字段：

- `dayLabel`
- `open`
- `close`
- `closed`

### 9.7 `featureCard`

字段：

- `number`
- `title`
- `description`
- `image`
- `cta`

## 10. 技术实现架构

### 10.1 需要添加的 dependencies

```bash
npm install sanity next-sanity @sanity/image-url @sanity/vision
```

如果后续需要自定义 Studio input，再考虑：

```bash
npm install @sanity/icons @sanity/ui
```

第一阶段不建议引入不必要的 Sanity UI customization。

### 10.2 需要新增的文件

根目录：

- `sanity.config.ts`
- `sanity.cli.ts`

Sanity helper：

- `src/sanity/env.ts`
- `src/sanity/client.ts`
- `src/sanity/image.ts`
- `src/sanity/schemaTypes/index.ts`

Object schema：

- `src/sanity/schemaTypes/objects/seo.ts`
- `src/sanity/schemaTypes/objects/cta.ts`
- `src/sanity/schemaTypes/objects/linkItem.ts`
- `src/sanity/schemaTypes/objects/imageWithAlt.ts`

Document schema：

- `src/sanity/schemaTypes/documents/siteSettings.ts`
- `src/sanity/schemaTypes/documents/homePage.ts`
- `src/sanity/schemaTypes/documents/menuPage.ts`
- `src/sanity/schemaTypes/documents/menuCategory.ts`
- `src/sanity/schemaTypes/documents/menuItem.ts`
- `src/sanity/schemaTypes/documents/promotion.ts`
- `src/sanity/schemaTypes/documents/aboutPage.ts`
- `src/sanity/schemaTypes/documents/storyTimelineItem.ts`
- `src/sanity/schemaTypes/documents/galleryPage.ts`
- `src/sanity/schemaTypes/documents/galleryImage.ts`
- `src/sanity/schemaTypes/documents/testimonial.ts`
- `src/sanity/schemaTypes/documents/locationsPage.ts`
- `src/sanity/schemaTypes/documents/location.ts`
- `src/sanity/schemaTypes/documents/contactPage.ts`
- `src/sanity/schemaTypes/documents/orderPage.ts`
- `src/sanity/schemaTypes/documents/legalPage.ts`

Studio route：

- `src/app/(studio)/layout.tsx`
- `src/app/(studio)/studio/[[...tool]]/page.tsx`

可选：

- `src/sanity/queries.ts`

也可以把 query colocate 在对应 route 文件里，第一阶段这样更直观。

### 10.3 需要修改的现有文件

- `package.json`
  - 添加 Sanity dependencies。
- `next.config.ts`
  - 加 `cdn.sanity.io` 到 `images.remotePatterns`。
- `src/app/layout.tsx`
  - 后续可以 fetch `siteSettings`，把 Navbar/Footer 变成 CMS-driven。
- `src/components/Navbar.tsx`
  - 建议拆成 server wrapper + client mobile menu，或者先通过 props 接收 links。
- `src/components/Footer.tsx`
  - 把 hardcoded footer links/contact/socials 改成 props。
- 页面 routes：
  - `/`
  - `/menu`
  - `/about`
  - `/gallery`
  - `/locations`
  - `/contact`
  - `/order`
- 内容组件：
  - `HeroSection`
  - `MangaCollage`
  - `OrderIframe`

### 10.4 Fetching pattern

建议使用 server component fetch：

```ts
export const revalidate = 60;

const HOME_QUERY = `*[_type == "homePage"][0] { ... }`;
const PROMOTIONS_QUERY = `*[_type == "promotion" && active == true] | order(sortOrder asc, _createdAt desc) { ... }`;
```

然后把 CMS data 传给 presentational/client components。

保留 fallback：

- 如果 singleton document 不存在，使用当前 hardcoded content。
- 如果 collection 为空，使用当前 fallback arrays。
- 如果 image 缺失，使用当前 public assets。

这样迁移过程中网站不会因为 CMS 没录完内容而空白。

## 11. 实施阶段计划

### Phase 0 - 确认基础决策

需要确认：

- Sanity dataset 是否使用 `production`。
- `/studio` 是否要在生产环境公开访问，还是只给登录用户访问。
- 正式 domain 是什么，方便加 CORS。
- 当前是否只做英文。

建议：

- 第一阶段按英文-only 做，因为当前网站是英文内容。
- 如果很快要做中英双语，可以现在就把字段设计成 localized object：
  - `en`
  - `zh`
- 如果没有明确双语需求，不建议第一阶段增加 localization 复杂度。

### Phase 1 - 加 Sanity foundation

任务：

- 安装 Sanity dependencies。
- 创建 `.env.local`。
- 添加 `sanity.config.ts` 和 `sanity.cli.ts`。
- 添加 `src/sanity/env.ts`、`client.ts`、`image.ts`。
- 添加 embedded Studio route `/studio`。
- 添加初版 schema index。

验证：

- `npm run dev`
- 打开 `/studio`
- Studio 能加载 Yoramen schema。

### Phase 2 - 建立 schemas

任务：

- 先添加 object schemas：
  - `seo`
  - `cta`
  - `linkItem`
  - `imageWithAlt`
- 再添加 singleton documents：
  - `siteSettings`
  - `homePage`
  - `menuPage`
  - `aboutPage`
  - `galleryPage`
  - `locationsPage`
  - `contactPage`
  - `orderPage`
- 再添加 collection documents：
  - `menuCategory`
  - `menuItem`
  - `promotion`
  - `location`
  - `galleryImage`
  - `testimonial`
  - `storyTimelineItem`
  - `legalPage`

验证：

- Studio 可以创建/编辑 documents。
- Required fields 合理，不要严格到影响初期录入。
- Preview title 清楚，客户能知道每个 document 是什么。

### Phase 3 - 迁移当前 hardcoded content

任务：

- 把当前页面里已有内容录入 Sanity：
  - homepage hero 和 sections
  - menu categories/items
  - promotions
  - about story/timeline
  - gallery/testimonials
  - location/contact/order settings
  - footer/nav/social/legal placeholders
- 如果手动录入太慢，再写 seed script。
- 图片建议上传到 Sanity assets。
- 纯装饰 implementation assets 可以继续留在 `public`。

验证：

- 内容能在 Studio 里看到。
- 非代码用户可以改 menu item price、promotion、location phone 等。

### Phase 4 - 页面连接 CMS

建议连接顺序：

1. `siteSettings`、Navbar、Footer。
2. Home page。
3. Menu page。
4. Locations 和 Contact。
5. Gallery 和 About。
6. Order page。
7. Legal pages。

原因：

- Global settings 先处理，可以解决 nav/footer/social/legal link。
- Home/Menu 是最高业务价值页面。
- Order URL CMS 化后，订餐入口可以不用改代码。

验证：

- `npm run dev`
- 浏览所有 route。
- Sanity 内容缺失时页面不空白。
- Sanity 图片从 `cdn.sanity.io` 正常显示。
- `git status` 只有预期源代码改动。

### Phase 5 - Forms and integrations

Contact form：

- 当前是假提交，需要后续真实 API route。
- 可选方案：
  - Resend 发邮件
  - 写入 Sanity document
  - 接 webhook/CRM

Newsletter：

- 需要先确定 provider。
- 可选方案：
  - Mailchimp
  - Klaviyo
  - Shopify customer list
  - 自定义 API route

Ordering：

- 把第三方 order URL 放进 `orderPage` 或 `siteSettings.ordering`。
- 如果 iframe 被 provider CSP 阻止，就改为 external link mode。

### Phase 6 - Preview and publishing workflow

第一阶段建议：

- 只读取 published content。
- 使用 `revalidate = 60`。
- 编辑人员 publish 后，前台约 60 秒内更新。

后续可选：

- Next.js Draft Mode。
- Sanity Presentation / Visual Editing。

建议不要一开始就做 draft preview，除非客户强烈需要。否则会增加实现复杂度。

## 12. Route 到 CMS 的映射

### `/`

CMS sources：

- `homePage`
- `promotion`
- `siteSettings`

可编辑内容：

- Hero copy、CTA、badges、images。
- Philosophy copy 和 media。
- Promise cards。
- Specials intro 和 promotion cards。
- Newsletter copy。

### `/menu`

CMS sources：

- `menuPage`
- `menuCategory`
- `menuItem`

可编辑内容：

- 页面 header。
- 菜单分类。
- 菜品名称、描述、价格、tags、图片、是否上架。
- Combo CTA。

### `/about`

CMS sources：

- `aboutPage`
- `storyTimelineItem`

可编辑内容：

- Story headline、intro copy、quote、image/video。
- Timeline years、text、images。

### `/gallery`

CMS sources：

- `galleryPage`
- `galleryImage`
- `testimonial`

可编辑内容：

- 页面 header。
- Gallery filters/categories。
- Image grid。
- Testimonials。

### `/locations`

CMS sources：

- `locationsPage`
- `location`

可编辑内容：

- 页面 intro。
- 门店地址、电话、hours、wait note、map URL、directions URL。
- 未来多门店支持。

### `/contact`

CMS sources：

- `contactPage`
- `siteSettings.contact`

可编辑内容：

- Contact intro。
- Contact blocks。
- Form labels/placeholders/messages。

### `/order`

CMS sources：

- `orderPage`
- optional `siteSettings.ordering`

可编辑内容：

- 页面 copy。
- Provider name。
- Iframe URL 或 external order link。
- Fallback messaging。

### Legal pages

CMS sources：

- `legalPage`

可编辑内容：

- Privacy Policy。
- Terms of Service。
- 未来 footer linked legal pages。

## 13. 内容编辑规则

适合 structured fields 的内容：

- Hero。
- Cards。
- CTA。
- Menu items。
- Promotions。
- Locations。
- Gallery images。

适合 Portable Text 的内容：

- Legal pages。
- FAQ answers。
- 长文 article。

不让 editor 控制：

- Tailwind class names。
- arbitrary HTML。
- raw scripts。
- animation settings。
- iframe 之外的危险 embed/code。

Validation 建议：

- 缺失会破坏 UI 的字段才 required。
- External URL 做 URL validation。
- Internal link field 描述里给例子，比如 `/menu`、`/order`。
- Image field 开启 hotspot。
- 需要排序的 collection 都加 `sortOrder`。
- 需要上下架的 collection 都加 `visible` 或 `active`。

## 14. Sanity Studio 管理结构建议

建议 Studio 左侧结构按业务分组：

- Site
  - Site Settings
  - Navigation
  - Footer
- Pages
  - Home Page
  - Menu Page
  - About Page
  - Gallery Page
  - Locations Page
  - Contact Page
  - Order Page
- Menu
  - Menu Categories
  - Menu Items
- Marketing
  - Promotions
  - Testimonials
  - Gallery Images
- Operations
  - Locations
  - Story Timeline
  - Legal Pages

同时需要把页面型 document 做成 singleton：

- `siteSettings`
- `homePage`
- `menuPage`
- `aboutPage`
- `galleryPage`
- `locationsPage`
- `contactPage`
- `orderPage`

这样客户不会误创建多个 Home Page。

## 15. 风险和规避方式

### Risk: CMS model 太宽泛

规避：

- 第一阶段只围绕当前 route 建 domain-specific schemas。
- 不做 full page builder。

### Risk: Sanity 没内容导致页面空白

规避：

- 保留 hardcoded fallback content。
- Component 做 defensive null handling。

### Risk: Sanity 图片不显示

规避：

- `next.config.ts` 加 `cdn.sanity.io`。
- 使用 `@sanity/image-url`。
- 保留 alt text。

### Risk: Editor 隐藏或删除关键内容

规避：

- 关键 singleton 不加 visible toggle。
- Collection item 才加 visible/active。
- 使用 validation 和 initialValue。

### Risk: Contact/newsletter 被误认为已完成真实功能

规避：

- 文档和 CMS 字段里明确当前只是 UI。
- 只有接入真实 API/provider 后才标记 complete。

### Risk: 第三方订餐 iframe 不能嵌入

规避：

- Schema 同时支持 `iframeUrl` 和 `externalOrderUrl`。
- 如果 iframe 被 CSP/X-Frame-Options 阻止，前台自动 fallback 成外链按钮。

## 16. 第一阶段验收标准

第一阶段 CMS-enabled milestone 完成标准：

- `/studio` 可以在 Next.js 项目中打开。
- Sanity schemas 覆盖：
  - global settings
  - home
  - menu
  - promotions
  - locations
  - contact
  - order
  - gallery
  - testimonials
  - legal pages
- 非代码编辑人员可以更新：
  - homepage hero copy
  - one promotion
  - one menu item price
  - location phone/hours
  - order iframe URL
  - footer social link
- 前台网站能显示这些更新，不需要改代码。
- `npm run build` 通过。
- 当前设计和动画保持一致。

## 17. 推荐下一步开发范围

建议下一轮实际开发按这个顺序做：

1. 安装 Sanity dependencies。
2. 添加 `sanity.config.ts`、`sanity.cli.ts`、`src/sanity/*` helper。
3. 添加 `/studio` route。
4. 添加第一批 schema：
   - `siteSettings`
   - `homePage`
   - `menuCategory`
   - `menuItem`
   - `promotion`
   - `location`
   - `orderPage`
5. `next.config.ts` 加 `cdn.sanity.io`。
6. 先连接 `/menu`，因为业务价值最高、结构最清楚。
7. 再连接 `/order`，让订餐 URL 变成 CMS 可编辑。
8. 再连接 Navbar/Footer 和 homepage。
9. 最后连接 About/Gallery/Locations/Contact/Legal。

这个顺序能尽快让 CMS 产生实际价值，同时降低一次性迁移带来的风险。

## 18. 后续扩展

后续可以考虑：

- Draft Mode / Preview。
- Sanity Presentation / Visual Editing。
- 中英双语 localization。
- Role-based editing。
- Seed/import script。
- Content QA checklist。

建议给 editor 的发布前检查清单：

- 图片是否上传。
- 图片 alt text 是否填写。
- 价格是否正确。
- CTA link 是否能打开。
- 手机端标题是否太长。
- Promotion 是否设置了 active/end date。
- 门店电话和营业时间是否更新。

