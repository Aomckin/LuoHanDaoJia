# 罗汉到家 FastAPI + SQLite MVP 设计

## 目标

在现有 React 上门按摩 MVP 中加入最小化的 FastAPI + SQLite 后端，使技师和订单数据通过 API 读写并持久化到本地数据库。

## 范围

包含：

- SQLite 自动建库和两张表。
- 启动时写入 3 位长沙技师模拟数据。
- 获取技师、创建订单、获取订单、更新订单状态四个接口。
- 前端首页、预约、历史订单和状态推进改为调用 API。
- 本地订单数据在刷新后仍然存在。

不包含：

- 用户系统、登录、权限和支付。
- 额外的数据表、复杂分层、测试框架和后端管理端。
- 地图定位服务；地图继续使用现有前端坐标数据。

## 后端结构

```text
backend/
├── main.py          # FastAPI 应用、CORS、接口和初始化逻辑
├── database.py      # SQLite 引擎、Session 和建表入口
├── models.py        # Technician 与 Order 模型
└── requirements.txt # fastapi、uvicorn、sqlalchemy
```

数据库文件为 `backend/luohan.db`，不提交到 Git。

## 数据模型

```text
technicians
  id: Integer primary key
  name: String
  rating: Float
  distance: Float
  price: Integer

orders
  id: Integer primary key
  technician_id: Integer foreign key -> technicians.id
  service_name: String
  price: Integer
  date: String
  time: String
  status: Integer (0-3)
  created_at: DateTime
```

订单状态固定为：`0 待接单`、`1 已接单`、`2 服务中`、`3 已完成`。

## API 契约

后端运行在 `http://127.0.0.1:8000`，允许 Vite 开发地址跨域请求。

```text
GET /technicians
```

返回技师的 `id`、`name`、`rating`、`distance` 和 `price`。

```text
POST /orders
```

请求体：

```json
{
  "technician_id": 1,
  "service_name": "精油推背",
  "price": 299,
  "date": "2026-07-30",
  "time": "14:00"
}
```

创建订单并返回订单记录。

```text
GET /orders
```

按创建时间倒序返回订单，并携带对应技师名称，供订单列表和详情页展示。

```text
PUT /orders/{id}/status
```

请求体为 `{ "status": 0-3 }`。非法状态或不存在的订单返回 HTTP 404 或 400。

## 前端数据流

```text
首页 GET /technicians
       ↓
预约 POST /orders
       ↓
订单任务页与详情页 GET /orders
       ↓
推进状态 PUT /orders/{id}/status
```

`src/data/technicians.js` 继续保留头像、服务、地图坐标等展示补充字段。首页会以 API 的技师名称、评分、距离和价格覆盖这些字段。

订单 service 从 LocalStorage 改为异步 API 请求。`getOrderById(id)` 在 `GET /orders` 的结果中匹配目标订单，不新增详情接口。

请求失败时页面显示简短错误提示；页面布局和已有预约路径保持可用，但不会回退到 LocalStorage，以确保演示的数据来源明确为 SQLite。

## 启动方式

```bash
# 后端
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# 前端（项目根目录）
pnpm run dev
```
