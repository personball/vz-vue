<template>
  <ListPage ref="list" :searchFormSchema="searchFormSchema" :listColumns="listColumns" @queryList="getData">
    <template #listActions>
      <el-button type="primary" @click="showAdd()">{{
        t('common.create')
        }}</el-button>
    </template>
    <template #columnActions="{ row }">
      <el-button @click="showEdit(row)" type="primary">{{
        t('common.edit')
        }}</el-button>
      <el-button @click="showDetail(row)" type="success">{{
        t('common.detail')
        }}</el-button>
      <el-popconfirm :title="t('common.confirmDelete')" @confirm="del(row)">
        <template #reference>
          <el-button type="danger">{{ t('common.delete') }}</el-button>
        </template>
      </el-popconfirm>
    </template>
  </ListPage>
  <CreateOrEditSysUser v-if="openDialog" v-model="openDialog" :mode="dialogMode" :data="data"
    @submit-success="list.reload()">
  </CreateOrEditSysUser>
</template>

<script lang="tsx" setup>
import { ISchema } from '@formily/vue'
import { IdentityUserDto, UserServiceProxy } from '~/api/ServiceProxies'
import type { QueryListHander } from '~/components/pages/types'
import CreateOrEditSysUser from './__CreateOrEdit.vue'
import dayjs from 'dayjs'
import { ElTooltip, ElTag } from 'element-plus/es'

const { t } = useI18n()
const list = ref()
const searchFormSchema: ISchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        layout: 'inline'
      },
      properties: {
        filter: {
          type: 'string',
          title: '关键词',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '用户名/邮箱',
            clearable: true,
            style: 'width:150px'
          },
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            wrapperStyle: '.el-form--inline'
          }
        }
      }
    }
  }
}

const listColumns = ref([
  { label: 'sys.users.userName', prop: 'userName' },
  {
    label: 'sys.users.fullName',
    prop: 'name',
    formatter: (row: any) => row.name + ' ' + row.surname
  },
  {
    label: 'sys.users.email',
    prop: 'email',
    formatter: (row: any) => {
      return row.emailConfirmed ? (
        <ElTag type="success"> {row.email}</ElTag>
      ) : (
        <ElTooltip content="not verified">
          <ElTag type="info">{row.email}</ElTag>
        </ElTooltip>
      )
    }
  },
  {
    label: 'sys.users.phoneNumber',
    prop: 'phoneNumber',
    formatter: (row: any) => {
      if (!row.phoneNumber) {
        return
      }

      return row.phoneNumberConfirmed ? (
        <ElTag type="success">{row.phoneNumber}</ElTag>
      ) : (
        <ElTooltip content="not verified">
          <ElTag type="info">{row.phoneNumber}</ElTag>
        </ElTooltip>
      )
    }
  },
  {
    label: 'sys.users.isActive',
    prop: 'isActive',
    formatter: (row: any) => {
      return row.isActive ? (
        <ElTag type="success">{t('common.yes')}</ElTag>
      ) : (
        <ElTag type="info">{t('common.no')}</ElTag>
      )
    }
  },
  {
    label: 'sys.users.lockoutEnabled',
    prop: 'lockoutEnabled',
    formatter: (row: any) => {
      return row.lockoutEnabled ? (
        <ElTag type="success">{t('common.yes')}</ElTag>
      ) : (
        <ElTag type="info">{t('common.no')}</ElTag>
      )
    }
  },
  {
    label: 'sys.users.lockoutEnd',
    prop: 'lockoutEnd',
    formatter: (row: any) =>
      row.lockoutEnd ? dayjs(row.lockoutEnd).format('YYYY-MM-DD HH:mm') : '-'
  },
  {
    label: 'common.creationTime',
    prop: 'creationTime',
    formatter: (row: any) => dayjs(row.creationTime).format('YYYY-MM-DD HH:mm')
  }
])

const client = new UserServiceProxy(undefined, axios)

const getData: QueryListHander<IdentityUserDto> = async ({
  queryForm,
  skipCount,
  maxResultCount,
  updateList
}) => {
  const { totalCount, items } = await client.usersGET2(
    queryForm.filter,
    'CreationTime desc',
    unref(skipCount),
    unref(maxResultCount)
  )
  updateList(items ?? [], totalCount ?? 0)
}

const openDialog = ref(false)
const dialogMode = ref<'create' | 'edit' | 'detail'>('create')
const data = ref()

const showAdd = () => {
  dialogMode.value = 'create'
  openDialog.value = true
}

const showEdit = (row: any) => {
  data.value = row
  dialogMode.value = 'edit'
  openDialog.value = true
}

const showDetail = (row: any) => {
  data.value = row
  dialogMode.value = 'detail'
  openDialog.value = true
}

const del = async (row: any) => {
  const client = new UserServiceProxy(undefined, axios)
  await client.usersDELETE(row.id)
  list.value.reload()
}

// 查询用户列表，搜索用户
// 查询指定用户详情
// 修改用户信息
// 删除用户
// 创建用户
// TODO: 查询用户角色
// TODO: 修改用户角色（加载可用角色）
// 查询用户列表，搜索用户名
// 按用户名查询用户列表
// 按邮箱地址查询用户列表

// TODO: UserLookup 用户选择组件？

// TODO: modal, drawer
</script>

<style lang="scss" scoped></style>
