import { ISelection } from "../../types";

const CHAR_COUNT = 100;

class TextMeasure {
  $measureLayerDom = null;
  charSizeCache: {width: number, height: number}[] = [];

  init(measureLayerDom) {
    this.$measureLayerDom = measureLayerDom;
  }

  measureSingleCharSize(char) {
    if (!this.$measureLayerDom) {
      return { width: 0, height: 0 };
    }

    this.$measureLayerDom.textContent = char.repeat(CHAR_COUNT);
    var rect = this.$measureLayerDom.getBoundingClientRect();
    return {
      width: rect.width / CHAR_COUNT,
      height: rect.hight,
    };
  }

  measureStringSize(str) {
    if (!this.$measureLayerDom) {
      return { width: 0, heigh: 0 };
    }

    this.$measureLayerDom.textContent = str;
    var rect = this.$measureLayerDom.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
    };
  }

  screenPositionToSelection(content, { x, y }: { x: number, y: number }): ISelection {
    let accWidth = 0;
    let targetOffset = 0;

    for (let i = 0; i < content.length; i++) {
      const char = content[i];

      if (accWidth >= x) {
        break;
      }

      if (!this.charSizeCache[char]) {
        const charSize = this.measureSingleCharSize(char);
        this.charSizeCache[char] = charSize;
      }

      accWidth += this.charSizeCache[char].width;

      targetOffset = i;
    }

    return [targetOffset + 1, targetOffset + 1];
  };
}

export default new TextMeasure();