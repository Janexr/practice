"use strict";
const iconImageCache = {};
class IconImage {
    image_;
    canvas_;
    color_ = "";
    src_ = "";
    constructor(src, color) {
        this.color_ = color;
        this.src_ = src;
    }
    async getImage() {
        if (!this.image_) {
            await this.load_();
        }
        this.replaceColor_();
        return this.canvas_
            ? this.canvas_.toDataURL()
            : this.image_;
    }
    /**
     * @return {string|undefined} Image src.
     */
    getSrc() {
        return this.src_;
    }
    /**
     * Load not yet loaded URI.
     */
    async load_() {
        if (!this.image_) {
            this.image_ = new Image();
        }
        this.image_.src = this.src_;
        try {
            await this.image_.decode();
        }
        catch (e) {
            this.image_.onload = function () {
                return true;
            };
            this.image_.onerror = function () {
                throw new Error("加载图片失败！");
            };
        }
    }
    replaceColor_() {
        if (!this.color_ || this.canvas_ || !this.image_) {
            return;
        }
        const image = this.image_;
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(image.width);
        canvas.height = Math.ceil(image.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = this.color_;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(image, 0, 0);
        this.canvas_ = canvas;
    }
}
function getColorImage(src, color) {
    const key = src + ":" + color;
    let img = iconImageCache[key];
    if (!img) {
        const iconImage = new IconImage(src, color);
        iconImageCache[key] = iconImage.getImage();
    }
    return iconImageCache[key];
}
