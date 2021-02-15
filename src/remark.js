import Api from './remark/Api'
import polyfills from './polyfills'
import styler from './remark/components/styler/styler'

window.remark = new Api()

polyfills.apply()

styler.styleDocument()
