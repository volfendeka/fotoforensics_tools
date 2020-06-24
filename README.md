## ELA.js
A JavaScript tool for image Error Level Analysis.

You can use it on images in the browser, either from an image or a file input element.

## Usage
Add a `script` tag in your HTML in the [appropriate position](http://stackoverflow.com/questions/436411/where-is-the-best-place-to-put-script-tags-in-html-markup) referencing source file
```html
<script src="path_to_file/ela-js.js"></script>
```

**JavaScript:**
```javascript
function getELA(quality, scale) {
    let imageToProcess = document.getElementById("imageToProcess");
    let elaImage = document.getElementById("elaImage");
    let parentContainer = document.getElementById("analyzer");

    ELA.processImg(parentContainer, imageToProcess, quality, scale, (resultDataURL) => {
        elaImage.src = resultDataURL;
    });
}
getELA();
```

**HTML:**
```html
<div id="analyzer">
    <img src="image.jpeg" id="imageToProcess" />
    <img id="elaImage" />
</div>
```

## Contributions
This is an [open source project](LICENSE.md). Please contribute by forking this repo and issuing a pull request.

Or improve the documentation. Please update this README when you do a pull request of proposed changes in base functionality.