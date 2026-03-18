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
  Select,
  Submit,
  Switch
} from '@formily/element-plus'
import { ISchema, createSchemaField } from '@formily/vue'
import { ElMessage } from 'element-plus/es'
import {
  IdentityRoleCreateDto,
  IdentityRoleUpdateDto,
  RoleServiceProxy
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
    Switch,
    Select
  }
})
const schema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: t('sys.roles.name'),
      maxLength: 256,
      minLength: 0,
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelWidth: 100
      }
    },
    isDefault: {
      type: 'boolean',
      title: t('sys.roles.isDefault'),
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelWidth: 100,
        style: 'text-align:left'
      }
    },
    isPublic: {
      type: 'boolean',
      title: t('sys.roles.isPublic'),
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelWidth: 100,
        style: 'text-align:left'
      }
    }
  }
}

// if (props.mode !== 'create') {
//     delete schema.properties!.password
// }

const onSubmit = async (value: any) => {
  const client = new RoleServiceProxy(undefined, axios)
  if (props.mode === 'create') {
    await client.create(IdentityRoleCreateDto.fromJS(value))
  } else {
    await client.update(props.data.id, IdentityRoleUpdateDto.fromJS(value))
  }

  ElMessage.success(t('common.submitSuccess'))
  show.value = false
  emit('submitSuccess')
}
</script>
