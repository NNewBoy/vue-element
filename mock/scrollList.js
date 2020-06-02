const res = { 'success': true, 'data': { 'items': [], 'total': 50 }}
let items = []
const item = [{ 'code': 'doorsd_011', 'comment': '\u7eb5\u6a2a\u6761\u7eb9(D06\u5957-\u82cf\u683c\u5170\u97f5)iii', 'lock': 1, 'update_time': '2020-03-25 10:32:46' }, { 'code': 'doorsd_cbk021', 'comment': 'tttsdf', 'lock': 0, 'update_time': '2020-03-25 10:33:01' }, { 'code': 'doorsd_cbk023', 'comment': '', 'lock': 0, 'update_time': '2020-03-27 20:20:49' }, { 'code': 'doorsd_cbk024', 'comment': '', 'lock': 0, 'update_time': '2020-03-10 15:29:09' }, { 'code': 'doorsd_cbk025', 'comment': '', 'lock': 0, 'update_time': '2020-03-10 15:29:09' }, { 'code': 'doorsd_cbk115', 'comment': '\u5c01\u8fb9\u62c9\u624b01', 'lock': 0, 'update_time': '2020-03-10 15:29:10' }, { 'code': 'doorsd_cbk117', 'comment': '\u5c01\u8fb9\u62c9\u624b02', 'lock': 0, 'update_time': '2020-03-10 15:29:10' }, { 'code': 'doorsd_cbk302', 'comment': '\u5c01\u8fb9\u62c9\u624b03', 'lock': 0, 'update_time': '2020-03-10 15:29:10' }, { 'code': 'doorsd_cbk451', 'comment': 'G\u578b\u62c9\u624b-\u5305\u8fb9', 'lock': 0, 'update_time': '2020-03-10 15:29:10' }, { 'code': 'doorsd_cbk452', 'comment': '', 'lock': 0, 'update_time': '2020-03-10 15:29:12' }, { 'code': 'doorsd_cbk453', 'comment': '\u5bbd\u8fb9\u6846-\u62c9\u624b\u53ef\u8c03', 'lock': 0, 'update_time': '2020-03-10 15:29:12' }, { 'code': 'doorsd_cbk501', 'comment': 'J\u578b\u901a\u4f53\u62c9\u624b-\u6a2a\u5411', 'lock': 0, 'update_time': '2020-03-10 15:29:13' }, { 'code': 'doorsd_cbk502', 'comment': 'J\u578b\u53ef\u8c03\u62c9\u624b-\u7ad6\u5411', 'lock': 0, 'update_time': '2020-03-10 15:29:13' }, { 'code': 'doorsd_cxs001', 'comment': '', 'lock': 0, 'update_time': '2020-03-10 15:29:13' }, { 'code': 'doorsd_cxs002', 'comment': '', 'lock': 0, 'update_time': '2020-03-10 15:29:13' }, { 'code': 'doorsd_mkj-kf01', 'comment': 'K1', 'lock': 0, 'update_time': '2020-03-10 15:30:42' }, { 'code': 'doorsd_mkj-kf02', 'comment': 'K2', 'lock': 0, 'update_time': '2020-03-10 15:30:44' }, { 'code': 'doorsd_mkj-kf03', 'comment': '\u8d9f\u95e81', 'lock': 0, 'update_time': '2020-03-10 15:30:45' }, { 'code': 'doorsd_mkj-kf04', 'comment': '\u8d9f\u95e82', 'lock': 0, 'update_time': '2020-03-10 15:30:45' }, { 'code': 'doorsd_mkj-kf05', 'comment': 'GA101AAA', 'lock': 0, 'update_time': '2020-03-10 15:30:45' }, { 'code': 'doorsd_mkj-kf06', 'comment': 'YA01-\u8170\u7ebf', 'lock': 0, 'update_time': '2020-03-10 15:30:45' }, { 'code': 'doorsd_mkj-kf07', 'comment': 'LA102-\u767e\u53f6\u82af', 'lock': 0, 'update_time': '2020-03-10 15:30:45' }, { 'code': 'doorsd_mkj-kf08', 'comment': 'LA103AAA', 'lock': 0, 'update_time': '2020-03-10 15:30:45' }, { 'code': 'doorsd_mkj001', 'comment': 'HND309', 'lock': 0, 'update_time': '2020-03-10 15:29:13' }, { 'code': 'doorsd_mkj002', 'comment': 'HND310-\u672a\u5b8c\u6210', 'lock': 0, 'update_time': '2020-03-10 15:29:13' }, { 'code': 'doorsd_mkj003', 'comment': '\u5438\u585101', 'lock': 0, 'update_time': '2020-03-10 15:29:13' }, { 'code': 'doorsd_mkj004', 'comment': '\u5438\u585102\u767e\u53f6', 'lock': 0, 'update_time': '2020-03-10 15:29:14' }, { 'code': 'doorsd_mkj005', 'comment': '\u5438\u585103\u5706\u5f27', 'lock': 0, 'update_time': '2020-03-10 15:29:16' }, { 'code': 'doorsd_mkj006', 'comment': '\u5438\u585104\u73bb\u7483\u95e8\u7a7a\u683c', 'lock': 0, 'update_time': '2020-03-10 15:29:16' }, { 'code': 'doorsd_mkj007', 'comment': '\u5438\u585105\u73bb\u7483\u95e84\u683c', 'lock': 0, 'update_time': '2020-03-10 15:29:16' }, { 'code': 'doorsd_mkj008', 'comment': '\u5438\u585106\u73bb\u7483\u95e8\u516d\u683c', 'lock': 0, 'update_time': '2020-03-10 15:29:16' }, { 'code': 'doorsd_mkj009', 'comment': '\u5438\u585107\u5706\u5f27\u73bb\u7483\u7a7a\u683c', 'lock': 0, 'update_time': '2020-03-10 15:29:16' }, { 'code': 'doorsd_mkj010', 'comment': '\u5438\u585108\u5706\u5f27\u73bb\u7483\u56db\u683c', 'lock': 0, 'update_time': '2020-03-10 15:29:17' }, { 'code': 'doorsd_mkj011', 'comment': '\u5438\u585109\u5706\u5f27\u73bb\u7483\u516d\u683c', 'lock': 0, 'update_time': '2020-03-10 15:29:17' }, { 'code': 'doorsd_mkj012', 'comment': '\u5438\u5851\u62bd\u976201', 'lock': 0, 'update_time': '2020-03-10 15:29:17' }, { 'code': 'doorsd_mkj013', 'comment': '\u5438\u5851\u62bd\u976202\u767e\u53f6', 'lock': 0, 'update_time': '2020-03-10 15:29:17' }, { 'code': 'doorsd_mkj014', 'comment': '\u5438\u5851\u62bd\u976203', 'lock': 0, 'update_time': '2020-03-10 15:29:17' }, { 'code': 'doorsd_mkj015', 'comment': '\u5438\u5851\u62bd\u976204\u767e\u53f6', 'lock': 0, 'update_time': '2020-03-10 15:29:19' }, { 'code': 'doorsd_mkj016', 'comment': '\u5438\u5851\u62bd\u976205\u63cf\u8fb9', 'lock': 0, 'update_time': '2020-03-10 15:29:19' }, { 'code': 'doorsd_mkj017', 'comment': '60H-5.5-18', 'lock': 0, 'update_time': '2020-03-10 15:29:19' }, { 'code': 'doorsd_mkj018', 'comment': '70165-5.5-18', 'lock': 0, 'update_time': '2020-03-10 15:29:20' }, { 'code': 'doorsd_mkj019', 'comment': '60047-5.5-18', 'lock': 0, 'update_time': '2020-03-10 15:29:20' }, { 'code': 'doorsd_mkj020', 'comment': '\u62fc\u684601', 'lock': 0, 'update_time': '2020-03-10 15:29:20' }, { 'code': 'doorsd_mkj021', 'comment': '\u62fc\u684602\u900f\u6c14\u767e\u53f6', 'lock': 0, 'update_time': '2020-03-10 15:29:20' }, { 'code': 'doorsd_mkj022', 'comment': '\u62fc\u684603\u7f51\u683c', 'lock': 0, 'update_time': '2020-03-10 15:29:20' }, { 'code': 'doorsd_mkj023', 'comment': '\u62fc\u684604\u73bb\u7483', 'lock': 0, 'update_time': '2020-03-10 15:29:20' }, { 'code': 'doorsd_mkj024', 'comment': '\u62fc\u684605\u95e8\u82af\u677fH=9.2', 'lock': 0, 'update_time': '2020-03-10 15:29:20' }, { 'code': 'doorsd_mkj025', 'comment': '\u62fc\u684606\u95e8\u82af\u677fH=5', 'lock': 0, 'update_time': '2020-03-10 15:29:22' }, { 'code': 'doorsd_mkj026', 'comment': '\u62fc\u684607\u7f51\u683c', 'lock': 0, 'update_time': '2020-03-10 15:29:22' }, { 'code': 'doorsd_mkj027', 'comment': '\u62fc\u684608\u7ecf\u5178\u767e\u53f6', 'lock': 0, 'update_time': '2020-03-10 15:29:23' }]
items = [...item, ...item, ...item, ...item]
export default [
  {
    url: '/pdoor/list',
    type: 'get',
    response: config => {
      const { page, per_page, code } = config.query
      if (code !== undefined && code !== '') {
        const arr = []
        const resArr = []
        for (let a = 0; a < items.length; a++) {
          if (items[a].code.indexOf(code) !== -1) { arr.push(items[a]) }
        }
        for (let a = per_page * (page - 1); a < per_page * page; a++) {
          if (a >= arr.length) {
            break
          }
          resArr.push(arr[a])
        }
        res.data.total = arr.length
        res.data.items = resArr
      } else {
        const arr = []
        res.data.total = items.length
        for (let a = per_page * (page - 1); a < per_page * page; a++) {
          if (a >= res.data.total) {
            break
          }
          arr.push(items[a])
        }
        res.data.items = arr
      }
      return {
        code: 20000,
        data: res.data
      }
    }
  }
]
