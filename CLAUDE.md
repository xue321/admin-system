# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

后台管理系统 (admin-system)，包含前后端分离架构 + 用户前台（错题本系统）。

## Tech Stack

- **Backend**: Java 17 + Spring Boot 3.2.5 + MyBatis-Plus + Spring Security + JWT
- **Frontend (管理后台)**: React 18 + TypeScript + Ant Design 5 + Vite
- **Frontend (用户前台/错题本)**: React 18 + TypeScript + Ant Design 5 + Vite + React-Quill + ECharts + simple-mind-map
- **Database**: MySQL 8

## Project Structure

```
admin-system/
├── backend/          # Spring Boot 后端 (端口 8080)，管理后台和用户前台共用
│   └── src/main/java/com/admin/
│       ├── controller/   # REST API（含 Portal 前台接口）
│       ├── service/      # 业务逻辑（含 SM-2 间隔重复算法）
│       ├── mapper/       # 数据库访问 (MyBatis-Plus)
│       ├── entity/       # 数据实体（ErrorCategory/ErrorQuestion/ErrorQuestionImage/ErrorTag/ErrorQuestionTag）
│       ├── dto/          # 请求/响应对象
│       ├── security/     # JWT 认证
│       ├── config/       # Spring 配置（含 FileUploadConfig）
│       ├── aspect/       # AOP 日志切面
│       └── exception/    # 全局异常处理
├── frontend/         # 管理后台 React 前端 (端口 5173)
│   └── src/
│       ├── api/          # axios 请求封装
│       ├── pages/        # 页面组件
│       ├── components/   # 通用组件
│       └── store/        # zustand 状态管理
└── user-portal/      # 用户前台/错题本 React 前端 (端口 5174)
    └── src/
        ├── api/          # axios 请求封装（/api/portal/）
        ├── pages/        # Login, Dashboard, Category, Question, Tag, Review, MindMap(List+Editor)
        ├── components/   # Layout, RichTextEditor, TagSelector
        ├── utils/        # pdfExport 工具
        └── store/        # zustand 状态管理
```

## Commands

### Backend
```bash
cd admin-system/backend
mvn clean compile          # 编译
mvn spring-boot:run        # 启动后端 (需先配置数据库)
```

### Frontend (管理后台)
```bash
cd admin-system/frontend
npm install --registry=https://registry.npmmirror.com
npm run dev                # 启动开发服务器 (端口 5173)
```

### User Portal (错题本前台)
```bash
cd admin-system/user-portal
npm install --registry=https://registry.npmmirror.com
npm run dev                # 启动开发服务器 (端口 5174)
```

### Database
```bash
mysql -u root -p admin_system < admin-system/backend/src/main/resources/schema.sql
mysql -u root -p admin_system < admin-system/backend/src/main/resources/schema-portal.sql
mysql -u root -p admin_system < admin-system/backend/src/main/resources/schema-portal-v2.sql
mysql -u root -p admin_system < admin-system/backend/src/main/resources/schema-mindmap.sql
```

## Default Login

- 账号: `admin` / 密码: `admin123`

## Configuration

- 数据库连接: `backend/src/main/resources/application.yml`（密码: root123456）
- 前端代理: `frontend/vite.config.ts` (开发时代理 /api 到后端 8080)
- 用户前台代理: `user-portal/vite.config.ts` (代理 /api 到后端 8080)
- 文件上传目录: `backend/uploads/`
- CORS 配置: `backend/.../config/CorsConfig.java`（已允许 5173/5174/5175/5176）

## 错题本系统 API

所有用户前台 API 前缀为 `/api/portal/`：
- `POST /api/portal/auth/login` — 登录
- `GET/POST/PUT/DELETE /api/portal/categories` — 分类 CRUD（树形结构）
- `GET /api/portal/categories/mind-map-data` — 分类树数据（含题目数量，用于导入生成思维导图）
- `GET/POST/PUT/DELETE /api/portal/mindmaps` — 思维导图 CRUD（自定义编辑+数据导入）
- `GET /api/portal/mindmaps/{id}` — 获取思维导图详情（含 JSON data）
- `GET/POST/PUT/DELETE /api/portal/questions` — 错题 CRUD
- `PUT /api/portal/questions/{id}/status` — 更新颜色/状态/删除线/复习次数
- `PUT /api/portal/questions/{id}/review` — 间隔重复复习（接受 quality 参数 1-5）
- `GET /api/portal/questions/due-review` — 获取今日待复习题目
- `GET /api/portal/questions/statistics` — 统计数据（含 dueToday）
- `GET /api/portal/questions/chart-data?days=30` — 图表数据
- `GET/POST/PUT/DELETE /api/portal/tags` — 标签 CRUD
- `GET /api/portal/tags/questions/{id}` — 获取题目标签
- `PUT /api/portal/tags/questions/{id}` — 设置题目标签
- `POST /api/portal/upload/image` — 图片上传

## 错题本功能（第一期 + 第二期全部完成）

### 第一期（核心功能）
- ✅ 自定义分类（树形，无限层级）
- ✅ 错题录入（标题、内容、错误答案、正确答案、笔记）
- ✅ 图片上传（粘贴到内容中）
- ✅ 颜色标记（红/橙/黄/蓝/灰/黑）
- ✅ 复习状态（未复习/复习中/已掌握）
- ✅ 删除线标记
- ✅ 复习次数统计（+/-）
- ✅ 按分类/状态/关键词筛选（父分类自动包含子分类题目）

### 第二期（扩展功能）
- ✅ 富文本编辑器（React-Quill，支持图片上传/格式化/代码块）
- ✅ 标签系统（多标签，带颜色，可筛选）
- ✅ 间隔重复复习（SM-2 算法，闪卡式复习页面，quality 评分 1-5）
- ✅ 统计图表（ECharts：每日复习折线图、分类饼图、状态柱状图、掌握趋势图）
- ✅ 思维导图（simple-mind-map，自定义创建/编辑，从分类一键导入生成）
- ✅ PDF 导出（jsPDF + html2canvas，多选导出）

## 数据库表

| 表名 | 说明 |
|------|------|
| `sys_user` | 系统用户（管理员+普通用户） |
| `error_category` | 错题分类（树形） |
| `error_question` | 错题记录（含 SM-2 字段：next_review_date, ease_factor, interval_days） |
| `error_question_image` | 错题图片 |
| `error_tag` | 标签 |
| `error_question_tag` | 错题-标签关联 |
| `error_mind_map` | 思维导图（JSON存储导图数据） |

## 后续可扩展功能

- 数据导入/批量操作
- 错题打印排版优化
- 移动端适配
- 多用户协作/分享
- AI 智能出题/解析
