<template>
  <ElDialog v-model="show" width="500px" destroy-on-close lock-scroll draggable top="0" :close-on-click-modal="false">
    <template #header="{ close }">
      <div class="flex justify-between items-center h-54px pl-15px pr-15px relative">
        {{ t('common.editProfile') }}
        <!-- <div class="h-54px flex justify-between items-center absolute top-[50%] right-15px translate-y-[-50%]">
                    <Icon v-if="fullscreen" class="cursor-pointer is-hover !h-54px mr-10px"
                        :icon="isFullscreen ? 'radix-icons:exit-full-screen' : 'radix-icons:enter-full-screen'"
                        color="var(--el-color-info)" hover-color="var(--el-color-primary)" @click="toggleFull" />
                    <Icon class="cursor-pointer is-hover !h-54px" icon="ep:close" hover-color="var(--el-color-primary)"
                        color="var(--el-color-info)" @click="close" />
                </div> -->
      </div>
    </template>
    <Form :form="form">
      <SchemaField :schema="schema" />
      <Submit @submit="onSubmit">{{ t('common.save') }}</Submit>
    </Form>
  </ElDialog>
</template>

<script lang="ts" setup>
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/vue'
import { ISchema } from '@formily/json-schema'
import { Form, FormItem, Input, Submit } from '@formily/element-plus'
import { ProfileServiceProxy, UpdateProfileDto } from '~/api/ServiceProxies'
import { ElMessage } from 'element-plus/es'

const { t } = useI18n()

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])
const show = computed({
  get: () => props.modelValue,
  set: val => {
    emit('update:modelValue', val)
  }
})

const form = createForm()

const schema: ISchema = {
  type: 'object',
  properties: {
    surname: {
      type: 'string',
      title: t('profile.surname'),
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelWidth: 100
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
    email: {
      type: 'string',
      required: true,
      title: t('profile.email'),
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelWidth: 100
      }
    },
    phoneNumber: {
      type: 'string',
      title: t('profile.phoneNumber'),
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelWidth: 100
      }
    }
  }
}

const { SchemaField } = createSchemaField({
  components: {
    FormItem,
    Input
  }
})

const client = new ProfileServiceProxy(undefined, axios)

const onSubmit = async (value: any) => {
  await client.update(UpdateProfileDto.fromJS(value))
  ElMessage.success(t('common.modifySuccess'))
  show.value = false
}

onMounted(async () => {
  var profile = await client.get()
  // formily init value
  form.setInitialValues(profile)
})
</script>
