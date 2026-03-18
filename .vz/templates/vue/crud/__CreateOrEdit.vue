<!--
{{~ api=swagger.paths[path].post ~}}
{{~ api ~}}

{{~ requestTypeRef=api.requestBody.content["application/json"].schema["$ref"] ~}}
{{~ requestTypeSchema=swagger.components.schemas[requestTypeRef|regex.split `\/`|array.last] ~}}

{{~ requestTypeSchema ~}}

{{~ requestType=requestTypeRef|regex.split `\.`|array.last ~}}

{{~ tag=api.tags[0] ~}}
{{~ tag ~}}


-->
<template>
  <el-dialog
    v-model="show"
    width="600px"
    destroy-on-close
    lock-scroll
    draggable
    top="0"
    :close-on-click-modal="false"
  >
    <template #header>
      <div
        class="flex justify-between items-center h-54px pl-15px pr-15px relative"
      >
        {%{{{ t('common.' + mode) }}}%}
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
import { Form, FormItem, Input, Select, Submit, Switch } from '@formily/element-plus'
import { ISchema, createSchemaField } from '@formily/vue'
import { ElMessage } from 'element-plus/es'
import { {{requestType}}, Update{{tag}}Dto, {{tag}}ServiceProxy } from '~/api/ServiceProxies'

const { t } = useI18n()

const props = withDefaults(defineProps<{
    modelValue?: boolean,
    data?: any,
    mode?: 'create' | 'edit' | 'detail'
}>(), {
    modelValue: false,
    mode: 'create'
})

const emit = defineEmits(['update:modelValue', 'submitSuccess'])
const show = computed({
    get: () => props.modelValue,
    set: (val) => {
        emit('update:modelValue', val)
    }
})

const form = createForm()
if (props.mode !== 'create') {
    form.setInitialValues(props.data)
}

if (props.mode === 'detail') {
    form.setState((state) => {
        state.editable = false
    })
}

const { SchemaField } = createSchemaField({
    components: {
        FormItem,
        Input,
        Switch,
        Select
    },
})
const schema: ISchema = {
    type: 'object',
    properties: {
{{~for key in requestTypeSchema.properties|object.keys
    if key=='extraProperties'
        continue
    end
    p=requestTypeSchema.properties[key]
    ~}}
        {{key}}:{
            type:'{{p.type}}',
            title:'{{p.description==null?key:p.description}}',
            {{~if p.maxLength!=null~}}
            maxLength:{{p.maxLength}},
            {{~end~}}
            {{~if p.minLength!=null~}}
            minLength:{{p.minLength}},
            {{~end~}}
            {{~if p.nullable==null~}}
            required:true,
            {{~end~}}
            {{~if (key |string.downcase| string.index_of 'phone') > -1 ~}}
            format: 'phone',
            {{~end~}}
            {{~if (key|string.downcase| string.index_of  'email') > -1 ~}}
            format: 'email',
            {{~end~}}
            {{~ # x-commponent ~}}
            {{~if p.type=='string'~}}
            'x-component':'{{(key|string.downcase|string.index_of `password`) > -1?'Password':'Input' }}',
            {{~end~}}
            {{~if p.type=='boolean'~}}
            'x-component':'Switch',
            {{~end~}}
            'x-decorator':'FormItem',
            'x-decorator-props':{
                labelWidth:100,
                {{~ if p.type=='boolean'~}}
                style: 'text-align:left'
                {{~end~}}
            }
        },
{{~end~}}
    },
}

// if (props.mode !== 'create') {
//     delete schema.properties!.password
// }

const onSubmit = async (value: any) => {

    const client = new {{tag}}ServiceProxy(undefined, axios);
    if (props.mode === 'create') {
        await client.create({{requestType}}.fromJS(value))
    } else {
        await client.update(props.data.id, Update{{tag}}Dto.fromJS(value))
    }

    ElMessage.success(t('common.submitSuccess'))
    show.value = false;
    emit('submitSuccess')
}
</script>
