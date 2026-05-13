/**
 * 批量更新技能 i18n 俄语国际化
 * 接口：POST http://localhost:8080/obexxadmin/skillinfo/updateI18n
 * 请求体：{ id, i18n }
 * 使用 Node.js 内置 http 模块，无需安装任何依赖
 */

const http = require('http');

const HOST = 'localhost';
const PORT = 8080;
//此为国际化接口
const PATH = '/obexxadmin/appearance/group/updateI18n';

const skillI18nList = [
   {
      id:"1",
      i18n: JSON.stringify({
    "en_GB": {
        "name": "Energetic Girl",
        "summary": "Full of passion, always ready to help you~"
      },
      "ru_RU": {
        "name": "Энергичная девушка",
        "summary": "Полна энтузиазма, всегда готова помочь тебе~"
      },
      "de_DE": {
        "name": "Energetisches Mädchen",
        "summary": "Voller Leidenschaft, immer bereit, dir im Leben zu helfen~"
      },
      "es_ES": {
        "name": "Chica Energetica",
        "summary": "Llena de pasión, siempre dispuesta a ayudarte en tu vida~"
      },
      "ja_JP": {
        "name": "元気な少女",
        "summary": "情熱に満ちており、あなたの生活を常にサポートします~"
      },
      "zh_TW": {
        "name": "元氣少女",
        "summary": "充滿熱情，時刻為你的生活提供幫助~"
      },
      "zh_HK": {
        "name": "元氣少女",
        "summary": "充滿熱情，時刻為你的生活提供幫助~"
      }
        })
    },
    {
        id: "2", 
        i18n: JSON.stringify({
       "en_GB": {
        "name": "Sci-fi Girl",
        "summary": "Sci-fi fashion, taking you to experience the future world~"
      },
      "ru_RU": {
        "name": "Девушка из будущего",
        "summary": "Научно-фантастический стиль, погружающий тебя в мир будущего~"
      },
      "de_DE": {
        "name": "Sci-Fi Mädchen",
        "summary": "Sci-Fi Mode, die dich in die Zukunft entführt~"
      },
      "es_ES": {
        "name": "Chica de Ciencia Ficción",
        "summary": "Moda de ciencia ficción, llevándote a experimentar el mundo del futuro~"
      },
      "ja_JP": {
        "name": "SF少女",
        "summary": "SFファッションで、未来の世界を体験させます~"
      },
      "zh_TW": {
        "name": "科幻女生",
        "summary": "科幻時尚，帶你體驗未來世界~"
      },
      "zh_HK": {
        "name": "科幻女生",
        "summary": "科幻時尚，帶你體驗未來世界~"
      }
    })
  }, 
  {
     id:"3",              
      i18n: JSON.stringify({
        "en_GB": {
        "name": "Smart Rabbit",
        "summary": "Under the cute appearance lies a brain full of wisdom~"
      },
      "ru_RU": {
        "name": "Умный кролик",
        "summary": "За милой внешностью скрывается мудрый разум~"
      },
      "de_DE": {
        "name": "Schlauer Hase",
        "summary": "Hinter dem niedlichen Äußeren verbirgt sich ein kluger Verstand~"
      },
      "es_ES": {
        "name": "Conejo Inteligente",
        "summary": "Bajo una apariencia adorable se esconde una mente inteligente~"
      },
      "ja_JP": {
        "name": "スマートバニー",
        "summary": "可愛らしい外見の下には、知恵に満ちた頭脳がある~"
      },
      "zh_TW": {
        "name": "智慧兔兔",
        "summary": "可愛的外表下是智慧的大腦~"
      },
      "zh_HK": {
        "name": "智慧兔兔",
        "summary": "可愛的外表下是智慧的大腦~"
      }
    })
  },  
];

// 延迟函数，避免请求过快
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function updateSkillI18n(skill) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ ...skill });
    const options = {
      hostname: HOST,
      port: PORT,
      path: PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'cookie':'SESSION=MWIzYzI2ZTUtY2JlMS00YzE0LWE1MDUtNjU3ZjQ2YTcxOGQ5; Authorization=Bearer%201778644082419'
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('响应解析失败: ' + data)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function batchUpdate() {
  console.log(`开始批量更新，共 ${skillI18nList.length} 条记录...\n`);

  const results = { success: [], failed: [] };

  for (const skill of skillI18nList) {
    try {
      const res = await updateSkillI18n(skill);
      if (res.success || res.code === 200) {
        console.log(`✅ 成功 id=${skill.id}`);
        results.success.push(skill.id);
      } else {
        console.error(`❌ 失败 id=${skill.id}，原因：${res.message}`);
        results.failed.push({ id: skill.id, reason: res.message });
      }
    } catch (err) {
      console.error(`❌ 异常 id=${skill.id}，错误：${err.message}`);
      results.failed.push({ id: skill.id, reason: err.message });
    }
    await sleep(100); // 每次请求间隔 100ms
  }

  console.log("\n========== 更新完成 ==========");
  console.log(`✅ 成功：${results.success.length} 条`);
  console.log(`❌ 失败：${results.failed.length} 条`);
  if (results.failed.length > 0) {
    console.log("失败详情：", results.failed);
  }
}

batchUpdate();
