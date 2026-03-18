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
  IdentityUserCreateDto,
  IdentityUserUpdateDto,
  UserServiceProxy
} from '~/api/ServiceProxies'

// defineOptions({
//     name: 'CreateSysUser'
// })
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
    surname: {
      type: 'string',
      title: t('profile.surname'),
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelWidth: 100,
        gridSpan: 'span 2'
      }
    },
    name: {
      type: 'string',
      required: true,
      title: t('profile.name'),
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelWidth: 100
      }
    },
    email: {
      type: 'string',
      required: true,
      title: t('profile.email'),
      format: 'email',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelWidth: 100
      }
    },
    phoneNumber: {
      type: 'string',
      title: t('profile.phoneNumber'),
      format: 'phone',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelWidth: 100
      }
    },
    userName: {
      type: 'string',
      required: true,
      title: t('profile.userName'),
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelWidth: 100
      }
    },
    password: {
      type: 'string',
      required: true,
      title: t('profile.password'),
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelWidth: 100
      }
    },
    roleNames: {
      type: 'array',
      title: '角色',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelWidth: 100
      }
    },
    isActive: {
      type: 'boolean',
      title: '账号启用',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelWidth: 100,
        style: 'text-align:left'
      }
    },
    lockoutEnabled: {
      type: 'boolean',
      title: '锁定机制',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelWidth: 100,
        tooltip: '密码输错5次后锁定账号15分钟',
        style: 'text-align:left'
      }
    }
  }
}

if (props.mode !== 'create') {
  delete schema.properties!.password
}

const onSubmit = async (value: any) => {
  const client = new UserServiceProxy(undefined, axios)
  if (props.mode === 'create') {
    await client.create(IdentityUserCreateDto.fromJS(value))
  } else {
    await client.update(props.data.id, IdentityUserUpdateDto.fromJS(value))
  }

  ElMessage.success(t('common.submitSuccess'))
  show.value = false
  emit('submitSuccess')
}
</script>
