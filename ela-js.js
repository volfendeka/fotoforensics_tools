(function() {

    let root = this;

    let ELA = function(obj) {
        if (obj instanceof ELA) return obj;
        if (!(this instanceof ELA)) return new ELA(obj);
    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = ELA;
        }
        exports.ELA = ELA;
    } else {
        root.ELA = ELA;
    }
  
    function createCanvas(workingContainer, height, width){
        let canvas = document.createElement("canvas");
        canvas.height = height;
        canvas.width = width;
        workingContainer.appendChild(canvas);
        return canvas;
    }

    function handleBinaryFile(binFile) {

        let height = ELA.originalImage.naturalHeight,
            width = ELA.originalImage.naturalWidth,
            sourceCanvas = ELA.sourceCanvas,
            compressedCanvas = ELA.compressedCanvas,
            sourceCtx = sourceCanvas.getContext('2d'),
            compressedCtx = compressedCanvas.getContext('2d'),
            quality = ELA.quality * 0.01,
            scale = ELA.scale;

        createImageBitmap(binFile)
            .then((bitMap) => {
                sourceCtx.drawImage(bitMap, 0, 0);
                let sourceData = sourceCtx.getImageData(0, 0, width, height);
                let tmpImg = document.createElement("img");
                tmpImg.setAttribute("src", sourceCanvas.toDataURL('image/jpeg', quality));
                tmpImg.addEventListener("load",(event) => {
                    compressedCtx.drawImage(event.target, 0, 0);
                    let compressedData = compressedCtx.getImageData(0, 0, width, height),
                        data0 = sourceData.data,
                        data1 = compressedData.data;

                    for(let i = 0, l = data0.length; i < l; i+=4) {
                        for(let j = 0; j < 3; j++) {
                            let error = Math.abs(data0[i+j]-data1[i+j]);
                            data0[i+j] = error*scale;
                        }
                    }
                    compressedCtx.putImageData(sourceData, 0, 0);
                    ELA.callback(ELA.compressedCanvas.toDataURL("image/jpeg", 1));
                });
            })

    }

    ELA.getImageData = function (img) {

        if (img.src) {
            if (   /^data\:/i.test(img.src) || /^blob\:/i.test(img.src)) {
                console.log("process data src");
                handleBinaryFile(img);

            } else {

                let http = new XMLHttpRequest();
                http.onload = function() {
                    if (this.status == 200 || this.status === 0) {
                        console.log("XmlHttp request");
                        handleBinaryFile(http.response);
                    } else {
                        throw "Could not load image";
                    }
                    http = null;
                };
                http.open("GET", img.src, true);
                http.setRequestHeader("Cache-Control", "no-cache");
                http.onreadystatechange = function () {
                    
                }; 
                http.responseType = "blob";
                http.send(null);

            }
        } else if (self.FileReader && (img instanceof self.Blob || img instanceof self.File)) {

            let fileReader = new FileReader();
            fileReader.onload = function(e) {
                handleBinaryFile(e.target.result);
            };

            fileReader.readAsArrayBuffer(img);

        }
    };

    ELA.processImg = function(parentContainer, img, quality, scale, callback) {
        this.init(parentContainer, img, quality, scale, callback);

        if (((self.Image && img instanceof self.Image)
            || (self.HTMLImageElement && img instanceof self.HTMLImageElement))
            && !img.complete)
            return false;

        try{
            this.getImageData(img);
        }catch(e){
            console.log(e);
            if (callback) {
                callback.call(img);
            }
        }
        return true;
    };


    if (typeof define === 'function' && define.amd) {
        define('ela-js', [], function() {
            return ELA;
        });
    }

    ELA.init = function (parentContainer, image, quality, scale, callback) {
        this.destroy();
        this.originalImage = image;
        this.quality = !(typeof quality == "undefined" || quality == null) ? quality : 75;
        this.scale = !(typeof scale == "undefined" || scale == null) ? scale : 10;
        this.callback = callback;
        this.parentContainer = parentContainer;
        this.workingContainer = document.createElement("div");
        this.workingContainer.style.display = "none";
        this.parentContainer.appendChild(this.workingContainer);
        this.sourceCanvas = createCanvas(this.workingContainer, image.naturalHeight, image.naturalWidth);
        this.compressedCanvas = createCanvas(this.workingContainer, image.naturalHeight, image.naturalWidth);
    };

    ELA.destroy = function () {
        if(this.originalImage !== undefined){
            this.originalImage = null;
            this.callback = null;
            this.workingContainer.parentNode.removeChild(this.workingContainer);
        }
    }

}.call(this));