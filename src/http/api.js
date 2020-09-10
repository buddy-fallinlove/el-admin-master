import service from "./index";
import JSonp from "jsonp";

export default {
    // 发送jsonp请求
    jsonp(options) {
        return new Promise((resolve, reject) => {
            JSonp(
                options.url, {
                    param: "callback"
                },
                function(err, response) {
                    if (response.status === "success") {
                        resolve(response);
                    } else {
                        reject(response.message);
                    }
                }
            );
        });
    },

    // 登录
    login({ username, password }) {
        return service.req("login", {
            username,
            password
        });
    },
    // 用户数据列表
    getUsers({ pagenum = 1, pagesize = 10, query }) {
        if (query) {
            return service.req(
                `users?pagenum=${pagenum}&pagesize=${pagesize}&query=${query}`
            );
        } else {
            return service.req(`users?pagenum=${pagenum}&pagesize=${pagesize}`);
        }
    },

    // 添加用户
    addUser({ username, password, email = "", mobile = "" }) {
        return service.req("users", {
            username,
            password,
            email,
            mobile
        });
    },

    // 修改用户状态
    updateUserState({ uId, type }) {
        return service.put(`users/${uId}/state/${type}`);
    },

    // 根据 ID 查询用户信息
    getUserByID({ id }) {
        return service.req(`users/${id}`);
    },

    // 编辑用户提交
    updateUser({ uId, email = "", mobile = "" }) {
        return service.put(`users/${uId}`, {
            email,
            mobile
        });
    },

    // 删除单个用户
    deleteUser({ id }) {
        return service.delete(`users/${id}`);
    },
    // 分配用户角色
    serUserRole({ id, rid }) {
        return service.put(`users/${id}/role`, {
            rid
        });
    },

    // 所有权限列表
    allRights({ type }) {
        return service.req(`rights/${type}`);
    },

    // 左侧菜单权限
    getMenus() {
        return service.req("menus");
    },

    // 角色列表
    getRole() {
        return service.req("roles");
    },

    // 添加角色
    addRole({ roleName, roleDesc = "" }) {
        return service.req("roles", {
            roleName,
            roleDesc
        });
    },

    // 删除角色
    deleteRole({ id }) {
        return service.delete(`roles/${id}`);
    },

    // 编辑角色
    updateRole({ id, roleName, roleDesc = "" }) {
        return service.put(`roles/${id}`, {
            roleName,
            roleDesc
        });
    },

    // 角色授权
    serRoles({ roleId, rids }) {
        return service.req(`roles/${roleId}/rights`, {
            rids
        });
    },

    // 删除角色指定权限
    deleteRights({ roleId, rightId }) {
        return service.delete(`roles/${roleId}/rights/${rightId}`);
    },

    // 商品分类数据列表
    getCategory({ type, pagenum, pagesize }) {
        if (type && !pagesize && !pagenum) {
            return service.req(
                `categories?type=${type}`
            );
        } else {
            return service.req(
                `categories?type=${type}&pagenum=${pagenum}&pagesize=${pagesize}`
            );
        }
    },

    // 添加分类
    addCategories({ cat_pid, cat_name, cat_level }) {
        return service.req('categories', {
            cat_pid,
            cat_name,
            cat_level
        })
    },

    // 删除分类
    deleteCategory({ id }) {
        return service.delete(`categories/${id}`)
    },

    // 编辑分类
    updateCategory({ id, cat_name }) {
        return service.put(`categories/${id}`, {
            cat_name
        })
    },

    // 参数列表
    getAttrs({ id, sel }) {
        return service.req(`categories/${id}/attributes?sel=${sel}`)
    },

    // 编辑提交参数
    editAttrs({ id, attrId, attr_name, attr_sel, attr_vals }) {
        return service.put(`categories/${id}/attributes/${attrId}`, {
            attr_name,
            attr_sel,
            attr_vals
        })
    },

    // 添加动态参数或者静态属性
    addAttrs({ id, attr_name, attr_sel }) {
        return service.req(`categories/${id}/attributes`, {
            attr_name,
            attr_sel
        })
    },

    //  删除参数
    deleteAttr({ id, attrid }) {
        return service.delete(`categories/${id}/attributes/${attrid}`)
    },

    // 商品列表数据
    getGoods({ pagenum, pagesize, query }) {
        if (query) {
            return service.req(`goods?pagenum=${pagenum}&pagesize=${pagesize}&query=${query}`)
        } else {
            return service.req(`goods?pagenum=${pagenum}&pagesize=${pagesize}`)
        }
    },

    // 删除商品
    deleteGood({ id }) {
        return service.delete(`goods/${id}`)
    },

    // 编辑商品
    updateGood({ id, goods_name, goods_price, goods_number, goods_weight }) {
        return service.put(`goods/${id}`, {
            goods_name,
            goods_number,
            goods_price,
            goods_weight
        })
    },

    // 添加上品
    addGoods({ goods_name, goods_cat, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs }) {
        return service.post('goods', {
            goods_name,
            goods_cat,
            goods_price,
            goods_number,
            goods_weight,
            goods_introduce,
            pics,
            attrs
        })
    },

    // 获取订单
    getOrders({ query, pagenum, pagesize }) {
        if (query) {
            return service.req(`orders?pagenum=${pagenum}&pagesize=${pagesize}&query=${query}`)
        } else {
            return service.req(`orders?pagenum=${pagenum}&pagesize=${pagesize}`)
        }
    },

    // 查看订单详情
    orderDetail({ id }) {
        return service.req(`orders/${id}`)
    },

    // 查看物流信息
    getLogistics({ id }) {
        return service.req(`/kuaidi/${id}`)
    },

    // 获取数据报表
    getReports() {
        return service.req('reports/type/1')
    }
};