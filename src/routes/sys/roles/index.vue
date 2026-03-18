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
      <el-popconfirm v-if="!row.isStatic" :title="t('common.confirmDelete')" @confirm="del(row)">
        <template #reference>
          <el-button type="danger">{{ t('common.delete') }}</el-button>
        </template>
      </el-popconfirm>
    </template>
  </ListPage>
  <CreateOrEditSysRole v-if="openDialog" v-model="openDialog" :mode="dialogMode" :data="data"
    @submit-success="list.reload()">
  </CreateOrEditSysRole>
</template>

<script lang="tsx" setup>
import { ISchema } from '@formily/vue'
import { IdentityRoleDto, RoleServiceProxy } from '~/api/ServiceProxies'
import type { QueryListHander } from '~/components/pages/types'
import CreateOrEditSysRole from './__CreateOrEdit.vue'
import { ElTag } from 'element-plus/es'

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
            placeholder: '角色名',
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
  { label: 'sys.roles.name', prop: 'name' },
  {
    label: 'sys.roles.isDefault',
    prop: 'isDefault',
    formatter: (row: any) => {
      return row.isDefault ? (
        <ElTag type="success">{t('common.yes')}</ElTag>
      ) : (
        <ElTag type="info">{t('common.no')}</ElTag>
      )
    }
  },
  {
    label: 'sys.roles.isStatic',
    prop: 'isStatic',
    formatter: (row: any) => {
      return row.isStatic ? (
        <ElTag type="success">{t('common.yes')}</ElTag>
      ) : (
        <ElTag type="info">{t('common.no')}</ElTag>
      )
    }
  },
  {
    label: 'sys.roles.isPublic',
    prop: 'isPublic',
    formatter: (row: any) => {
      return row.isPublic ? (
        <ElTag type="success">{t('common.yes')}</ElTag>
      ) : (
        <ElTag type="info">{t('common.no')}</ElTag>
      )
    }
  }
])

const client = new RoleServiceProxy(undefined, axios)

const getData: QueryListHander<IdentityRoleDto> = async ({
  queryForm,
  skipCount,
  maxResultCount,
  updateList
}) => {
  const { totalCount, items } = await client.getList(
    queryForm.filter,
    '',
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
  await client.delete(row.id)
  list.value.reload()
}
</script>

<style lang="scss" scoped></style>
