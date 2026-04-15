import React from 'react'
import { Code, Terminal, BookOpen, Copy, CheckCircle } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const ApiDoc: React.FC = () => {
  const [copied, setCopied] = React.useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const codeExamples = {
    python: `import requests
import base64

def solve_captcha(image_path, captcha_type):
    # 读取图片并转为base64
    with open(image_path, 'rb') as f:
        image_data = base64.b64encode(f.read()).decode('utf-8')
    
    # 调用验证码处理API
    response = requests.post('https://api.captcha-solver.com/solve', json={
        'image': image_data,
        'type': captcha_type
    })
    
    return response.json()

# 使用示例
result = solve_captcha('captcha.jpg', 'image')
print("处理结果: " + result['result'])
print("处理时间: " + str(result['time']) + "毫秒")`,

    javascript: `const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function solveCaptcha(imagePath, captchaType) {
  // 读取图片并转为base64
  const imageBuffer = fs.readFileSync(imagePath);
  const imageData = imageBuffer.toString('base64');
  
  // 调用验证码处理API
  const response = await axios.post('https://api.captcha-solver.com/solve', {
    image: imageData,
    type: captchaType
  });
  
  return response.data;
}

// 使用示例
solveCaptcha('captcha.jpg', 'image')
  .then(result => {
    console.log('处理结果: ' + result.result);
    console.log('处理时间: ' + result.time + '毫秒');
  })
  .catch(error => {
    console.error('处理失败:', error);
  });`,

    java: `import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Base64;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class CaptchaSolver {
    public static void main(String[] args) throws IOException {
        String imagePath = "captcha.jpg";
        String captchaType = "image";
        
        // 读取图片并转为base64
        File file = new File(imagePath);
        FileInputStream fis = new FileInputStream(file);
        byte[] imageBytes = new byte[(int) file.length()];
        fis.read(imageBytes);
        fis.close();
        String imageData = Base64.getEncoder().encodeToString(imageBytes);
        
        // 构建请求体
        String json = "{\"image\": \"" + imageData + "\", \"type\": \"" + captchaType + "\"}";
        MediaType JSON = MediaType.parse("application/json;");
        RequestBody body = RequestBody.create(json, JSON);
        
        // 发送请求
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url("https://api.captcha-solver.com/solve")
                .post(body)
                .build();
        
        Response response = client.newCall(request).execute();
        System.out.println(response.body().string());
    }
}`,

    csharp: `using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

class Program {
    static async Task Main(string[] args) {
        string imagePath = "captcha.jpg";
        string captchaType = "image";
        
        // 读取图片并转为base64
        byte[] imageBytes = File.ReadAllBytes(imagePath);
        string imageData = Convert.ToBase64String(imageBytes);
        
        // 构建请求体
        var data = new {
            image = imageData,
            type = captchaType
        };
        string json = JsonConvert.SerializeObject(data);
        
        // 发送请求
        using (var client = new HttpClient()) {
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await client.PostAsync("https://api.captcha-solver.com/solve", content);
            var responseString = await response.Content.ReadAsStringAsync();
            Console.WriteLine(responseString);
        }
    }
}`
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">API文档</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          了解如何调用验证码自动处理技能的API接口
        </p>
      </div>

      <div className="card mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <BookOpen className="h-6 w-6 mr-2 text-primary" />
          技能调用说明
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-3">简介</h3>
            <p className="text-gray-600">
              验证码自动处理技能提供了一个简单的API接口，可以处理各种类型的验证码。
              您可以通过HTTP POST请求将验证码图片发送到API端点，然后获取处理结果。
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-3">支持的验证码类型</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>image: 传统图形验证码</li>
              <li>slider: 滑动验证码</li>
              <li>click: 点选式验证码</li>
              <li>behavior: 行为验证码</li>
              <li>text: 图文识别验证码</li>
              <li>audio: 语音验证码</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-3">请求参数</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">参数名</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">类型</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">必填</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">描述</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">image</td>
                  <td className="border border-gray-300 px-4 py-2">string</td>
                  <td className="border border-gray-300 px-4 py-2">是</td>
                  <td className="border border-gray-300 px-4 py-2">Base64编码的验证码图片</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">type</td>
                  <td className="border border-gray-300 px-4 py-2">string</td>
                  <td className="border border-gray-300 px-4 py-2">是</td>
                  <td className="border border-gray-300 px-4 py-2">验证码类型</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">options</td>
                  <td className="border border-gray-300 px-4 py-2">object</td>
                  <td className="border border-gray-300 px-4 py-2">否</td>
                  <td className="border border-gray-300 px-4 py-2">额外选项</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-3">返回值</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">字段名</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">类型</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">描述</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">success</td>
                  <td className="border border-gray-300 px-4 py-2">boolean</td>
                  <td className="border border-gray-300 px-4 py-2">处理是否成功</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">result</td>
                  <td className="border border-gray-300 px-4 py-2">string</td>
                  <td className="border border-gray-300 px-4 py-2">处理结果</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">time</td>
                  <td className="border border-gray-300 px-4 py-2">number</td>
                  <td className="border border-gray-300 px-4 py-2">处理时间（毫秒）</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">error</td>
                  <td className="border border-gray-300 px-4 py-2">string</td>
                  <td className="border border-gray-300 px-4 py-2">错误信息（如果有）</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Code className="h-6 w-6 mr-2 text-primary" />
          代码示例
        </h2>
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-medium">Python</h3>
              <button 
                onClick={() => copyToClipboard(codeExamples.python, 'python')}
                className="text-gray-500 hover:text-primary transition-colors"
              >
                {copied === 'python' ? (
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    已复制
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Copy className="h-4 w-4 mr-1" />
                    复制
                  </span>
                )}
              </button>
            </div>
            <SyntaxHighlighter language="python" style={vscDarkPlus}>
              {codeExamples.python}
            </SyntaxHighlighter>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-medium">JavaScript</h3>
              <button 
                onClick={() => copyToClipboard(codeExamples.javascript, 'javascript')}
                className="text-gray-500 hover:text-primary transition-colors"
              >
                {copied === 'javascript' ? (
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    已复制
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Copy className="h-4 w-4 mr-1" />
                    复制
                  </span>
                )}
              </button>
            </div>
            <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
              {codeExamples.javascript}
            </SyntaxHighlighter>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-medium">Java</h3>
              <button 
                onClick={() => copyToClipboard(codeExamples.java, 'java')}
                className="text-gray-500 hover:text-primary transition-colors"
              >
                {copied === 'java' ? (
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    已复制
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Copy className="h-4 w-4 mr-1" />
                    复制
                  </span>
                )}
              </button>
            </div>
            <SyntaxHighlighter language="java" style={vscDarkPlus}>
              {codeExamples.java}
            </SyntaxHighlighter>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-medium">C#</h3>
              <button 
                onClick={() => copyToClipboard(codeExamples.csharp, 'csharp')}
                className="text-gray-500 hover:text-primary transition-colors"
              >
                {copied === 'csharp' ? (
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    已复制
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Copy className="h-4 w-4 mr-1" />
                    复制
                  </span>
                )}
              </button>
            </div>
            <SyntaxHighlighter language="csharp" style={vscDarkPlus}>
              {codeExamples.csharp}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Terminal className="h-6 w-6 mr-2 text-primary" />
          命令行工具
        </h2>
        <p className="text-gray-600 mb-4">
          除了API接口，我们还提供了一个命令行工具，方便您在终端中使用验证码处理功能。
        </p>
        <div className="code-block">
          <pre>{`# 安装命令行工具
npm install -g captcha-solver-cli

# 使用示例
captcha-solver solve --image captcha.jpg --type image

# 输出示例
# {"success": true, "result": "1234", "time": 1250}`}</pre>
        </div>
      </div>
    </div>
  )
}

export default ApiDoc