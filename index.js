import fs from 'fs'
import to from './util.js'
import ora from 'ora';
import { fileURLToPath } from 'url';
import path,{ dirname } from 'path';
import chalk from 'chalk';
import puppeteer from 'puppeteer';
import {Configuration,OpenAIApi} from 'openai';

const configuration = new Configuration({
    apiKey: '', // defaults to process.env["OPENAI_API_KEY"]
  })

  const openai = new OpenAIApi(configuration)



//   2ZhCsrVH2kNdDkG

const option = {
    temperature: 0.8, // 温度控制生成文本的创造性
    max_tokens: 200,  // 设置最大生成标记数
    model: 'gpt-3.5-turbo',
}

// TODO token要钱 放弃
const getComment = async (prompt)=>{
    console.log(chalk.blue(prompt))
       // 发送聊天请求
    openai.createCompletion({  prompt, ...option })
        .then((response) => {
        // 处理API响应数据
        console.log('ChatGPT响应数据：', response.data.choices[0].message.content);
        })
        .catch((error) => {
        // 处理API请求出错
        console.error('API请求出错：', error?.response.data);
        });
}

// 接入chat gpt openapi

const spinner =  ora('正在加载...')

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let cookie = ''

const username = '';
const password = '';

// 加了滑块验证了 不好爬取
const getCookie = async () => {
    const browser = await puppeteer.launch({ headless: false }); // 在有头模式下运行以便查看登录过程
    const page = await browser.newPage();
    // 载入CSDN登录页面
    await page.goto('https://passport.csdn.net/login');
  
    const passwordLoginButton = await page.waitForXPath('//span[contains(text(), "密码登录")]');
    await passwordLoginButton.click();
  

  // 输入用户名和密码并登录
  const inputFields = await page.$$('.base-input-text');

  await inputFields[0].type( username);
  await inputFields[1].type( password);

   // 点击“阅读协议”复选框（假设它有一个特定的CSS选择器）
   await page.click('.icon-nocheck'); // 请将#agree-checkbox替换为实际的选择器


    await page.click('.base-button');
   // 等待10秒
   await page.waitForTimeout(10000); // 等待10秒钟

    
    // 等待登录完成，可以根据实际情况添加适当的等待条件
    // await page.waitForNavigation();
  


    // 获取当前页面的所有Cookie
    cookie = await page.cookies();
  
    console.log('CSDN的Cookie信息：', cookie);
    // await browser.close();
}



const comments = [
    "大佬的技术文章非常精炼、严谨，让我充分理解了一些概念和原理，并且在实际应用中取得了很好的效果。感谢大佬的分享和帮助，我会继续关注大佬的文章，积极学习，提升自己的技术能力。",
    "大佬的文章让我对这领域的技术问题有了更深入的了解，尤其是大佬提到的那些“坑点”，我相信能够在实际应用中避免或解决很多问题。谢谢大佬的分享，期待大佬的更多精彩文章，也欢迎大佬来我的主页指点指点，让我们共同学习、进步。",
    "博主写的非常好，文章干货满满，三联+关注！欢迎作者闲暇之余能回关我的博客进行指导，谢谢！",
    "大佬的文章让我对这领域的技术问题有了更深入的了解，尤其是大佬提到的那些“坑点”，我相信能够在实际应用中避免或解决很多问题。谢谢大佬的分享，期待大佬的更多精彩文章，让我们共同学习、进步。",
    "首先，感谢大佬能把自己的遇到的问题分享在这上面，因为你遇到这个问题大家也可能遇到这个问题，但是很多人不知道怎么解决，看到了你的解决办法，一下子就通了好多，这样就会带动大家一起，分享自己的经验，以后遇到如果自己做过的，但是忘记怎么解法的，回看一下自己做过的经验，也是很好的，感谢大佬这样的无私奉献，我感觉这样的内容会带动很多人学习，希望来给我的文章指点一二！",
    "优质好文，博主的文章细节很到位，兼顾实用性和可操作性，感谢博主的分享，文章思路清晰，图文并茂，详略得当，三连支持，期待博主持续输出好文!",
    "博主这篇文章写的条理清晰，结构严谨，内容干货满满",
    "优质好文，博主的文章细节很到位，兼顾实用性和可操作性，感谢博主的分享，文章思路清晰，图文并茂，详略得当，三连支持，期待博主持续输出好文",
    "我认为大佬的文章让我对这领域的技术问题有了更深入的了解，尤其是大佬提到的那些“坑点”，我相信能够在实际应用中避免或解决很多问题。谢谢大佬的分享，期待大佬的更多精彩文章，也欢迎大佬来我的主页指点指点，让我们共同学习、进步。",
    "大佬的文章让我对这领域的技术问题有了更深入的了解，尤其是大佬提到的那些“坑点”，我相信能够在实际应用中避免或解决很多问题。谢谢大佬的分享，期待大佬的更多精彩文章，也欢迎大佬来我的主页指点指点，让我们共同学习、进步",
    "博主这篇文章写的条理清晰，结构严谨，内容干货满满,大佬的文章让我对这领域的技术问题有了更深入的了解，尤其是大佬提到的那些“坑点。",
    "这是一个非常好的博客！我喜欢你的观点和见解。你讲得很清晰，让我对这个主题有了更深入的理解。同时，你用实例和案例来支持你的观点，这让文章更有说服力和可信度。我期待能继续阅读你的博客，希望你能继续分享更多有趣和有洞察力的内容。感谢你分享你的知识和经验！期待大佬的指点哦",
    "业务复杂性问题，内容讲解清晰到位，干货满满，优质好文，收藏了"
];

