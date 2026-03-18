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
  <CreateOrEditSysTenant v-if="openDialog" v-model="openDialog" :mode="dialogMode" :data="data"
    @submit-success="list.reload()">
  </CreateOrEditSysTenant>
</template>

<script lang="ts" setup>
import { ISchema } from '@formily/vue'
import { TenantDto, TenantServiceProxy } from '~/api/ServiceProxies'
import type { QueryListHander } from '~/components/pages/types'
import CreateOrEditSysTenant from './__CreateOrEdit.vue'
import dayjs from 'dayjs'

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
            placeholder: '租户名称',
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

const listColumns = ref([{ label: 'sys.tenants.name', prop: 'name' }])

const client = new TenantServiceProxy(undefined, axios)

const getData: QueryListHander<TenantDto> = async ({
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
