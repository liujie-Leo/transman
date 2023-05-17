import translate from './dist/index.js'

const data = {
  path: 'root',
  isDirectory: true,
  children: [
    {
      path: 'common.ts',
      isDirectory: false,
      children: [],
      data: {
        'common.switchLanguage': '切换语言',
        'common.search': '搜索',
        'common.reset': '重置'
      }
    },
    {
      path: 'supplier',
      isDirectory: true,
      children: [
        {
          path: 'inquirePriceList.ts',
          isDirectory: false,
          children: [],
          data: {
            'supplier.inquirePriceList.menuTitle': '报价列表',
            'supplier.inquirePriceList.inquireCode': '询价单号',
            'supplier.inquirePriceList.buyProject': '采购项目'
          }
        }
      ],
      data: ''
    }
  ]
}

const mergeData = {
  path: 'root',
  isDirectory: true,
  children: [
    {
      path: 'common.ts',
      isDirectory: false,
      children: [],
      data: {
        'common.switchLanguage': '切换语言',
        'common.search': '搜索',
        'common.reset': '重置'
      },
      translatedData: {
        'common.switchLanguage': 'switch language',
        'common.search': 'search',
        'common.reset': 'Reset'
      }
    },
    {
      path: 'supplier',
      isDirectory: true,
      children: [
        {
          path: 'inquirePriceList.ts',
          isDirectory: false,
          children: [],
          data: {
            'supplier.inquirePriceList.menuTitle': '报价列表',
            'supplier.inquirePriceList.inquireCode': '询价单号',
            'supplier.inquirePriceList.buyProject': '采购项目'
          },
          translatedData: {
            'supplier.inquirePriceList.menuTitle': 'Quotation List',
            'supplier.inquirePriceList.inquireCode': 'Inquiry number',
            'supplier.inquirePriceList.buyProject': 'Procurement project'
          }
        }
      ],
      data: ''
    }
  ]
}

translate({
  source: './src/language/zh',
  outDir: './src/language',
  languageFrom: 'zh',
  languageTo: 'en',
  data
})