const getCommentByTitle =  (title)=>{

}


const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // 格式：YYYYMMDD

// 创建一个txt文件 记录评论成功的人
const fileName = `comment-${currentDate}.txt`;
const filePath = path.join(__dirname, fileName);

// 是否评论过了 今日评论过了就不再评论 因为CSDN有评论次数限制
const recordFilePath = `commentUser-${currentDate}.txt`

const isComment = (userId)=>{
    if (fs.existsSync(recordFilePath)) {
        const commentFiles = fs.readFileSync(recordFilePath, 'utf8').split('\n');
        return commentFiles.includes(userId);
    } else {
        // 给它创建一个
        fs.writeFile(recordFilePath,'', (writeErr) => {
            if (writeErr) {
                console.error('创建文件并写入内容时发生错误：', writeErr);
            } else {
                console.log(`文件 ${recordFilePath} 已成功创建并写入内容。`);
            }
        });
    }
    return false;
}

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}





const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}



let isStop = false // 是否停止程序



/**
 * TODO
 * 采取两种策略
 * 1.通过关注人列表首篇文章评论
 * 2.拿到你的评论列表进行筛选
 * @returns 
 */




const fetchListByFollow = async (username, fanId) => {
    console.log(chalk.blue('开始获取用户关注列表....'))
    // username=weixin_52898349
    const [err, body] = await to(fetch(`https://mp-action.csdn.net/interact/wrapper/pc/fans/v1/api/getFollowOffsetList?pageSize=20&username=${username}&fanId=${fanId}`, {
        "headers": {
            'authority': 'mp-action.csdn.net',
            'Accept-Encoding': 'gzip, deflate, br',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'zh-CN,zh-TW;q=0.9,zh;q=0.8,en-US;q=0.7,en;q=0.6',
            'cache-control': 'no-cache',
            'pragma': 'no-cache',
            'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': 'macOS',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            "Origin": "https://blog.csdn.net",
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
            "cookie":cookie,
            "Referer": `https://blog.csdn.net/${username}?type=blog`,
            'Remote-Address': '120.46.209.149:443',
        },
        "body": null,
        "method": "GET",
        "referrer": "https://blog.csdn.net/m0_57524265?type=blog",
        "referrerPolicy": "unsafe-url",
        "body": null,
        "mode": "cors",
        "credentials": "include"
    }));
    const res = await body.json()
    if (err || !res.data) {
        console.log(chalk.red('获取关注人列表错误'))
        console.log(err)
        return
    }

    // console.log(chalk.blue('res', res.data)

    if (res.code === 200) {
        const list = res.data.list
        const fanId = res.data.fanId // 通过列表id拿取下一列数据
        let i = 0;
        while (!isStop&&i < list.length&&i<20) {
            const userId =  list[i].blogUrl.split('https://blog.csdn.net/')[1]
            if(isComment(userId)){
                console.log(chalk.red(`已经评论过该博主了:${list[i].nickname} ${userId}`))
                // 跳过这次循环
                i++
                continue
            }
            // 找到关注列表作者的第一篇文章
            const article = await firstAticleIdByUser(list[i].blogUrl)
            const articleId = article?.articleId
            const articleTitle = article?.title
            console.log('aticleID',articleId)
            spinner.start(chalk.green('正在等待评论...'))
            await delay(30000); // 等待半分钟
            spinner.stop()
            if (articleId) {
                // 先评论后点赞
                await submitComment(list[i].blogUrl, articleId,articleTitle)
                spinner.start(chalk.green('正在等待点赞...'))
                await delay(30000); // 等待半分钟
                spinner.stop()
                if(!isStop){
                    await submitLike(list[i].blogUrl, articleId)
                }
                i++
            } else {
                // 直接跳过
                i++
            }
        }
        // 都走完所有的接口 再继续跑
        if (!isStop&&fanId) {
            fetchListByFollow(username, fanId)
        }
    }
}


