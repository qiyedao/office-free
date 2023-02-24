import mammoth from 'mammoth';
import { useEffect, useState } from 'react';
import './docx.less';
interface IDocxViewer {
  url: string;
}
export default function DocxViewer({ url }: IDocxViewer) {
  const [docHtml, setDocHtml] = useState('');
  useEffect(() => {
    if (url) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function () {
        console.log(xhr.response);
        // renderAsync(xhr.response, document.getElementById('docx') as HTMLElement);
        mammoth
          .convertToHtml({ arrayBuffer: xhr.response })

          .then(function (result) {
            console.log(result);

            var html = result.value; // The generated HTML
            setDocHtml(html);
            var messages = result.messages; // Any messages, such as warnings during conversion
          })
          .catch(function (error) {
            console.error(error);
          });
      };
      xhr.send();
    }
  }, [url]);
  return (
    <div>
      <div
        className={'document-container'}
        style={{
          width: 100 + '%',
          height: '85%',
          overflow: 'auto',
        }}
        dangerouslySetInnerHTML={{ __html: docHtml }}
      ></div>
    </div>
  );
}
