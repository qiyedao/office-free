import React, { useCallback, useEffect, useRef, useState } from 'react';
import { read, utils, WorkBook, writeFileXLSX } from 'xlsx';
import './sheet.less';
interface ISheetHTML {
  url: string;
}
export default function SheetHTML({ url }: ISheetHTML) {
  const [sheetNames, setSheetNames] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  /* the component state is an HTML string */
  const [__html, setHtml] = useState('');
  /* the ref is used in export */
  const tbl = useRef(null);
  const [data, setData] = useState({});
  const [wb, setWb] = useState(null);

  /* Fetch and update the state once */
  useEffect(() => {
    if (url) {
      (async () => {
        const f = await (await fetch(url)).arrayBuffer();
        const wbTemp = read(new Uint8Array(f), { type: 'array' });
        setWb(wbTemp); // parse the array buffer
        setSheetNames(wbTemp.SheetNames);
        getSheetData(wbTemp, activeIndex);
      })();
    }
  }, [url]);
  const getSheetData = (workBook: WorkBook, sheetIndex: number) => {
    const ws = workBook.Sheets[workBook.SheetNames[sheetIndex]]; // get the first worksheet
    const data = utils.sheet_to_html(ws); // generate HTML
    const subDivId = sheetIndex;

    setHtml((prev: any) => {
      return { ...prev, [subDivId]: data };
    });
  };
  /* get live table and export to XLSX */
  const exportFile = useCallback(() => {
    writeFileXLSX(wb, 'SheetHTML.xlsx');
  }, [wb]);

  return url ? (
    <div className="sheet">
      <div
        className="sheet-container"
        ref={tbl}
        dangerouslySetInnerHTML={{ __html: __html[activeIndex] }}
      />
      <div className="sheet-group">
        {sheetNames.map((item: any, index: number) => (
          <button
            onClick={() => {
              setActiveIndex(index);
              getSheetData(wb, index);
            }}
            className={`sheet-action ${
              activeIndex === index ? 'sheet-action-active' : ''
            }`}
            key={index}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  ) : null;
}