const submitComment = async (blogUrl, acticleID,articleTitle) => {
    console.log(chalk.blue('开始评论....'))
    const userId = blogUrl.split('https://blog.csdn.net/')[1]
    const index = getRandomNumber(0, 10)
    const comment = encodeURIComponent(`《${articleTitle}》这篇文章非常不错！！！ ${comments[index]}`)
    const [err, body] = await to(fetch("https://blog.csdn.net/phoenix/web/v1/comment/submit", {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "zh-CN,zh-TW;q=0.9,zh;q=0.8,en-US;q=0.7,en;q=0.6",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "cookie":cookie,
            "Referer": `https://blog.csdn.net/${userId}/article/details/${acticleID}?spm=1001.2100.3001.7377&utm_medium=distribute.pc_feed_blog_category.none-task-blog-classify_tag-1-132039740-null-null.nonecase&depth_1-utm_source=distribute.pc_feed_blog_category.none-task-blog-classify_tag-1-132039740-null-null.nonecase`,
            "Referrer-Policy": "unsafe-url"
        },
        "body": `commentId=&content=${comment}&articleId=${acticleID}`,
        "method": "POST"
    }));
    const res = await body.json()
    if (err) {
        console.log(chalk.red('评论失败'))
        console.log(err)
        return
    }
    if (res.code === 200) {
        // TODO 这里要做一个通知功能 通知对方三连
        console.log(chalk.blue('评论成功'))
        fs.appendFileSync(recordFilePath,  userId+ '\n', 'utf8');
        // 检查文件是否存在
        if (fs.existsSync(filePath)) {
            // 文件已存在，追加内容到文件
            fs.appendFile(filePath, `${blogUrl}: ${decodeURIComponent(comment)}\n`, (appendErr) => {
                if (appendErr) {
                    console.error('追加文件内容时发生错误：', appendErr);
                } else {
                    console.log(`内容已成功追加到文件 ${fileName} 中。`);
                }
            });
        } else {
            // 文件不存在，创建新文件并写入内容
            fs.writeFile(filePath, `${blogUrl}: ${decodeURIComponent(comment)}\n`, (writeErr) => {
                if (writeErr) {
                    console.error('创建文件并写入内容时发生错误：', writeErr);
                } else {
                    console.log(`文件 ${fileName} 已成功创建并写入内容。`);
                }
            });
        }
    } else{
        console.log(chalk.red('评论失败'))
        console.log(res)
        if(res.code === 400){
            isStop = true
        }
    }
}


const firstAticleIdByUser = async (blogUrl) => {
    console.log(chalk.blue('开始获取文章id....'))
    const userId = blogUrl.split('https://blog.csdn.net/')[1]
    const [err, body] = await to(fetch(`https://blog.csdn.net/community/home-api/v1/get-business-list?page=1&size=20&businessType=blog&orderby=&noMore=false&year=&month=&username=${userId}`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh-TW;q=0.9,zh;q=0.8,en-US;q=0.7,en;q=0.6",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "cookie":cookie,
        },
        "referrer": `${blogUrl}?type=blog`,
        "referrerPolicy": "unsafe-url",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    })
    )
    const res = await body.json()
    if (err) {
        console.log(chalk.red('获取用户文章失败'))
        console.log(err)
        return
    }
    if (res.code === 200) {
        const list = res.data.list
        // 获取第一篇文章id
        return list?.[0]
    }
}



const submitLike = async (blogUrl,articleId,articleTitle) => {
    console.log(chalk.blue('开始点赞文章....'))
    const userId = blogUrl.split('https://blog.csdn.net/')[1]
    const [err, body] = await to(fetch("https://blog.csdn.net//phoenix/web/v1/article/like", {
        "headers": {
          "accept": "application/json, text/javascript, */*; q=0.01",
          "accept-language": "zh-CN,zh-TW;q=0.9,zh;q=0.8,en-US;q=0.7,en;q=0.6",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "pragma": "no-cache",
          "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "cookie": cookie,
          "Referer": `https://blog.csdn.net/${userId}/article/details/${articleId}?spm=1001.2014.3001.5502`,
          "Referrer-Policy": "unsafe-url"
        },
        "body": `articleId=${articleId}`,   
        "method": "POST"
      })      
    )
    const res = await body.json()
    if (err) {
        console.log(chalk.red('点赞用户文章失败'))
        console.log(err)
        return
    }
    if (res.code === 200) {
        console.log(chalk.green('点赞用户文章成功'))
    }
}




async function main  () {
    spinner.start(chalk.green('获取当前cookie'))
    // await getCookie();
    spinner.stop()
    await delay(3000)
    console.log(chalk.blue(`开启${currentDate}三连任务....`))
    await fetchListByFollow('weixin_52898349', '')
    console.log(chalk.blue('任务跑完，今天又是元气满满的一天....'))
}



main()
