// ==UserScript==
// @name         Missions Image Download
// @namespace    https://github.com/adinlead/IMID
// @version      0.1
// @description  IMID(Ingress Missions Image Download),用于下载Ingress任务站中的任务图片
// @author       adinlead
// @match        https://missions.ingress.com/
// @icon         https://missions.ingress.com/favicon.ico
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const download_class = "download-icon-image";
    function appendDownloadButton(){
        console.log("========== appendDownloadButton ==========");
        let elems = $("div.missions-list div.details");
        for (let elem of elems){
            elem = $(elem)
            let messionTypeElem = elem.find("div.mission-type");
            let imgSrc = elem.find(".mission-image").attr("src");
            let name = elem.find("span.name.ng-binding.mission-title-published").text().trim();
            if (imgSrc.indexOf("=") > 50){
                imgSrc = imgSrc.substring(0,imgSrc.indexOf("="))
            }
            console.log(imgSrc);
            if (messionTypeElem && imgSrc){
                let downloadBtn = document.createElement("a");
                downloadBtn.href = "javascript:void(0);";
                downloadBtn.innerText = "Download";
                downloadBtn.setAttribute("class", download_class);
                downloadBtn.setAttribute("data-url", imgSrc);
                downloadBtn.setAttribute("data-name", name);
                let downloadSpan = document.createElement("span");
                downloadSpan.style = "margin-right: 10px";
                downloadSpan.append(downloadBtn);
                messionTypeElem.prepend(downloadSpan);
            }
        }
        $("a."+download_class).click(function(){
            let self = $(this);
            let url = self.data("url");
            let name = self.data("name");
            // 用fetch发送请求
            fetch(url).then((res) => {
                res.blob().then((blob) => {
                    const blobUrl = window.URL.createObjectURL(blob);
                    // 这里的文件名根据实际情况从响应头或者url里获取
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = name;;
                    a.click();
                    window.URL.revokeObjectURL(blobUrl);
                });
            });
        });
    }
    function checkElemLoad(){
        let elems = $("div.missions-list div.details");
        console.log(elems);
        if (elems.length == 0){
            setTimeout(checkElemLoad,1000);
        } else {
            appendDownloadButton()
        }
    }
    checkElemLoad();
})();
