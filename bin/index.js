#! /usr/bin/env node
import { program } from 'commander'
import figlet from 'figlet'
import createTranslate from '../dist/index.js'
import chalk from 'chalk'
import packageJson from '../package.json' assert {type: 'json'}

// create命令
program
  .version(packageJson.version)
  .command("start")
  .description("start to translate")
  .option("-f, --force", "overwrite target directory if it exist")
  .action((name, options) => {
    createTranslate(name, options);
  });

// --help命令
program
  .on('--help', () => {
    // 使用 figlet 绘制 Logo
    console.log(
      '\r\n' +
        figlet.textSync('hug-trans', {
          font: '3D-ASCII',
          horizontalLayout: 'default',
          verticalLayout: 'default',
          width: 80,
          whitespaceBreak: true
        })
    )
    // 新增说明信息
    console.log(`\r\nRun ${chalk.cyan('hug-cli <command> --help')} for detailed usage of given command\r\n`)
  })

// 解析用户执行命令传入参数
program.parse(process.argv)
