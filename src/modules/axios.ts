import axios from 'axios'
import { App } from 'vue'
import { ElMessageBox } from 'element-plus/es'

export const install: any = (app: App<Element>) => {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE
  axios.defaults.headers.post['Content-Type'] = 'application/json'

  // Add a request interceptor
  axios.interceptors.request.use(
    function (config) {
      // set language header
      const langStore = useLanguageStore()
      config.headers['Accept-Language'] = langStore.curLang

      // const { getToken } = useTokenService()
      // const token = getToken()

      // use oidc instead
      const { state } = useOidcStore()
      const token = state.value.token
      console.log('oidc token:', token)
      if (token !== null) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    function (error) {
      // Do something with request error
      debugger
      console.log(error)
      return Promise.reject(error)
    }
  )

  // Add a response interceptor
  axios.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      console.log(response)
      return response
    },
    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error

      const httpStatus = error.response.status
      if (httpStatus === 400 || httpStatus === 401 || httpStatus === 403) {
        const res = error.response.data
        // TODO: 优先处理验证400
        ElMessageBox.alert(
          res.error?.details ??
          res.error?.message ??
          res.error?.code ??
          'Request Error',
          res.error?.message,
          {
            confirmButtonText: 'OK',
            type: 'warning'
          }
        )
      }

      // TODO: 处理500 502
      if (httpStatus === 500 || httpStatus === 502) {
        const res = error.response.data
        if (res?.error && import.meta.env.DEV) {
          ElMessageBox.alert(
            res.error?.details ??
            res.error?.message ??
            res.error?.code ??
            'Request Error',
            res.error?.message,
            {
              confirmButtonText: 'OK',
              type: 'error'
            }
          )
        } else {
          ElMessageBox.alert('Server Unavailable', 'Server Error', {
            confirmButtonText: 'OK',
            type: 'error'
          })
        }
      }

      return Promise.reject(error)
    }
  )

  console.log('axios loaded!')
}

// TODO: token过期 或 响应401/403/500
