import React, { useEffect, useState, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html as htmlLanguage } from "@codemirror/lang-html";
import { css as cssLanguage } from "@codemirror/lang-css";
import { javascript as jsLanguage } from "@codemirror/lang-javascript";
import { monokai } from "@uiw/codemirror-theme-monokai";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHtml5 } from "@fortawesome/free-brands-svg-icons";
import { faCss3Alt } from "@fortawesome/free-brands-svg-icons";
import { faJs } from "@fortawesome/free-brands-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Codepen({
  html: htmlAI,
  css: cssAI,
  js: jsAI,
  onCodeChange
}) {
  const codepenTheme = monokai;

  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [output, setOutput] = useState("");
  const [outputHeight, setOutputHeight] = useState("");

  const updateOutput = useCallback(() => {
    const iframe = document.querySelector(".output-frame");

    // Combine HTML, CSS, and JavaScript code
    const combinedOutput = `
        <html>
            <head>
                <style>${css}</style>
            </head>
            <body>
                ${html}
                <script>${js}</script>
            </body>
        </html>
    `;

    // Set the output content
    setOutput(combinedOutput);

    // Set an onLoad event handler for the iframe
    iframe.onload = () => {
      // Calculate and set the new height
      const contentHeight = iframe.contentWindow.document.body.scrollHeight;
      const extraHeight = 50;
      const iframeHeight = contentHeight + extraHeight;
      setOutputHeight(`${iframeHeight}px`);
    };

    // Notify the parent component about code changes
    const newCodeValue = `Current html: \n\
    ${html}\n\
    \n\
    Current CSS: \n\
    ${css}\n\
    \n\
    Current Javascript: \n\
    ${js}`;
    onCodeChange(newCodeValue);
  }, [html, css, js, onCodeChange]);

  useEffect(() => {
    updateOutput();
    return () => {
      const iframe = document.querySelector(".output-frame");
      iframe.onload = null; // Clear the onLoad handler on component unmount
    };
  }, [html, css, js, updateOutput]);

  useEffect(() => {
    setHtml(htmlAI);
  }, [htmlAI]);

  useEffect(() => {
    setCss(cssAI);
  }, [cssAI]);

  useEffect(() => {
    setJs(jsAI);
  }, [jsAI]);

  return (
    <>
      <div className="code-boxes">
        {/* html box*/}
        <div className="code-box html-box">
          <div className="box-header">
            <div className="box-title">
              <FontAwesomeIcon className="html-icon" icon={faHtml5} />
              <p>HTML</p>
            </div>
            {/* <div className="box-controls">
              <button onClick="">Undo</button>
              <button onClick="">Redo</button>
              <button onClick="">Copy</button>
              <button onClick="">Clear</button>
              <select name="theme" id="theme">
                <option value="dark">Dark theme</option>
                <option value="light">Light theme</option>
              </select>
            </div> */}
          </div>
          <div>
            <CodeMirror
              value={html}
              theme={codepenTheme}
              height="350px"
              extensions={[htmlLanguage()]}
              onChange={(value) => {
                setHtml(value);
              }}
            />
          </div>
        </div>
        {/* css box*/}
        <div className="code-box css-box">
          <div className="box-header">
            <div className="box-title">
              <FontAwesomeIcon className="css-icon" icon={faCss3Alt} />
              <p>CSS</p>
            </div>
            {/* <div className="box-controls">
              <button onClick="">Undo</button>
              <button onClick="">Redo</button>
              <button onClick="">Copy</button>
              <button onClick="">Clear</button>
              <select name="theme" id="theme">
                <option value="dark">Dark theme</option>
                <option value="light">Light theme</option>
              </select>
            </div> */}
          </div>
          <div>
            <CodeMirror
              value={css}
              theme={codepenTheme}
              height="350px"
              extensions={[cssLanguage()]}
              onChange={(value) => {
                setCss(value);
              }}
            />
          </div>
        </div>
        {/* javascript box*/}
        <div className="code-box js-box">
          <div className="box-header">
            <div className="box-title">
              <FontAwesomeIcon className="js-icon" icon={faJs} />
              <p>JS</p>
            </div>
            {/* <div className="box-controls">
              <button onClick="">Undo</button>
              <button onClick="">Redo</button>
              <button onClick="">Copy</button>
              <button onClick="">Clear</button>
              <select name="theme" id="theme">
                <option value="dark">Dark theme</option>
                <option value="light">Light theme</option>
              </select>
            </div> */}
          </div>
          <div>
            <CodeMirror
              value={js}
              theme={codepenTheme}
              height="350px"
              extensions={[jsLanguage({ jsx: false })]}
              onChange={(value) => {
                setJs(value);
              }}
            />
          </div>
        </div>
      </div>
      {/* preview box*/}
      <div className="preview">
        <div className="box-title preview-title">
          <FontAwesomeIcon className="preview-icon" icon={faMagnifyingGlass} />
          <p>PREVIEW</p>
        </div>
        <iframe
          className="output-frame"
          title="Result"
          srcDoc={output}
          style={{ height: outputHeight }}
        />
      </div>
    </>
  );
}