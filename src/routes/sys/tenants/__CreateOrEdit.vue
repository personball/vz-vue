<template>
  <el-dialog v-model="show" width="600px" destroy-on-close lock-scroll draggable top="0" :close-on-click-modal="false">
    <template #header>
      <div class="flex justify-between items-center h-54px pl-15px pr-15px relative">
        {{ t('common.' + mode) }}
      </div>
    </template>
    <Form :form="form" preview-text-placeholder="-">
      <SchemaField :schema="schema" />
      <Submit v-if="mode !== 'detail'" @submit="onSubmit">提交</Submit>
    </Form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { createForm } from '@formily/core'
import {
  Form,
  FormItem,
  Input,
  Password,
  Select,
  Submit,
  Switch
} from '@formily/element-plus'
import { ISchema, createSchemaField } from '@formily/vue'
import { ElMessage } from 'element-plus/es'
import {
  TenantCreateDto,
  TenantUpdateDto,
  TenantServiceProxy
} from '~/api/ServiceProxies'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    data?: any
    mode?: 'create' | 'edit' | 'detail'
  }>(),
  {
    modelValue: false,
    mode: 'create'
  }
)

const emit = defineEmits(['update:modelValue', 'submitSuccess'])
const show = computed({
  get: () => props.modelValue,
  set: val => {
    emit('update:modelValue', val)
  }
})

const form = createForm()
if (props.mode !== 'create') {
  form.setInitialValues(props.data)
}

if (props.mode === 'detail') {
  form.setState(state => {
    state.editable = false
  })
}

const { SchemaField } = createSchemaField({
  components: {
    FormItem,
    Input,
    Password,
    Switch,
    Select
  }
})
const schema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: t('sys.tenants.name'),
      maxLength: 64,
      minLength: 0,
      required: true,
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelWidth: 150
      }
    },
    adminEmailAddress: {
      type: 'string',
      title: t('sys.tenants.adminEmailAddress'),
      maxLength: 256,
      required: true,
      format: 'email',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelWidth: 150
      }
    },
    adminPassword: {
      type: 'string',
      title: t('sys.tenants.adminPassword'),
      maxLength: 128,
      required: true,
      'x-component': 'Password',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelWidth: 150
      }
    }
  }
}

if (props.mode !== 'create') {
  delete schema.properties!.adminEmailAddress
  delete schema.properties!.adminPassword
}

const onSubmit = async (value: any) => {
  const client = new TenantServiceProxy(undefined, axios)
  if (props.mode === 'create') {
    await client.create(TenantCreateDto.fromJS(value))
  } else {
    await client.update(props.data.id, TenantUpdateDto.fromJS(value))
  }

  ElMessage.success(t('common.submitSuccess'))
  show.value = false
  emit('submitSuccess')
}
</script>
